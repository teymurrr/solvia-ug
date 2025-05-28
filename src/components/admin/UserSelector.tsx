
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
      console.log('Fetching users from profile tables...');
      
      // Get professional profiles
      const { data: professionals, error: profError } = await supabase
        .from('professional_profiles')
        .select('id, first_name, last_name');

      // Get institution profiles
      const { data: institutions, error: instError } = await supabase
        .from('institution_profiles')
        .select('id, institution_name');

      if (profError) {
        console.error('Error fetching professionals:', profError);
      }
      
      if (instError) {
        console.error('Error fetching institutions:', instError);
      }

      const allUsers: User[] = [];

      // Add professionals
      if (professionals) {
        professionals.forEach(prof => {
          allUsers.push({
            id: prof.id,
            email: 'Please enter email manually', // Email not available from profile tables
            first_name: prof.first_name,
            last_name: prof.last_name,
            user_type: 'professional'
          });
        });
      }

      // Add institutions
      if (institutions) {
        institutions.forEach(inst => {
          if (!allUsers.find(user => user.id === inst.id)) {
            allUsers.push({
              id: inst.id,
              email: 'Please enter email manually', // Email not available from profile tables
              first_name: inst.institution_name,
              user_type: 'institution'
            });
          }
        });
      }

      console.log('Fetched users:', allUsers.length);
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower))
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleUserSelect = (user: User) => {
    // When clicking on a user, we'll copy their name to help the admin identify them
    // but they'll still need to enter the email manually
    setShowUserList(false);
    
    // Don't auto-fill with placeholder text, just close the list
    console.log('Selected user:', user);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter email address"
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
                  placeholder="Search users by name..."
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
                      className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 border-gray-200"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                          <p className="text-xs text-amber-600 mt-1">Email must be entered manually</p>
                        </div>
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

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Due to security restrictions, emails are not displayed in the user list. 
                Please manually enter the email address of the user you want to grant admin rights to.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSelector;
