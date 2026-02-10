
import type { BadgeDefinition } from '@/hooks/useReputation';

export const getBadgeName = (badge: BadgeDefinition, language: string): string => {
  const key = `name_${language}` as keyof BadgeDefinition;
  return (badge[key] as string) || badge.name_en;
};

export const getBadgeDescription = (badge: BadgeDefinition, language: string): string => {
  const key = `description_${language}` as keyof BadgeDefinition;
  return (badge[key] as string) || badge.description_en;
};
