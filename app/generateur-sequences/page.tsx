"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Send, Clock, Loader2, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import Feedback from '@/components/Feedback';

// Types
interface Sequence {
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

// Composant InitialStep
const InitialStep = ({ formData, setFormData, onNext }) => {
  const levels = {
    maternelle: ["PS", "MS", "GS"],
    elementaire: ["CP", "CE1", "CE2", "CM1", "CM2"],
    college: ["6ème", "5ème", "4ème", "3ème"]
  };

  const subjects = {
    maternelle: ["Langage", "Mathématiques", "Explorer le monde", "Activités artistiques"],
    elementaire: ["Français", "Mathématiques", "Histoire-Géo", "Sciences", "Arts"],
    college: ["Français", "Mathématiques", "Histoire-Géo", "SVT", "Physique-Chimie"]
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Configuration de base</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Niveau scolaire</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(levels).map((level) => (
                <Button
                  key={level}
                  variant={formData.level === level ? "default" : "outline"}
                  onClick={() => setFormData({...formData, level})}
                  className="w-full"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
            {formData.level && (
              <div className="h-24 mt-2 border rounded-md p-2 overflow-auto">
                <div className="grid grid-cols-2 gap-2">
                  {levels[formData.level].map((sublevel) => (
                    <Button
                      key={sublevel}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {sublevel}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Matière</label>
            {formData.level && (
              <div className="grid grid-cols-2 gap-2">
                {subjects[formData.level].map((subject) => (
                  <Button
                    key={subject}
                    variant={formData.subject === subject ? "default" : "outline"}
                    onClick={() => setFormData({...formData, subject})}
                    className="w-full"
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Button 
        className="w-full"
        disabled={!formData.level || !formData.subject}
        onClick={onNext}
      >
        Continuer
      </Button>
    </div>
  );
};

// Composant DetailsStep
const DetailsStep = ({ formData, setFormData, onBack, onGenerate, isGenerating }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Thème de la séquence</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Ex: Les fractions..."
            value={formData.theme}
            onChange={(e) => setFormData({...formData, theme: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nombre de séances ({formData.duration})
          </label>
          <input
            type="range"
            min="3"
            max="12"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Objectifs visés</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.objectives?.map((objective, index) => (
              <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                <span>{objective}</span>
                <button onClick={() => setFormData({
                  ...formData,
                  objectives: formData.objectives.filter((_, i) => i !== index)
                })}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              placeholder="Ajouter un objectif..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  setFormData({
                    ...formData,
                    objectives: [...(formData.objectives || []), e.target.value]
                  });
                  e.target.value = '';
                }
              }}
            />
            <Button variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          onClick={onGenerate}
          disabled={!formData.theme || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Générer la séquence
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Composant ResultStep
const ResultStep = ({ sequence, onRestart }) => {
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

// Composant principal
export default function SequenceGenerator() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [formData, setFormData] = useState({
    level: '',
    subject: '',
    theme: '',
    duration: '6',
    competencies: [],
    objectives: []
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSequence({
        title: formData.theme,
        duration: `${formData.duration} séances`,
        objectives: formData.objectives || ["Comprendre la notion", "Appliquer les concepts"],
        sessions: Array(parseInt(formData.duration)).fill(null).map((_, i) => ({
          number: i + 1,
          title: `Séance ${i + 1}`,
          duration: "45 minutes",
          activities: [
            { type: "Découverte", content: "Manipulation", duration: "15min" },
            { type: "Exercices", content: "Application", duration: "20min" },
            { type: "Synthèse", content: "Bilan", duration: "10min" }
          ]
        }))
      });
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      level: '',
      subject: '',
      theme: '',
      duration: '6',
      competencies: [],
      objectives: []
    });
    setSequence(null);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
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
          <CardTitle>Générateur de Séquences Pédagogiques</CardTitle>
          <CardDescription>
            Créez une séquence pédagogique complète adaptée à vos besoins
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${step >= s ? 'text-purple-600' : 'text-gray-400'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step === s ? 'bg-purple-600 text-white' : 
                  step > s ? 'bg-purple-100 text-purple-600' : 
                  'bg-gray-100'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`h-0.5 w-8 ${
                  step > s ? 'bg-purple-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <InitialStep 
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <DetailsStep 
              formData={formData}
              setFormData={setFormData}
              onBack={() => setStep(1)}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          )}

          {step === 3 && <ResultStep sequence={sequence} onRestart={handleReset} />}
        </CardContent>
      </Card>
    </div>
  );
}