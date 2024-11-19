"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Lock, MessageSquarePlus } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/app/auth/AuthProvider'
import { useState } from 'react'
import AuthModal from '@/components/auth/AuthModal'

export default function Home() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const tools = [
    {
      title: "Générateur de séquences",
      description: "Créez des séquences pédagogiques complètes en quelques clics.",
      href: "/generateur-sequences",
      icon: "📚"
    },
    {
      title: "Générateur de vocabulaire",
      description: "Obtenez des listes de vocabulaire adaptées à vos besoins.",
      href: "/generateur-vocabulaire",
      icon: "📝"
    },
    {
      title: "Créateur de QCM",
      description: "Générez des questionnaires à choix multiples personnalisés.",
      href: "/createur-qcm",
      icon: "✅"
    },
    {
      title: "Assistant de différenciation",
      description: "Adaptez vos contenus pour répondre aux besoins de chaque élève.",
      href: "/assistant-differenciation",
      icon: "🎯"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Enseignant3.0
          </h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            Assistant IA pour Enseignants
          </p>
          {!user && (
            <div className="mt-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity"
                onClick={() => setShowAuthModal(true)}
              >
                Commencer gratuitement
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Version bêta gratuite pour les premiers utilisateurs
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <div key={tool.title} className="relative group transform transition-all duration-200 hover:scale-105">
              {!user && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-xl z-10 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg shadow-lg flex items-center gap-3">
                    <Lock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Connectez-vous pour accéder</span>
                  </div>
                </div>
              )}
              <Link href={user ? tool.href : '#'} onClick={!user ? () => setShowAuthModal(true) : undefined}>
                <Card className="h-full border-2 hover:border-purple-200 transition-all overflow-hidden bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tool.icon}</span>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>
                      <ArrowRight className="h-5 w-5 text-purple-600" />
                    </div>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button 
            size="lg"
            onClick={!user ? () => setShowAuthModal(true) : undefined}
            asChild={!!user}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity"
          >
            <Link href={user ? "/suggestions" : "#"}>
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="h-5 w-5" />
                Votez pour de nouvelles fonctionnalités
              </div>
            </Link>
          </Button>
        </div>
      </div>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <footer className="text-center text-gray-500 py-8">
        <p>&copy; 2024 Enseignant3.0. Tous droits réservés.</p>
      </footer>
    </div>
  )
}