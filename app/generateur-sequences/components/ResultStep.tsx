"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock } from 'lucide-react';
import Feedback from '@/components/Feedback';
import { Sequence } from '../types';

interface ResultStepProps {
  sequence: Sequence | null;
  onRestart: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ sequence, onRestart }) => {
  if (!sequence) return null;

  const handleCopy = () => {
    const content = `${sequence.title}\n\nDurée: ${sequence.duration}\n\nObjectifs:\n${sequence.objectives.join('\n')}\n\nSéances:\n${sequence.sessions.map(session => `\nSéance ${session.number} (${session.duration}):\n${session.activities.map(act => `- ${act.type} (${act.duration}): ${act.content}`).join('\n')}`).join('\n')}`;
    navigator.clipboard.writeText(content);
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="sessions">Séances</TabsTrigger>
        <TabsTrigger value="resources">Ressources</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium">{sequence.title}</h3>
              <div className="text-sm text-gray-600">{sequence.duration}</div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Objectifs</h4>
              <ul className="list-disc pl-4 space-y-1">
                {sequence.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            <Feedback
              onFeedback={(type, comment) => {
                console.log('Feedback:', { type, comment, tool: 'sequence-generator' });
              }}
              onCopy={handleCopy}
              onRestart={onRestart}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sessions">
        <div className="space-y-4">
          {sequence.sessions.map((session, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Séance {session.number}</CardTitle>
                <CardDescription>{session.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {session.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{activity.duration}</span>
                      <span>{activity.type}: {activity.content}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="resources">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Les ressources seront disponibles prochainement.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};