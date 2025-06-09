
import React from 'react';
import { Star, Smile, Users, Clock } from 'lucide-react';

interface IconProps {
  className?: string;
}

export const StarIcon: React.FC<IconProps> = ({ className }) => (
  <Star className={className} />
);

export const SmileIcon: React.FC<IconProps> = ({ className }) => (
  <Smile className={className} />
);

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <Users className={className} />
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <Clock className={className} />
);

// Bundle the most commonly used icons together
export const BundledIcons = {
  Star: StarIcon,
  Smile: SmileIcon,
  Users: UsersIcon,
  Clock: ClockIcon,
};
