export type JobStatus =
  | 'Saved'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Final Round'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted';

export interface StudyTopic {
  topic: string;
  hours: number;
  resource: string;
}

export interface InterviewQuestion {
  q: string;
  angle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CompanyInsights {
  about: string;
  tech_stack: string[];
  culture: string;
  news: string;
  glassdoor: string;
  interview_process: string;
}

export interface LakshyaProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  resume_text: string | null;
  resume_url: string | null;
  target_roles: string[];
  target_salary_min: number;
  target_locations: string[];
  preferred_domains: string[];
  tech_stack: string[];
  years_experience: number;
  current_company: string | null;
  current_role: string | null;
  apify_key: string | null;
  anthropic_key: string | null;
  openai_key: string | null;
  scraping_enabled: boolean;
  scrape_portals: string[];
  scrape_keywords: string[];
  min_match_score: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface LakshyaJob {
  id: string;
  user_id: string;
  company: string;
  role: string;
  portal: string | null;
  location: string | null;
  ctc_range: string | null;
  apply_link: string | null;
  jd_text: string | null;
  jd_summary: string | null;
  posted_date: string | null;
  match_score: number | null;
  interview_prob: number | null;
  decision: 'Apply Now' | 'Update First' | 'Skip' | null;
  decision_reason: string | null;
  why_fit: string[];
  gaps: string[];
  resume_updates: string[];
  study_topics: StudyTopic[];
  interview_questions: InterviewQuestion[];
  cold_message: string | null;
  cover_letter: string | null;
  company_insights: CompanyInsights | null;
  is_moonshot: boolean;
  status: JobStatus;
  applied_date: string | null;
  interview_round: string | null;
  response_received: string | null;
  offer_amount: string | null;
  notes: string | null;
  is_starred: boolean;
  date_scraped: string;
  created_at: string;
  updated_at: string;
}

export interface LakshyaStory {
  id: string;
  user_id: string;
  company: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
  created_at: string;
}

export interface LakshyaRun {
  id: string;
  user_id: string;
  run_date: string;
  jobs_scraped: number;
  jobs_new: number;
  jobs_scored: number;
  apply_now_count: number;
  update_first_count: number;
  skip_count: number;
  portals_used: string[];
  status: 'running' | 'completed' | 'failed';
  error_message: string | null;
  duration_seconds: number | null;
  created_at: string;
}
