
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserReputation {
  id: string;
  user_id: string;
  total_points: number;
  posts_count: number;
  replies_count: number;
  upvotes_received: number;
  best_answers_count: number;
}

export interface BadgeDefinition {
  id: string;
  slug: string;
  name_en: string;
  name_de: string | null;
  name_es: string | null;
  name_fr: string | null;
  name_ru: string | null;
  description_en: string;
  description_de: string | null;
  description_es: string | null;
  description_fr: string | null;
  description_ru: string | null;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: BadgeDefinition;
}

export interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  posts_count: number;
  replies_count: number;
  upvotes_received: number;
  best_answers_count: number;
  profile?: {
    first_name: string;
    last_name: string;
    specialty: string | null;
    profile_image: string | null;
  };
  badges: UserBadge[];
}

export const useLeaderboard = (limit = 10) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const { data: reputations, error } = await supabase
        .from('user_reputation')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(limit);
      if (error) throw error;

      const userIds = (reputations || []).map(r => r.user_id);
      if (userIds.length === 0) return [];

      const [{ data: profiles }, { data: userBadges }] = await Promise.all([
        supabase
          .from('professional_profiles')
          .select('id, first_name, last_name, specialty, profile_image')
          .in('id', userIds),
        supabase
          .from('user_badges')
          .select('*, badge:badge_definitions(*)')
          .in('user_id', userIds),
      ]);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));
      const badgeMap = new Map<string, UserBadge[]>();
      (userBadges || []).forEach((ub: any) => {
        const existing = badgeMap.get(ub.user_id) || [];
        existing.push(ub);
        badgeMap.set(ub.user_id, existing);
      });

      return (reputations || []).map(rep => ({
        ...rep,
        profile: profileMap.get(rep.user_id) || {
          first_name: 'Anonymous',
          last_name: '',
          specialty: null,
          profile_image: null,
        },
        badges: badgeMap.get(rep.user_id) || [],
      })) as LeaderboardEntry[];
    },
  });
};

export const useUserReputation = (userId?: string) => {
  return useQuery({
    queryKey: ['user-reputation', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('user_reputation')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as UserReputation | null;
    },
    enabled: !!userId,
  });
};

export const useUserBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badge:badge_definitions(*)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });
      if (error) throw error;
      return (data || []) as UserBadge[];
    },
    enabled: !!userId,
  });
};

export const useAllBadges = () => {
  return useQuery({
    queryKey: ['badge-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('badge_definitions')
        .select('*')
        .order('requirement_value', { ascending: true });
      if (error) throw error;
      return (data || []) as BadgeDefinition[];
    },
  });
};
