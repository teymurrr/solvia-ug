
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Check, 
  X, 
  ChevronDown, 
  Eye, 
  FileText, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle2, 
  XCircle,
  AlertCircle,
  UserCircle
} from 'lucide-react';
import { Application, ApplicationStatus } from '@/hooks/applications/types';
import { useLanguage } from '@/hooks/useLanguage';

interface ApplicationCardProps {
  application: Application;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus) => Promise<boolean>;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onUpdateStatus }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useLanguage();
  
  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(application.id, newStatus);
    setIsUpdating(false);
  };
  
  const getStatusBadge = () => {
    switch (application.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{t?.applications?.pending || "Pending Review"}</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t?.applications?.reviewing || "Under Review"}</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">{t?.applications?.accepted || "Accepted"}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">{t?.applications?.rejected || "Rejected"}</Badge>;
      default:
        return <Badge variant="outline">{t?.applications?.unknown || "Unknown"}</Badge>;
    }
  };
  
  const getStatusIcon = () => {
    switch (application.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'accepted':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={application.applicantPhoto} alt={application.applicantName} />
            <AvatarFallback>{getInitials(application.applicantName || '')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{application.applicantName}</h3>
            <p className="text-muted-foreground text-sm">{application.vacancyTitle}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-muted-foreground">{t?.applications?.appliedOn || "Applied"}: {application.appliedDate}</span>
              {getStatusBadge()}
            </div>
          </div>
          
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {t?.applications?.viewDetails || "View Details"}
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    {t?.applications?.applicationDetails || "Application Details"}
                  </DialogTitle>
                  <DialogDescription>
                    {t?.applications?.reviewApplication || "Review the application for"} {application.vacancyTitle}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={application.applicantPhoto} alt={application.applicantName} />
                      <AvatarFallback>{getInitials(application.applicantName || '')}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{application.applicantName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon()}
                        <span className="text-sm">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{application.applicantEmail || t?.applications?.noEmailProvided || 'No email provided'}</span>
                    </div>
                    
                    {application.applicantPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{application.applicantPhone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">{t?.applications?.appliedFor || "Applied for"}:</h4>
                    <p className="text-sm bg-muted p-2 rounded">{application.vacancyTitle}</p>
                  </div>
                  
                  {application.coverLetter && (
                    <div>
                      <h4 className="font-medium mb-2">{t?.applications?.coverLetter || "Cover Letter"}:</h4>
                      <div className="text-sm max-h-40 overflow-y-auto bg-muted p-3 rounded">
                        {application.coverLetter.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {application.cvFileName && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.cvFileName}</span>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-6">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusUpdate('pending')} 
                      disabled={application.status === 'pending' || isUpdating}
                      className="flex-1"
                    >
                      {t?.applications?.markPending || "Mark Pending"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusUpdate('reviewing')} 
                      disabled={application.status === 'reviewing' || isUpdating}
                      className="flex-1"
                    >
                      {t?.applications?.startReview || "Start Review"}
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleStatusUpdate('rejected')} 
                      disabled={application.status === 'rejected' || isUpdating}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-1" /> {t?.applications?.reject || "Reject"}
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => handleStatusUpdate('accepted')} 
                      disabled={application.status === 'accepted' || isUpdating}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-1" /> {t?.applications?.accept || "Accept"}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isUpdating}>
                  <span className="sr-only">{t?.applications?.updateStatus || "Update status"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusUpdate('pending')} disabled={application.status === 'pending'}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{t?.applications?.markAsPending || "Mark as Pending"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate('reviewing')} disabled={application.status === 'reviewing'}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>{t?.applications?.startReview || "Start Review"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate('accepted')} disabled={application.status === 'accepted'}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>{t?.applications?.accept || "Accept"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate('rejected')} disabled={application.status === 'rejected'}>
                  <XCircle className="mr-2 h-4 w-4" />
                  <span>{t?.applications?.reject || "Reject"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
