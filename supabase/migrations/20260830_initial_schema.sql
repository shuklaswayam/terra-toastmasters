-- =========================================================================
-- TERRA TOASTMASTERS — COMPLETE SUPABASE POSTGRESQL SCHEMA & INITIAL SEED
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('member', 'officer', 'admin')),
  executive_title TEXT,
  avatar TEXT NOT NULL,
  phone TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  joined_date TEXT DEFAULT '',
  speeches_delivered INT DEFAULT 0,
  roles_completed INT DEFAULT 0,
  pathway_name TEXT DEFAULT '',
  pathway_level INT DEFAULT 0,
  member_id TEXT DEFAULT '',
  awards_won INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEETINGS TABLE
CREATE TABLE IF NOT EXISTS public.meetings (
  id TEXT PRIMARY KEY,
  meeting_number INT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  word_of_the_day JSONB NOT NULL DEFAULT '{"word": "Resilience", "partOfSpeech": "noun", "definition": "The capacity to recover quickly from difficulties.", "exampleSentence": "Her resilience on the Toastmasters stage inspired everyone."}'::jsonb,
  meeting_date DATE NOT NULL,
  start_time TEXT NOT NULL DEFAULT '19:00 IST',
  end_time TEXT NOT NULL DEFAULT '21:00 IST',
  venue_type TEXT NOT NULL DEFAULT 'hybrid',
  location_name TEXT NOT NULL DEFAULT 'Terra Hall & Zoom Live',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
  toastmaster_of_the_day TEXT DEFAULT 'TM Swayam',
  general_evaluator TEXT DEFAULT 'TM Aadhya',
  table_topics_master TEXT DEFAULT 'TM Rohit',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEETING ROLES TABLE
CREATE TABLE IF NOT EXISTS public.meeting_roles (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('executive', 'speaker', 'evaluator', 'functionary')),
  allocated_minutes INT NOT NULL DEFAULT 5,
  assigned_user_id TEXT,
  assigned_user_name TEXT,
  assigned_user_avatar TEXT,
  speech_title TEXT,
  speech_pathway_project TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ
);

-- 4. AGENDA ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.agenda_items (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  sequence_order INT NOT NULL,
  start_time_offset TEXT NOT NULL,
  item_title TEXT NOT NULL,
  presenter_name TEXT NOT NULL,
  duration_minutes INT NOT NULL
);

-- 5. CONTESTS TABLE
CREATE TABLE IF NOT EXISTS public.contests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('international', 'table_topics', 'evaluation', 'humorous')),
  level TEXT NOT NULL DEFAULT 'club' CHECK (level IN ('club', 'area', 'division', 'district')),
  contest_date TEXT NOT NULL,
  start_time TEXT NOT NULL DEFAULT '18:30 IST',
  location_name TEXT NOT NULL DEFAULT 'Terra Stage & Zoom Live',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closing_soon', 'locked', 'completed')),
  chair_id TEXT NOT NULL,
  chair_name TEXT NOT NULL,
  chief_judge_id TEXT NOT NULL,
  chief_judge_name TEXT NOT NULL,
  contest_master_id TEXT,
  contest_master_name TEXT,
  max_contestants INT DEFAULT 8,
  test_speaker_count INT DEFAULT 0,
  eligibility_notes TEXT DEFAULT 'Member in good standing with 2+ speeches delivered.',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONTEST ROLE ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.contest_role_assignments (
  id TEXT PRIMARY KEY,
  contest_id TEXT NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  role_key TEXT NOT NULL,
  role_label TEXT NOT NULL,
  recruited_by TEXT NOT NULL CHECK (recruited_by IN ('cc', 'cj')),
  is_confidential BOOLEAN DEFAULT FALSE,
  user_id TEXT,
  user_name TEXT,
  user_avatar TEXT,
  is_guest BOOLEAN DEFAULT FALSE,
  guest_name TEXT,
  guest_club TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  notes TEXT,
  is_confirmed BOOLEAN DEFAULT FALSE
);

-- 7. CONTEST PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.contest_participants (
  id TEXT PRIMARY KEY,
  contest_id TEXT NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT NOT NULL,
  speech_title TEXT NOT NULL,
  speaking_order INT NOT NULL,
  registered_at TEXT NOT NULL
);

-- 8. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Workshop',
  event_date DATE NOT NULL,
  start_time TEXT NOT NULL DEFAULT '16:00 - 18:00 IST',
  location_name TEXT NOT NULL DEFAULT 'Studio 402, Bangalore',
  description TEXT NOT NULL,
  host_name TEXT NOT NULL DEFAULT 'Terra Toastmasters ExComm',
  dress_code TEXT DEFAULT 'Smart Casual',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EVENT RSVPS TABLE
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attending', 'maybe', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEDIA ALBUMS & ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year INT NOT NULL,
  month TEXT NOT NULL,
  meeting_date TEXT,
  cover_image_url TEXT NOT NULL,
  photo_count INT DEFAULT 0,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL REFERENCES public.media_albums(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SPEECH RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.speech_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meeting_number INT NOT NULL,
  meeting_date DATE NOT NULL,
  speech_title TEXT NOT NULL,
  pathway_project TEXT NOT NULL,
  evaluator_name TEXT NOT NULL,
  timing_minutes TEXT NOT NULL,
  award_won TEXT,
  private_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'general' CHECK (priority IN ('general', 'important', 'urgent')),
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TIMER LOGS TABLE
CREATE TABLE IF NOT EXISTS public.timer_logs (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  role_or_speech_type TEXT NOT NULL,
  target_min_seconds INT NOT NULL,
  target_max_seconds INT NOT NULL,
  actual_seconds INT NOT NULL,
  is_disqualified BOOLEAN DEFAULT FALSE,
  timestamp TEXT NOT NULL
);

-- 14. AH-COUNTER RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.ah_counter_records (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  ah_count INT DEFAULT 0,
  um_count INT DEFAULT 0,
  er_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  so_count INT DEFAULT 0,
  but_count INT DEFAULT 0,
  repeated_words INT DEFAULT 0
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speech_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ah_counter_records ENABLE ROW LEVEL SECURITY;

-- Public read access for club members
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public read meetings" ON public.meetings FOR SELECT USING (true);
CREATE POLICY "Public read meeting_roles" ON public.meeting_roles FOR SELECT USING (true);
CREATE POLICY "Public read agenda_items" ON public.agenda_items FOR SELECT USING (true);
CREATE POLICY "Public read contests" ON public.contests FOR SELECT USING (true);
CREATE POLICY "Public read contest_role_assignments" ON public.contest_role_assignments FOR SELECT USING (true);
CREATE POLICY "Public read contest_participants" ON public.contest_participants FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read event_rsvps" ON public.event_rsvps FOR SELECT USING (true);
CREATE POLICY "Public read media_albums" ON public.media_albums FOR SELECT USING (true);
CREATE POLICY "Public read media_assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public read timer_logs" ON public.timer_logs FOR SELECT USING (true);
CREATE POLICY "Public read ah_counter_records" ON public.ah_counter_records FOR SELECT USING (true);
CREATE POLICY "Public read speech_records" ON public.speech_records FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service full users" ON public.users FOR ALL USING (true);
CREATE POLICY "Service full meetings" ON public.meetings FOR ALL USING (true);
CREATE POLICY "Service full meeting_roles" ON public.meeting_roles FOR ALL USING (true);
CREATE POLICY "Service full agenda_items" ON public.agenda_items FOR ALL USING (true);
CREATE POLICY "Service full contests" ON public.contests FOR ALL USING (true);
CREATE POLICY "Service full contest_role_assignments" ON public.contest_role_assignments FOR ALL USING (true);
CREATE POLICY "Service full contest_participants" ON public.contest_participants FOR ALL USING (true);
CREATE POLICY "Service full events" ON public.events FOR ALL USING (true);
CREATE POLICY "Service full event_rsvps" ON public.event_rsvps FOR ALL USING (true);
CREATE POLICY "Service full media_albums" ON public.media_albums FOR ALL USING (true);
CREATE POLICY "Service full media_assets" ON public.media_assets FOR ALL USING (true);
CREATE POLICY "Service full announcements" ON public.announcements FOR ALL USING (true);
CREATE POLICY "Service full timer_logs" ON public.timer_logs FOR ALL USING (true);
CREATE POLICY "Service full ah_counter_records" ON public.ah_counter_records FOR ALL USING (true);
CREATE POLICY "Service full speech_records" ON public.speech_records FOR ALL USING (true);

-- =========================================================================
-- INITIAL SEED DATA: OFFICIAL TERRA TOASTMASTERS ROSTER
-- =========================================================================

INSERT INTO public.users (id, username, email, password_hash, name, role, executive_title, avatar) VALUES
  ('user-swayam', 'swayam', 'swayam@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Swayam', 'admin', 'Vice President Education & System Administrator', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Swayam'),
  ('user-aadhya', 'aadhya', 'aadhya@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Aadhya', 'officer', 'Club President', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Aadhya'),
  ('user-rohit', 'rohit', 'rohit@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Rohit', 'officer', 'Immediate Past President', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Rohit'),
  ('user-samarth', 'samarth', 'samarth@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Samarth', 'officer', 'Vice President Membership', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Samarth'),
  ('user-sanchana', 'sanchana', 'sanchana@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Sanchana', 'officer', 'Vice President Public Relations', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Sanchana'),
  ('user-malavika', 'malavika', 'malavika@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Malavika', 'officer', 'Club Secretary', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Malavika'),
  ('user-gabria', 'gabria', 'gabria@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Gabria', 'officer', 'Club Treasurer', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Gabria'),
  ('user-kavya', 'kavya', 'kavya@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Kavya', 'officer', 'Sergeant at Arms', 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Kavya'),
  ('user-prarthna', 'prarthna', 'prarthna@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Prarthna', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Prarthna'),
  ('user-gautami', 'gautami', 'gautami@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Gautami', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Gautami'),
  ('user-mayur', 'mayur', 'mayur@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Mayur', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Mayur'),
  ('user-suyash', 'suyash', 'suyash@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Suyash', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Suyash'),
  ('user-sangeeth', 'sangeeth', 'sangeeth@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Sangeeth', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Sangeeth'),
  ('user-krishnameet', 'krishnameet', 'krishnameet@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Krishnameet', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Krishnameet'),
  ('user-hemal', 'hemal', 'hemal@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Hemal', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Hemal'),
  ('user-smiyra', 'smiyra', 'smiyra@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Smiyra', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Smiyra'),
  ('user-makshita', 'makshita', 'makshita@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Makshita', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Makshita'),
  ('user-evelyn', 'evelyn', 'evelyn@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Evelyn', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Evelyn'),
  ('user-pavitra', 'pavitra', 'pavitra@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Pavitra', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Pavitra'),
  ('user-devanuj', 'devanuj', 'devanuj@terra.club', '$2b$10$0o.BvVKzQ6DBIoSXc.E4meqTo1OKnu0fF7T3bq4C.RckQmiPvpQo.', 'TM Devanuj', 'member', NULL, 'https://api.dicebear.com/7.x/initials/svg?seed=TM%20Devanuj')
ON CONFLICT (id) DO NOTHING;
