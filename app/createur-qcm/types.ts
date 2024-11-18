export interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QCM {
  questions: Question[];
  metadata: {
    createdAt: string;
    totalQuestions: number;
  };
}