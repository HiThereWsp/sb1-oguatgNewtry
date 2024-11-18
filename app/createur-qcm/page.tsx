"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from "next/link";
import Feedback from '@/components/Feedback';
import { PreviewDisplay } from './components/PreviewDisplay';
import { QuestionForm } from './components/QuestionForm';
import { QuestionList } from './components/QuestionList';
import { LevelSelector } from './components/LevelSelector';
import type { Question } from './types';

export default function QCMGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    level: '',
    subject: '',
    topic: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleGenerate = async () => {
    if (!formData.level || !formData.subject || !formData.topic) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setError('');
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulation de la génération
      setQuestions([
        {
          text: "Question exemple générée",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 0
        }
      ]);
    } catch (err) {
      setError('Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      level: '',
      subject: '',
      topic: ''
    });
    setQuestions([]);
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  };

  const handleAddQuestion = () => {
    if (currentQuestion.text && currentQuestion.options.every(opt => opt)) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Générateur de QCM</CardTitle>
          <CardDescription>
            Créez des questionnaires à choix multiples adaptés au niveau de vos élèves
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <LevelSelector
              selectedLevel={formData.level}
              onLevelSelect={(level) => setFormData({ ...formData, level })}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Matière</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Mathématiques, Histoire..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thème</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Ex: Les fractions, La Révolution française..."
              />
            </div>

            <QuestionForm
              currentQuestion={currentQuestion}
              onQuestionChange={(text) => setCurrentQuestion({ ...currentQuestion, text })}
              onOptionChange={(index, value) => {
                const newOptions = [...currentQuestion.options];
                newOptions[index] = value;
                setCurrentQuestion({ ...currentQuestion, options: newOptions });
              }}
              onCorrectAnswerChange={(index) => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
              onAddQuestion={handleAddQuestion}
            />

            {questions.length > 0 && (
              <>
                <QuestionList
                  questions={questions}
                  onRemoveQuestion={(index) => {
                    setQuestions(questions.filter((_, i) => i !== index));
                  }}
                />
                <Feedback
                  onCopy={() => {
                    const textContent = questions
                      .map((q, i) => 
                        `${i + 1}. ${q.text}\n${q.options.map((opt, j) => 
                          `${String.fromCharCode(65 + j)}) ${opt}`).join('\n')}`
                      )
                      .join('\n\n');
                    navigator.clipboard.writeText(textContent);
                  }}
                  onRestart={handleReset}
                  onFeedback={(type, comment) => {
                    console.log('Feedback QCM:', { type, comment });
                  }}
                />
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
          
          <Button
            disabled={!formData.level || !formData.subject || !formData.topic || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Générer
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}