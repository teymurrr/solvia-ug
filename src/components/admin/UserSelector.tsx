
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
      console.log('Fetching users with emails from server function...');
      
      const { data, error } = await supabase.functions.invoke('get-users-with-emails');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      if (data?.users) {
        console.log('Fetched users with emails:', data.users.length);
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
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
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower))
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleUserSelect = (user: User) => {
    onSelectUser(user.email);
    setShowUserList(false);
    console.log('Selected user:', user);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter email address or browse users below"
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
                  placeholder="Search by email, name..."
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
                          <p className="text-sm text-blue-600">{user.email}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                        </div>
                        {selectedEmail === user.email && (
                          <Check className="h-4 w-4 text-green-600" />
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSelector;
