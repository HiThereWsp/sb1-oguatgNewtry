"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Configuration des niveaux
const EDUCATION_LEVELS = {
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
} as const;

interface LevelSelectorProps {
  selectedLevel: string;
  onLevelSelect: (level: string) => void;
}

export const LevelSelector = ({ selectedLevel, onLevelSelect }: LevelSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState('');

  // Fonction de gestion de sélection du niveau
  const handleLevelSelect = (level: string) => {
    onLevelSelect(`${selectedCategory}-${level}`);
  };

  // Fonction de gestion de sélection de la catégorie
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onLevelSelect(''); // Reset le niveau spécifique quand on change de catégorie
  };

  return (
    <div className="space-y-4">
      {/* Sélection de la catégorie principale */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Niveau scolaire
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(EDUCATION_LEVELS).map(([key, level]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              className="w-full"
              onClick={() => handleCategorySelect(key)}
            >
              {level.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Sélection de la classe spécifique */}
      {selectedCategory && (
        <ScrollArea className="h-20">
          <div className="grid grid-cols-2 gap-2">
            {EDUCATION_LEVELS[selectedCategory].sections.map((section) => (
              <Button
                key={section}
                variant={selectedLevel === `${selectedCategory}-${section}` ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => handleLevelSelect(section)}
              >
                {section}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};