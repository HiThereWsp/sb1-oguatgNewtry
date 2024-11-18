"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface QuestionFormProps {
  currentQuestion: {
    text: string;
    options: string[];
    correctAnswer: number;
  };
  onQuestionChange: (value: string) => void;
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (index: number) => void;
  onAddQuestion: () => void;
}

export const QuestionForm = ({
  currentQuestion,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswerChange,
  onAddQuestion
}: QuestionFormProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">Question</label>
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Entrez votre question..."
        value={currentQuestion.text}
        onChange={(e) => onQuestionChange(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">Options de réponse</label>
      {currentQuestion.options.map((option, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="radio"
            name="correctAnswer"
            checked={currentQuestion.correctAnswer === index}
            onChange={() => onCorrectAnswerChange(index)}
            className="w-4 h-4"
          />
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder={`Option ${index + 1}...`}
            value={option}
            onChange={(e) => onOptionChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>

    <Button 
      onClick={onAddQuestion}
      disabled={!currentQuestion.text || !currentQuestion.options.every(opt => opt)}
      className="w-full"
    >
      <Plus className="w-4 h-4 mr-2" />
      Ajouter la question
    </Button>
  </div>
);