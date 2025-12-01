import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, UserPlus, Shield, ArrowLeft, CheckCircle, Clock, User } from 'lucide-react';

interface UserWithAccess {
  id: string;
  email: string;
  created_at: string;
  user_type: string;
  first_name?: string;
  last_name?: string;
  target_country?: string;
  paid_access: Array<{
    target_country: string;
    product_type: string;
    status: string;
    payment_method: string;
    created_at: string;
  }>;
}

interface GrantAccessFormData {
  targetCountry: string;
  productType: string;
  paymentMethod: string;
  amount: string;
  adminNotes: string;
}

const COUNTRIES = [
  { value: 'germany', label: 'Germany' },
  { value: 'austria', label: 'Austria' },
  { value: 'switzerland', label: 'Switzerland' },
];

const PRODUCT_TYPES = [
  { value: 'homologation', label: 'Homologation' },
  { value: 'language_prep', label: 'Language Preparation' },
  { value: 'premium_support', label: 'Premium Support' },
];

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'manual', label: 'Manual Grant (Free)' },
  { value: 'other', label: 'Other' },
];

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserWithAccess[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithAccess | null>(null);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [granting, setGranting] = useState(false);
  const [formData, setFormData] = useState<GrantAccessFormData>({
    targetCountry: '',
    productType: 'homologation',
    paymentMethod: 'bank_transfer',
    amount: '',
    adminNotes: '',
  });

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter an email or name to search",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-users-for-admin', {
        body: null,
        headers: {},
      });

      // We need to pass the search as a query param but functions.invoke doesn't support that directly
      // So we'll make a direct fetch call
      const response = await fetch(
        `https://ehrxpaxvyuwiwqclqkyh.supabase.co/functions/v1/get-users-for-admin?search=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users');
      }

      setUsers(result.users || []);
      
      if (result.users?.length === 0) {
        toast({
          title: "No Users Found",
          description: "No users match your search criteria",
        });
      }
    } catch (error: any) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!selectedUser || !formData.targetCountry || !formData.productType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setGranting(true);
    try {
      const { data, error } = await supabase.functions.invoke('grant-manual-access', {
        body: {
          targetUserId: selectedUser.id,
          targetCountry: formData.targetCountry,
          productType: formData.productType,
          paymentMethod: formData.paymentMethod,
          amount: parseFloat(formData.amount) || 0,
          adminNotes: formData.adminNotes,
        },
      });

      if (error) throw error;

      toast({
        title: "Access Granted",
        description: `Successfully granted ${formData.productType} access for ${formData.targetCountry} to ${selectedUser.email}`,
      });

      // Update local state
      setUsers(prev => prev.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            paid_access: [
              ...u.paid_access,
              {
                target_country: formData.targetCountry,
                product_type: formData.productType,
                status: 'completed',
                payment_method: formData.paymentMethod,
                created_at: new Date().toISOString(),
              }
            ]
          };
        }
        return u;
      }));

      setGrantDialogOpen(false);
      setFormData({
        targetCountry: '',
        productType: 'homologation',
        paymentMethod: 'bank_transfer',
        amount: '',
        adminNotes: '',
      });
    } catch (error: any) {
      console.error('Error granting access:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to grant access",
        variant: "destructive",
      });
    } finally {
      setGranting(false);
    }
  };

  const openGrantDialog = (user: UserWithAccess) => {
    setSelectedUser(user);
    setFormData({
      targetCountry: user.target_country || '',
      productType: 'homologation',
      paymentMethod: 'bank_transfer',
      amount: '',
      adminNotes: '',
    });
    setGrantDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              User Access Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Search users and grant manual payment access
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                className="flex-1"
              />
              <Button onClick={searchUsers} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {users.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Search Results ({users.length})
            </h2>
            
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}` 
                              : user.email}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline">
                          {user.user_type || 'Unknown Type'}
                        </Badge>
                        {user.target_country && (
                          <Badge variant="secondary">
                            Target: {user.target_country}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </Badge>
                      </div>

                      {/* Current Access */}
                      {user.paid_access.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-foreground mb-2">Current Access:</p>
                          <div className="flex flex-wrap gap-2">
                            {user.paid_access.map((access, idx) => (
                              <Badge key={idx} className="bg-green-500/10 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {access.target_country} - {access.product_type}
                                {access.payment_method !== 'stripe' && ` (${access.payment_method})`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <Button onClick={() => openGrantDialog(user)} className="w-full md:w-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Grant Access
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Search for users by email or name to manage their access
            </p>
          </Card>
        )}

        {/* Grant Access Dialog */}
        <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Grant Access to {selectedUser?.email}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="country">Target Country *</Label>
                <Select
                  value={formData.targetCountry}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetCountry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product Type *</Label>
                <Select
                  value={formData.productType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, productType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map(m => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount Paid (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 599"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Bank transfer received 15.11.2024, ref: SOL-2024-123"
                  value={formData.adminNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGrantAccess} disabled={granting}>
                {granting ? 'Granting...' : 'Grant Access'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
