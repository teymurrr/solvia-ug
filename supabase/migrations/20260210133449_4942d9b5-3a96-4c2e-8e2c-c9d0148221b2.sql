
-- Seed 10 community discussion threads
-- Using a system user approach: pick the first available professional profile as author
DO $$
DECLARE
  seed_user_id uuid;
BEGIN
  -- Get a real user to attribute posts to
  SELECT id INTO seed_user_id FROM professional_profiles LIMIT 1;
  
  IF seed_user_id IS NULL THEN
    RAISE EXCEPTION 'No professional profiles found to seed posts';
  END IF;

  INSERT INTO community_posts (user_id, title, content, category, tags, is_pinned, upvotes, reply_count) VALUES
  (seed_user_id, 'How long does the homologation process take in Germany?', 
   'I recently started my homologation journey and I''m trying to plan ahead. For those who have been through the process — how long did it take from submitting your documents to receiving your Approbation? I''m a general practitioner from Colombia and my documents are already apostilled. Any timeline advice would be really helpful!', 
   'homologation', ARRAY['timeline', 'approbation'], true, 12, 0),

  (seed_user_id, 'Tips for passing the FSP exam on your first attempt', 
   'I passed my FSP (Fachsprachprüfung) last month in Bayern and wanted to share some tips that helped me. First, practice with real patient cases — not just textbook scenarios. Second, focus on the Arztbrief structure, it''s heavily weighted. Third, do mock exams with a partner who can play the patient role. What strategies worked for you?', 
   'fsp', ARRAY['exam-tips', 'bayern'], true, 24, 0),

  (seed_user_id, 'Best resources for reaching B2 German level?', 
   'I''m currently at B1 and need to reach B2 for my medical license application. I''ve been using online courses but feel like I''m plateauing. Can anyone recommend specific resources, language schools, or study methods that helped you break through to B2? I''m particularly struggling with medical terminology.', 
   'language', ARRAY['b2', 'resources'], false, 8, 0),

  (seed_user_id, 'Which German federal states have the fastest Approbation processing?', 
   'I''ve heard that processing times vary significantly between Bundesländer. Some colleagues say Sachsen and Thüringen are faster, while Bayern and Baden-Württemberg can take much longer. What has been your experience? I''m flexible on where to settle and want to start practicing as soon as possible.', 
   'homologation', ARRAY['bundesland', 'processing-time'], false, 15, 0),

  (seed_user_id, 'Life in Germany as an international doctor — what surprised you most?', 
   'I moved to Germany 6 months ago and there have been so many surprises — both positive and challenging. The work-life balance is incredible compared to my home country, but bureaucracy is no joke! I''d love to hear what surprised other international doctors the most about living and working here.', 
   'life-abroad', ARRAY['culture', 'experience'], false, 19, 0),

  (seed_user_id, 'How to find your first hospital position in Germany?', 
   'I recently received my Berufserlaubnis and I''m now looking for my first Assistenzarzt position. Should I apply directly to hospitals, use job portals, or work with recruitment agencies? Any advice on CV format and what German hospitals look for in international candidates would be greatly appreciated.', 
   'job-search', ARRAY['first-job', 'assistenzarzt'], false, 11, 0),

  (seed_user_id, 'FSP preparation courses — online vs in-person?', 
   'I''m debating whether to take an online FSP preparation course or attend one in person. Online is more convenient and cheaper, but I worry about missing the hands-on practice with real patient simulations. Has anyone tried both? Which format better prepared you for the actual exam?', 
   'fsp', ARRAY['courses', 'preparation'], false, 7, 0),

  (seed_user_id, 'Document apostille and translation — step by step guide', 
   'I want to share my experience getting documents apostilled and translated for the German homologation process. The order matters! First get your documents apostilled in your home country, then get them translated by a certified translator in Germany. I made the mistake of translating first and had to redo everything. Learn from my mistakes!', 
   'homologation', ARRAY['documents', 'apostille', 'translation'], false, 16, 0),

  (seed_user_id, 'Recommended cities for international doctors in Germany?', 
   'I''m trying to decide where to settle in Germany. I''m looking for a city with a good international community, reasonable cost of living, and hospitals that are welcoming to foreign doctors. I''ve heard good things about Leipzig, Dresden, and smaller cities in NRW. What are your recommendations and why?', 
   'life-abroad', ARRAY['cities', 'relocation'], false, 13, 0),

  (seed_user_id, 'From B1 to medical German — my 6-month study plan', 
   'I want to share the study plan that took me from B1 to passing the Fachsprachprüfung in 6 months. Month 1-2: Intensive B2 course. Month 3-4: Medical German vocabulary + Arztbrief practice daily. Month 5-6: Mock FSP exams twice a week + hospital shadowing. The key was consistency — 2 hours every single day without exception.', 
   'language', ARRAY['study-plan', 'medical-german'], false, 21, 0);

END $$;
