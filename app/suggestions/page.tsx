"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Plus,
  ArrowLeft
} from 'lucide-react';
import Link from "next/link";

interface Suggestion {
  id: number;
  title: string;
  description: string;
  votes: number;
  status: 'pending' | 'inProgress' | 'completed';
}

export default function SuggestionsInterface() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: ''
  });

  const handleVote = (id: number, increment: boolean) => {
    setSuggestions(suggestions.map(suggestion => 
      suggestion.id === id 
        ? { ...suggestion, votes: suggestion.votes + (increment ? 1 : -1) }
        : suggestion
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([
      ...suggestions,
      {
        id: Date.now(),
        ...newSuggestion,
        votes: 0,
        status: 'pending'
      }
    ]);
    setNewSuggestion({ title: '', description: '' });
    setShowForm(false);
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Votez pour de nouvelles fonctionnalités</h1>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle suggestion
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher des suggestions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <Input
                value={newSuggestion.title}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={newSuggestion.description}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button type="submit">Soumettre</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="p-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <button onClick={() => handleVote(suggestion.id, true)}>
                  <ChevronUp className="h-6 w-6" />
                </button>
                <span className="font-bold">{suggestion.votes}</span>
                <button onClick={() => handleVote(suggestion.id, false)}>
                  <ChevronDown className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{suggestion.title}</h3>
                <p className="text-gray-600 mt-1">{suggestion.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}