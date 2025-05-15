
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import { useLanguage } from '@/hooks/useLanguage';

interface CertificatesSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  sfpCertificatePreview: string | null;
  handleSfpCertificateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ 
  form, 
  sfpCertificatePreview, 
  handleSfpCertificateChange 
}) => {
  const { t } = useLanguage();
  
  // Create fallbacks for missing translation properties
  const profileText = t?.dashboard?.profile || {
    fspCertificate: "FSP Certificate",
    fspCertificateDesc: "Check if you have an FSP (Foreign Specialist Physician) certificate",
    uploadCertificate: "Upload FSP Certificate",
    certificateUploaded: "Certificate uploaded"
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="fspCertificate"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{profileText.fspCertificate || "FSP Certificate"}</FormLabel>
              <p className="text-sm text-muted-foreground">
                {profileText.fspCertificateDesc || "Check if you have an FSP (Foreign Specialist Physician) certificate"}
              </p>
            </div>
          </FormItem>
        )}
      />

      {form.watch("fspCertificate") && (
        <div className="border rounded-md p-4">
          <FormLabel>{profileText.fspCertificate || "FSP Certificate"}</FormLabel>
          <div className="flex items-center gap-2 mt-2">
            <Input
              id="fspCertificateFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleSfpCertificateChange}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('fspCertificateFile')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {profileText.uploadCertificate || "Upload FSP Certificate"}
            </Button>
            {sfpCertificatePreview && (
              <span className="text-sm text-green-600 flex items-center">
                <Check className="h-4 w-4 mr-1" /> {profileText.certificateUploaded || "Certificate uploaded"}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CertificatesSection;
