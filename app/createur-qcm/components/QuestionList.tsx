"use client"

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Question } from '../types';

interface QuestionListProps {
  questions: Question[];
  onRemoveQuestion: (index: number) => void;
}

export const QuestionList = ({ questions, onRemoveQuestion }: QuestionListProps) => (
  <ScrollArea className="h-64 border rounded-md p-4">
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium">Question {index + 1}</h3>
              <p className="mt-1">{question.text}</p>
              <ul className="mt-2 space-y-1">
                {question.options.map((option, optIndex) => (
                  <li 
                    key={optIndex}
                    className={optIndex === question.correctAnswer ? 'text-green-600 font-medium' : ''}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveQuestion(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </ScrollArea>
);