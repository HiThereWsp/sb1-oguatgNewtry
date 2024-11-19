export interface UserData {
  id: string;
  email: string;
  teaching_level: 'maternelle' | 'elementaire' | 'college' | 'lycee';
  is_beta_tester: boolean;
  preferences: Record<string, any>;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface DailyMetric {
  id: string;
  date: string;
  tool_id: string;
  uses_count: number;
  unique_users: number;
}

export interface QCM {
  id: string;
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    correct_answer: number;
  }>;
  created_at: string;
  user_id: string;
}

export interface Sequence {
  id: string;
  title: string;
  level: string;
  subject: string;
  objectives: string[];
  sessions: Array<{
    title: string;
    duration: string;
    activities: Array<{
      type: string;
      content: string;
      duration: string;
    }>;
  }>;
  created_at: string;
  user_id: string;
}

export interface VocabularyList {
  id: string;
  title: string;
  level: string;
  words: Array<{
    word: string;
    definition: string;
    type: string;
    example: string;
    synonyms?: string[];
  }>;
  created_at: string;
  user_id: string;
}

export interface Database {
  user_data: UserData;
  tools: Tool;
  daily_metrics: DailyMetric;
  qcm: QCM;
  sequences: Sequence;
  vocabulary_lists: VocabularyList;
}