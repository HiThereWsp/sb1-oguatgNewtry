"use client"

import React, { useState, useCallback, memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Send, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Feedback from '@/components/Feedback';

// Types
interface VocabularyWord {
  word: string;
  definition: string;
  type: string;
  exemple: string;
  synonymes?: string[];
}

interface VocabularyContent {
  words: VocabularyWord[];
  metadata: {
    level: string;
    theme: string;
  };
}

// Configuration
const EDUCATION_LEVELS: Record<string, { name: string; sections: string[] }> = {
  maternelle: {
    name: "Maternelle",
    sections: ["Petite Section", "Moyenne Section", "Grande Section"]
  },
  elementaire: {
    name: "Élémentaire",
    sections: ["CP", "CE1", "CE2", "CM1", "CM2"]
  },
  college: {
    name: "Collège",
    sections: ["6ème", "5ème", "4ème", "3ème"]
  },
  lycee: {
    name: "Lycée",
    sections: ["Seconde", "Première", "Terminale"]
  }
};

// Composants
const LevelSelector = memo(({ 
  selectedLevel, 
  selectedCategory, 
  onLevelSelect, 
  onCategorySelect 
}: {
  selectedLevel: string;
  selectedCategory: string;
  onLevelSelect: (level: string) => void;
  onCategorySelect: (category: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">Niveau scolaire</label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {Object.entries(EDUCATION_LEVELS).map(([key, level]) => (
        <Button
          key={key}
          variant={selectedCategory === key ? "default" : "outline"}
          className="w-full"
          onClick={() => onCategorySelect(key)}
        >
          {level.name}
        </Button>
      ))}
    </div>
    {selectedCategory && (
      <ScrollArea className="h-20 mt-2">
        <div className="grid grid-cols-2 gap-2">
          {EDUCATION_LEVELS[selectedCategory].sections.map((section) => (
            <Button
              key={section}
              variant={selectedLevel === `${selectedCategory}-${section}` ? "default" : "outline"}
              size="sm"
              onClick={() => onLevelSelect(`${selectedCategory}-${section}`)}
            >
              {section}
            </Button>
          ))}
        </div>
      </ScrollArea>
    )}
  </div>
));

const ExportButton = memo(({ onExport }: { onExport: (format: 'txt' | 'doc') => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Exporter
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => onExport('txt')}>
        <FileText className="w-4 h-4 mr-2" />
        Format Texte
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onExport('doc')}>
        <FileText className="w-4 h-4 mr-2" />
        Format Document
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
));

const WordCard = memo(({ item, index }: { item: VocabularyWord; index: number }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="font-medium text-lg mb-2">
      {index + 1}. {item.word}
    </div>
    <div className="text-sm text-purple-600 mb-3">
      {item.type}
    </div>
    <div className="space-y-2">
      <div>
        <div className="font-medium">Définition :</div>
        <div className="text-gray-700">{item.definition}</div>
      </div>
      <div>
        <div className="font-medium">Exemple :</div>
        <div className="text-gray-600 italic">{item.exemple}</div>
      </div>
      {item.synonymes && (
        <div>
          <div className="font-medium">Synonymes :</div>
          <div className="flex flex-wrap gap-2">
            {item.synonymes.map((syn, idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                {syn}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
));

// Composant principal
export default function VocabularyGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState<VocabularyContent | null>(null);
  const [formData, setFormData] = useState({
    levelCategory: '',
    level: '',
    theme: '',
    wordCount: 10
  });

  const handleGenerate = useCallback(async () => {
    setError('');
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeneratedContent({
        words: [{
          word: "Exemple",
          definition: "Ceci est un exemple de réponse API",
          type: "nom commun",
          exemple: "Voici un exemple",
          synonymes: ["illustration", "modèle"]
        }],
        metadata: {
          level: formData.level,
          theme: formData.theme
        }
      });
    } catch (err) {
      setError('Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  }, [formData]);

  const handleExport = useCallback((format: 'txt' | 'doc') => {
    if (!generatedContent) return;
    
    const content = format === 'txt' 
      ? `Liste de vocabulaire - ${generatedContent.metadata.theme}\n` +
        `Niveau: ${generatedContent.metadata.level}\n\n` +
        generatedContent.words.map((item, index) => (
          `${index + 1}. ${item.word.toUpperCase()}\n` +
          `Définition: ${item.definition}\n` +
          `Type: ${item.type}\n` +
          `Exemple: ${item.exemple}\n` +
          (item.synonymes ? `Synonymes: ${item.synonymes.join(', ')}\n` : '') +
          '\n'
        )).join('\n')
      : `<!DOCTYPE html><html><head><meta charset="UTF-8">
          <style>
            body { font-family: Arial; padding: 20px; }
            .word { margin-bottom: 20px; padding: 15px; background: #f5f5f5; }
            .word-title { font-size: 18px; font-weight: bold; color: #333; }
            .definition { margin: 10px 0; }
            .type { color: #666; }
            .exemple { font-style: italic; }
          </style></head><body>
          <h1>Liste de vocabulaire - ${generatedContent.metadata.theme}</h1>
          ${generatedContent.words.map((item, index) => `
            <div class="word">
              <div class="word-title">${index + 1}. ${item.word}</div>
              <div class="definition">${item.definition}</div>
              <div class="type">${item.type}</div>
              <div class="exemple">${item.exemple}</div>
              ${item.synonymes ? `<div>Synonymes: ${item.synonymes.join(', ')}</div>` : ''}
            </div>
          `).join('')}
          </body></html>`;
    
    const blob = new Blob([content], { 
      type: format === 'txt' ? 'text/plain' : 'application/vnd.ms-word'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vocabulaire_${generatedContent.metadata.theme.toLowerCase().replace(/\s+/g, '_')}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [generatedContent]);

  const handleReset = useCallback(() => {
    setFormData({
      levelCategory: '',
      level: '',
      theme: '',
      wordCount: 10
    });
    setGeneratedContent(null);
    setError('');
  }, []);

  const handleCopy = useCallback(() => {
    if (generatedContent) {
      const content = generatedContent.words.map((item, index) => 
        `${index + 1}. ${item.word}\n` +
        `Définition: ${item.definition}\n` +
        `Type: ${item.type}\n` +
        `Exemple: ${item.exemple}\n` +
        (item.synonymes ? `Synonymes: ${item.synonymes.join(', ')}\n` : '')
      ).join('\n');
      navigator.clipboard.writeText(content);
    }
  }, [generatedContent]);

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
          <CardTitle>Générateur de Vocabulaire</CardTitle>
          <CardDescription>
            Créez des listes de vocabulaire avec définitions adaptées au niveau de vos élèves
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <LevelSelector
            selectedLevel={formData.level}
            selectedCategory={formData.levelCategory}
            onLevelSelect={(level) => setFormData(prev => ({ ...prev, level }))}
            onCategorySelect={(category) => setFormData(prev => ({ 
              ...prev, 
              levelCategory: category,
              level: ''
            }))}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Thème du vocabulaire</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Ex: Les animaux, Les émotions..."
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de mots ({formData.wordCount})</label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              className="w-full"
              value={formData.wordCount}
              onChange={(e) => setFormData(prev => ({ ...prev, wordCount: Number(e.target.value) }))}
            />
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
            disabled={!formData.levelCategory || !formData.theme || isGenerating}
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

        {generatedContent && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                Vocabulaire : {generatedContent.metadata.theme}
              </h3>
              <ExportButton onExport={handleExport} />
            </div>
            
            <ScrollArea className="h-96 border rounded-md p-4">
              <div className="space-y-6">
                {generatedContent.words.map((item, index) => (
                  <WordCard key={index} item={item} index={index} />
                ))}
              </div>
            </ScrollArea>

            <Feedback
              onFeedback={(type, comment) => {
                console.log('Feedback:', { type, comment, tool: 'vocabulary-generator' });
              }}
              onCopy={handleCopy}
              onRestart={handleReset}
              className="mt-4"
            />
          </div>
        )}
      </Card>
    </div>
  );
}