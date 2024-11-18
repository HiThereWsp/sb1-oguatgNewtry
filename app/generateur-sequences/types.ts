export interface Sequence {
  title: string;
  duration: string;
  objectives: string[];
  sessions: {
    number: number;
    title: string;
    duration: string;
    activities: {
      type: string;
      content: string;
      duration: string;
    }[];
  }[];
}