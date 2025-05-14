
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Upload } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface ProfileImageSectionProps {
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  imagePreview,
  handleImageChange,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <Avatar className="h-24 w-24">
        {imagePreview ? (
          <AvatarImage 
            src={imagePreview} 
            alt="Profile" 
            width={96}
            height={96}
          />
        ) : (
          <AvatarFallback>
            <User className="h-12 w-12" />
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
          Upload Photo
        </Button>
      </div>
    </div>
  );
};

export default ProfileImageSection;
