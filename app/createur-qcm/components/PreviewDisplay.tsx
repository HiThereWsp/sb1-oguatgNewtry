"use client"

import React from 'react';
import { Question } from '../types';

interface PreviewDisplayProps {
  questions: Question[];
}

export const PreviewDisplay = ({ questions }: PreviewDisplayProps) => (
  <div className="border-t mt-4 pt-4">
    <h3 className="font-medium mb-4">Aperçu du QCM</h3>
    <div className="space-y-4 text-sm">
      {questions.map((question, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded">
          <p className="font-medium mb-2">{index + 1}. {question.text}</p>
          <div className="space-y-1 pl-4">
            {question.options.map((option, idx) => (
              <p key={idx} className={idx === question.correctAnswer ? 'text-green-600' : ''}>
                {String.fromCharCode(65 + idx)}) {option}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);