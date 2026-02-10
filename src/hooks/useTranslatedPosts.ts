import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CommunityPost, CommunityReply } from '@/hooks/useCommunity';

interface TranslationItem {
  id: string;
  type: 'post_title' | 'post_content' | 'reply_content';
  text: string;
}

interface TranslationResult {
  id: string;
  type: string;
  translated_text: string;
}

async function fetchTranslations(items: TranslationItem[], targetLanguage: string): Promise<TranslationResult[]> {
  if (!items.length || targetLanguage === 'en') return [];

  const { data, error } = await supabase.functions.invoke('translate-community', {
    body: { items, target_language: targetLanguage },
  });

  if (error) {
    console.error('Translation fetch error:', error);
    return [];
  }

  return data?.translations || [];
}

export function useTranslatedPosts(posts: CommunityPost[] | undefined, currentLanguage: string) {
  const postIds = (posts || []).map(p => p.id).sort().join(',');

  return useQuery({
    queryKey: ['translated-posts', postIds, currentLanguage],
    queryFn: async () => {
      if (!posts?.length || currentLanguage === 'en') return { posts, translatedIds: new Set<string>() };

      const items: TranslationItem[] = [];
      for (const post of posts) {
        items.push({ id: post.id, type: 'post_title', text: post.title });
        items.push({ id: post.id, type: 'post_content', text: post.content });
      }

      const translations = await fetchTranslations(items, currentLanguage);
      const translatedIds = new Set<string>();

      const translationMap = new Map<string, string>();
      for (const t of translations) {
        translationMap.set(`${t.type}:${t.id}`, t.translated_text);
      }

      const translatedPosts = posts.map(post => {
        const title = translationMap.get(`post_title:${post.id}`);
        const content = translationMap.get(`post_content:${post.id}`);
        const wasTranslated = (title && title !== post.title) || (content && content !== post.content);
        if (wasTranslated) translatedIds.add(post.id);
        return {
          ...post,
          title: title || post.title,
          content: content || post.content,
        };
      });

      return { posts: translatedPosts, translatedIds };
    },
    enabled: !!posts?.length,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev ?? { posts, translatedIds: new Set<string>() },
  });
}

export function useTranslatedReplies(replies: CommunityReply[] | undefined, currentLanguage: string) {
  const replyIds = (replies || []).map(r => r.id).sort().join(',');

  return useQuery({
    queryKey: ['translated-replies', replyIds, currentLanguage],
    queryFn: async () => {
      if (!replies?.length || currentLanguage === 'en') return { replies, translatedIds: new Set<string>() };

      const items: TranslationItem[] = replies.map(r => ({
        id: r.id,
        type: 'reply_content' as const,
        text: r.content,
      }));

      const translations = await fetchTranslations(items, currentLanguage);
      const translatedIds = new Set<string>();

      const translationMap = new Map<string, string>();
      for (const t of translations) {
        translationMap.set(t.id, t.translated_text);
      }

      const translatedReplies = replies.map(reply => {
        const content = translationMap.get(reply.id);
        const wasTranslated = content && content !== reply.content;
        if (wasTranslated) translatedIds.add(reply.id);
        return { ...reply, content: content || reply.content };
      });

      return { replies: translatedReplies, translatedIds };
    },
    enabled: !!replies?.length,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev ?? { replies, translatedIds: new Set<string>() },
  });
}
