
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export const adminService = {
  async getAllAdmins(): Promise<AdminUser[]> {
    try {
      // Get all users with admin role
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (!adminRoles || adminRoles.length === 0) {
        return [];
      }

      const userIds = adminRoles.map(role => role.user_id);

      // Get user details from professional_profiles and institution_profiles
      const { data: professionals, error: profError } = await supabase
        .from('professional_profiles')
        .select('id, first_name, last_name, created_at')
        .in('id', userIds);

      const { data: institutions, error: instError } = await supabase
        .from('institution_profiles')
        .select('id, institution_name, created_at')
        .in('id', userIds);

      if (profError && instError) {
        throw new Error('Failed to fetch user profiles');
      }

      // We need to get emails from auth.users, but we can't query it directly
      // So we'll return what we can get from profiles
      const adminUsers: AdminUser[] = [];

      if (professionals) {
        professionals.forEach(prof => {
          adminUsers.push({
            id: prof.id,
            email: 'Email not available', // We can't query auth.users directly
            first_name: prof.first_name,
            last_name: prof.last_name,
            created_at: prof.created_at
          });
        });
      }

      if (institutions) {
        institutions.forEach(inst => {
          if (!adminUsers.find(user => user.id === inst.id)) {
            adminUsers.push({
              id: inst.id,
              email: 'Email not available',
              first_name: inst.institution_name,
              created_at: inst.created_at
            });
          }
        });
      }

      return adminUsers;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  async addAdmin(email: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('make-admin', {
        body: { email }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error adding admin:', error);
      throw error;
    }
  },

  async removeAdmin(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      throw error;
    }
  }
};
