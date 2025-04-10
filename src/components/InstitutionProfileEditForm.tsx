
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Upload } from 'lucide-react';

// Define the form schema
const institutionFormSchema = z.object({
  name: z.string().min(2, "Institution name must be at least 2 characters."),
  type: z.string().min(2, "Institution type is required."),
  email: z.string().email("Please enter a valid email."),
  website: z.string().optional(),
  size: z.string().optional(),
  location: z.string().min(2, "Location is required."),
  about: z.string().optional(),
  profileImage: z.string().optional(),
});

type InstitutionFormValues = z.infer<typeof institutionFormSchema>;

interface InstitutionProfileEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<InstitutionFormValues>;
}

const InstitutionProfileEditForm: React.FC<InstitutionProfileEditFormProps> = ({
  open,
  onOpenChange,
  initialData = {
    name: "General Hospital",
    type: "Hospital",
    email: "contact@hospital.com",
    website: "",
    size: "",
    location: "New York, USA",
    about: "",
    profileImage: "",
  }
}) => {
  const { toast } = useToast();
  
  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: InstitutionFormValues) => {
    // In a real application, this would save to a database
    console.log("Institution data to save:", data);
    
    toast({
      title: "Profile Updated",
      description: "Your institution profile has been successfully updated.",
    });
    
    onOpenChange(false);
  };

  const [imagePreview, setImagePreview] = React.useState<string | null>(initialData.profileImage || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Institution Profile</DialogTitle>
          <DialogDescription>
            Update your institution's information to attract healthcare professionals.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-4">
              <Avatar className="h-24 w-24 rounded-lg">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} alt="Institution Logo" />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    <Building2 className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex items-center gap-2">
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('profileImage')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Name</FormLabel>
                    <FormControl>
                      <Input placeholder="General Hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospital, Clinic, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@institution.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.institution.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="500+ beds, 1000+ staff, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your institution, its mission, facilities, and what makes it unique..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionProfileEditForm;
