
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, Check } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type?: string;
}

interface UserSelectorProps {
  onSelectUser: (email: string) => void;
  selectedEmail: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({ onSelectUser, selectedEmail }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get professional profiles with email lookup
      const { data: professionals, error: profError } = await supabase
        .from('professional_profiles')
        .select(`
          id, 
          first_name, 
          last_name
        `);

      // Get institution profiles with email lookup
      const { data: institutions, error: instError } = await supabase
        .from('institution_profiles')
        .select(`
          id, 
          institution_name
        `);

      if (profError && instError) {
        console.error('Error fetching users:', { profError, instError });
        return;
      }

      const allUsers: User[] = [];

      // Add professionals
      if (professionals) {
        for (const prof of professionals) {
          // Get email from auth.users via RPC or direct query
          const { data: authUser } = await supabase.auth.admin.getUserById(prof.id);
          const email = authUser?.user?.email || 'Email not available';
          
          allUsers.push({
            id: prof.id,
            email: email,
            first_name: prof.first_name,
            last_name: prof.last_name,
            user_type: 'professional'
          });
        }
      }

      // Add institutions
      if (institutions) {
        for (const inst of institutions) {
          if (!allUsers.find(user => user.id === inst.id)) {
            const { data: authUser } = await supabase.auth.admin.getUserById(inst.id);
            const email = authUser?.user?.email || 'Email not available';
            
            allUsers.push({
              id: inst.id,
              email: email,
              first_name: inst.institution_name,
              user_type: 'institution'
            });
          }
        }
      }

      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Fallback: If admin access fails, try to get users without emails
      try {
        const { data: professionals } = await supabase
          .from('professional_profiles')
          .select('id, first_name, last_name');

        const { data: institutions } = await supabase
          .from('institution_profiles')
          .select('id, institution_name');

        const fallbackUsers: User[] = [];

        if (professionals) {
          professionals.forEach(prof => {
            fallbackUsers.push({
              id: prof.id,
              email: 'Email access restricted',
              first_name: prof.first_name,
              last_name: prof.last_name,
              user_type: 'professional'
            });
          });
        }

        if (institutions) {
          institutions.forEach(inst => {
            if (!fallbackUsers.find(user => user.id === inst.id)) {
              fallbackUsers.push({
                id: inst.id,
                email: 'Email access restricted',
                first_name: inst.institution_name,
                user_type: 'institution'
              });
            }
          });
        }

        setUsers(fallbackUsers);
        setFilteredUsers(fallbackUsers);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showUserList && users.length === 0) {
      fetchUsers();
    }
  }, [showUserList]);

  useEffect(() => {
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.email.toLowerCase().includes(searchLower) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower))
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleUserSelect = (user: User) => {
    onSelectUser(user.email);
    setShowUserList(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter email address or search users"
          value={selectedEmail}
          onChange={(e) => onSelectUser(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUserList(!showUserList)}
          className="flex items-center"
        >
          <Users className="h-4 w-4 mr-2" />
          {showUserList ? 'Hide' : 'Browse'} Users
        </Button>
      </div>

      {showUserList && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600 mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedEmail === user.email ? 'bg-medical-50 border-medical-200' : 'border-gray-200'
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                        </div>
                        {selectedEmail === user.email && (
                          <Check className="h-5 w-5 text-medical-600" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No users found</p>
                    {searchTerm && (
                      <p className="text-sm">Try adjusting your search terms</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {users.some(user => user.email === 'Email access restricted' || user.email === 'Email not available') && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Some email addresses may not be accessible due to security restrictions. 
                  You can still select users and manually enter their correct email address.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSelector;
