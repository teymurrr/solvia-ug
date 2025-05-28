
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { makeUserAdmin } from '@/utils/adminUtils';

const AdminGranter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const grantAdminRights = async () => {
    const email = 'david.rehrl@thesolvia.com';
    
    try {
      setLoading(true);
      await makeUserAdmin(email);
      
      toast({
        title: "Success",
        description: `Admin rights granted to ${email}`,
      });
    } catch (error) {
      console.error('Error granting admin rights:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin rights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button 
        onClick={grantAdminRights} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Granting Admin Rights...' : 'Grant Admin Rights to david.rehrl@thesolvia.com'}
      </Button>
    </div>
  );
};

export default AdminGranter;
