"use client"

import React, { useState, useCallback, memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2, Copy, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Feedback from '@/components/Feedback';

// Types
interface Adaptation {
  originalExercise: string;
  adaptedExercise: string;
  adaptationType: string;
  specificNeeds: string[];
}

// Composants mémoïsés
const ExerciseInput = memo(({ 
  value, 
  onChange 
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">Exercice original</label>
    <Textarea
      placeholder="Collez votre exercice ici..."
      className="min-h-32"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
));

ExerciseInput.displayName = 'ExerciseInput';

const AdaptationOptions = memo(({ 
  selectedNeeds,
  onNeedsChange,
  adaptationType,
  onTypeChange
}: {
  selectedNeeds: string[];
  onNeedsChange: (needs: string[]) => void;
  adaptationType: string;
  onTypeChange: (type: string) => void;
}) => {
  const [showCustomNeed, setShowCustomNeed] = useState(false);
  const [customNeed, setCustomNeed] = useState('');

  const specificNeeds = [
    "Dyslexie",
    "Dyspraxie",
    "TDAH",
    "Haut Potentiel",
    "Trouble du spectre autistique",
    "Difficultés de compréhension",
    "Difficultés d'attention"
  ];

  const adaptationTypes = [
    "Simplification",
    "Enrichissement",
    "Support visuel",
    "Découpage en étapes",
    "Consignes clarifiées"
  ];

  const handleCustomNeedSubmit = () => {
    if (customNeed.trim()) {
      onNeedsChange([...selectedNeeds, customNeed.trim()]);
      setCustomNeed('');
      setShowCustomNeed(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Type d'adaptation</label>
        <Select value={adaptationType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir le type d'adaptation" />
          </SelectTrigger>
          <SelectContent>
            {adaptationTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Besoins spécifiques</label>
        <div className="flex flex-wrap gap-2">
          {specificNeeds.map((need) => (
            <Button
              key={need}
              variant={selectedNeeds.includes(need) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newNeeds = selectedNeeds.includes(need)
                  ? selectedNeeds.filter(n => n !== need)
                  : [...selectedNeeds, need];
                onNeedsChange(newNeeds);
              }}
            >
              {need}
            </Button>
          ))}
          <Button
            variant={showCustomNeed ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCustomNeed(!showCustomNeed)}
          >
            Autre
          </Button>
        </div>
        {showCustomNeed && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              placeholder="Spécifiez le besoin..."
              value={customNeed}
              onChange={(e) => setCustomNeed(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomNeedSubmit();
                }
              }}
            />
            <Button
              size="sm"
              onClick={handleCustomNeedSubmit}
              disabled={!customNeed.trim()}
            >
              Ajouter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

AdaptationOptions.displayName = 'AdaptationOptions';

const AdaptedExercise = memo(({ 
  adaptation,
  onCopy,
  onRestart 
}: { 
  adaptation: Adaptation;
  onCopy: () => void;
  onRestart: () => void;
}) => (
  <div className="space-y-4">
    <div className="p-4 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-medium mb-2">Exercice adapté</h3>
        <div className="bg-white p-4 rounded border whitespace-pre-wrap">
          {adaptation.adaptedExercise}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Adaptations appliquées :</h4>
        <div className="space-y-2">
          <div>Type : <span className="text-purple-600">{adaptation.adaptationType}</span></div>
          <div>
            Besoins pris en compte :
            <div className="flex flex-wrap gap-2 mt-1">
              {adaptation.specificNeeds.map((need, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                  {need}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Feedback
      onFeedback={(type, comment) => {
        console.log('Feedback:', { type, comment, tool: 'differentiation-assistant' });
      }}
      onCopy={onCopy}
      onRestart={onRestart}
    />
  </div>
));

AdaptedExercise.displayName = 'AdaptedExercise';

// Composant principal
export default function DifferentiationAssistant() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [originalExercise, setOriginalExercise] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [adaptationType, setAdaptationType] = useState('');
  const [adaptation, setAdaptation] = useState<Adaptation | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!originalExercise || !adaptationType || selectedNeeds.length === 0) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setError('');
    setIsGenerating(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAdaptation({
        originalExercise,
        adaptedExercise: `[Exemple d'adaptation]\n\n${originalExercise}\n\nAdaptations appliquées pour ${selectedNeeds.join(', ')}`,
        adaptationType,
        specificNeeds: selectedNeeds
      });
    } catch (err) {
      setError('Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  }, [originalExercise, adaptationType, selectedNeeds]);

  const handleReset = useCallback(() => {
    setOriginalExercise('');
    setSelectedNeeds([]);
    setAdaptationType('');
    setAdaptation(null);
    setError('');
  }, []);

  const handleCopy = useCallback(() => {
    if (adaptation) {
      navigator.clipboard.writeText(adaptation.adaptedExercise);
    }
  }, [adaptation]);

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
          <CardTitle>Assistant de Différenciation</CardTitle>
          <CardDescription>
            Adaptez vos exercices aux besoins spécifiques de vos élèves
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ExerciseInput
            value={originalExercise}
            onChange={setOriginalExercise}
          />

          <AdaptationOptions
            selectedNeeds={selectedNeeds}
            onNeedsChange={setSelectedNeeds}
            adaptationType={adaptationType}
            onTypeChange={setAdaptationType}
          />
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
          
          <Button
            disabled={!originalExercise || !adaptationType || selectedNeeds.length === 0 || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Adapter l'exercice
              </>
            )}
          </Button>
        </CardFooter>

        {adaptation && (
          <div className="p-4 border-t">
            <AdaptedExercise 
              adaptation={adaptation}
              onCopy={handleCopy}
              onRestart={handleReset}
            />
          </div>
        )}
      </Card>
    </div>
  );
}