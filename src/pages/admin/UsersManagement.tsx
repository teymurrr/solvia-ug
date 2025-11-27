
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Globe, GraduationCap, Stethoscope, FileCheck, Languages } from 'lucide-react';

interface ProfessionalUser {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string | null;
  profession: string | null;
  location: string | null;
  target_country: string | null;
  study_country: string | null;
  doctor_type: string | null;
  documents_ready: string | null;
  language_level: string | null;
  created_at: string;
  actively_searching: boolean | null;
}

const targetCountryLabels: Record<string, string> = {
  germany: '🇩🇪 Germany',
  austria: '🇦🇹 Austria',
  spain: '🇪🇸 Spain',
  italy: '🇮🇹 Italy',
  france: '🇫🇷 France',
};

const doctorTypeLabels: Record<string, string> = {
  general: 'General Practitioner',
  specialist: 'Specialist',
  nurse: 'Nurse',
  dentist: 'Dentist',
  other: 'Other',
  unsure: 'Not Sure',
};

const documentsReadyLabels: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  unsure: 'Not Sure',
};

const UsersManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<ProfessionalUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ProfessionalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetCountryFilter, setTargetCountryFilter] = useState<string>('all');
  const [doctorTypeFilter, setDoctorTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, targetCountryFilter, doctorTypeFilter]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(term) ||
          user.last_name?.toLowerCase().includes(term) ||
          user.specialty?.toLowerCase().includes(term) ||
          user.study_country?.toLowerCase().includes(term)
      );
    }

    if (targetCountryFilter !== 'all') {
      filtered = filtered.filter((user) => user.target_country === targetCountryFilter);
    }

    if (doctorTypeFilter !== 'all') {
      filtered = filtered.filter((user) => user.doctor_type === doctorTypeFilter);
    }

    setFilteredUsers(filtered);
  };

  const getWizardCompletionStatus = (user: ProfessionalUser) => {
    const hasWizardData = user.target_country || user.study_country || user.doctor_type;
    return hasWizardData;
  };

  const stats = {
    total: users.length,
    withWizardData: users.filter(getWizardCompletionStatus).length,
    activelySearching: users.filter((u) => u.actively_searching).length,
    byTargetCountry: users.reduce((acc, user) => {
      if (user.target_country) {
        acc[user.target_country] = (acc[user.target_country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">View all professional users and their wizard data</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">With Wizard Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withWizardData}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Actively Searching</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activelySearching}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Target Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {Object.entries(stats.byTargetCountry).map(([country, count]) => (
                  <Badge key={country} variant="secondary" className="text-xs">
                    {targetCountryLabels[country]?.split(' ')[0] || country}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, specialty, or study country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={targetCountryFilter} onValueChange={setTargetCountryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Target Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="germany">🇩🇪 Germany</SelectItem>
                  <SelectItem value="austria">🇦🇹 Austria</SelectItem>
                  <SelectItem value="spain">🇪🇸 Spain</SelectItem>
                  <SelectItem value="italy">🇮🇹 Italy</SelectItem>
                  <SelectItem value="france">🇫🇷 France</SelectItem>
                </SelectContent>
              </Select>
              <Select value={doctorTypeFilter} onValueChange={setDoctorTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Doctor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General Practitioner</SelectItem>
                  <SelectItem value="specialist">Specialist</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="dentist">Dentist</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Users ({filteredUsers.length})</CardTitle>
            <CardDescription>All registered professional users with their homologation wizard data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Target Country
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        Study Country
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="h-4 w-4" />
                        Type
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <FileCheck className="h-4 w-4" />
                        Documents
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Languages className="h-4 w-4" />
                        Language
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          {user.specialty && (
                            <div className="text-sm text-muted-foreground">{user.specialty}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.target_country ? (
                          <Badge variant="outline">
                            {targetCountryLabels[user.target_country] || user.target_country}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.study_country || <span className="text-muted-foreground text-sm">-</span>}
                      </TableCell>
                      <TableCell>
                        {user.doctor_type ? (
                          <Badge variant="secondary">
                            {doctorTypeLabels[user.doctor_type] || user.doctor_type}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.documents_ready ? (
                          <Badge
                            variant={user.documents_ready === 'yes' ? 'default' : 'secondary'}
                          >
                            {documentsReadyLabels[user.documents_ready] || user.documents_ready}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.language_level ? (
                          <Badge variant="outline">{user.language_level}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.actively_searching ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No users found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UsersManagement;
