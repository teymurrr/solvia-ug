
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useOwner } from '@/hooks/useOwner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DebugAuthStatus = () => {
  const { user, isLoggedIn, loading: authLoading, session, userType } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { isOwner, loading: ownerLoading } = useOwner();

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>🔍 Debug: Authentication Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Auth Loading:</strong> 
            <Badge variant={authLoading ? "destructive" : "default"} className="ml-2">
              {authLoading ? "Loading" : "Ready"}
            </Badge>
          </div>
          <div>
            <strong>Is Logged In:</strong> 
            <Badge variant={isLoggedIn ? "default" : "destructive"} className="ml-2">
              {isLoggedIn ? "Yes" : "No"}
            </Badge>
          </div>
          <div>
            <strong>User Type:</strong> 
            <Badge variant="outline" className="ml-2">
              {userType || "None"}
            </Badge>
          </div>
          <div>
            <strong>Has Session:</strong> 
            <Badge variant={session ? "default" : "destructive"} className="ml-2">
              {session ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Admin Loading:</strong> 
              <Badge variant={adminLoading ? "destructive" : "default"} className="ml-2">
                {adminLoading ? "Loading" : "Ready"}
              </Badge>
            </div>
            <div>
              <strong>Is Admin:</strong> 
              <Badge variant={isAdmin ? "default" : "destructive"} className="ml-2">
                {isAdmin ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <strong>Owner Loading:</strong> 
              <Badge variant={ownerLoading ? "destructive" : "default"} className="ml-2">
                {ownerLoading ? "Loading" : "Ready"}
              </Badge>
            </div>
            <div>
              <strong>Is Owner:</strong> 
              <Badge variant={isOwner ? "default" : "destructive"} className="ml-2">
                {isOwner ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <strong>User Details:</strong>
          <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
            <div><strong>ID:</strong> {user?.id || "None"}</div>
            <div><strong>Email:</strong> {user?.email || "None"}</div>
            <div><strong>Email Verified:</strong> {user?.email_confirmed_at ? "Yes" : "No"}</div>
            <div><strong>Created:</strong> {user?.created_at || "None"}</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <strong>User Metadata:</strong>
          <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
            <pre>{JSON.stringify(user?.user_metadata, null, 2) || "None"}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugAuthStatus;
