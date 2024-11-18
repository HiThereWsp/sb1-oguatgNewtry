"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Send, Loader2 } from 'lucide-react';

interface DetailsStepProps {
  formData: {
    theme: string;
    duration: string;
    objectives: string[];
  };
  setFormData: (data: any) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({ 
  formData, 
  setFormData, 
  onBack, 
  onGenerate, 
  isGenerating 
}) => {
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