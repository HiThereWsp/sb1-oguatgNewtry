"use client"

import React from 'react';
import { Button } from '@/components/ui/button';

interface InitialStepProps {
  formData: {
    level: string;
    subject: string;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

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

export const InitialStep: React.FC<InitialStepProps> = ({ formData, setFormData, onNext }) => {
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