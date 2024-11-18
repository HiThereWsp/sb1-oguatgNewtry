import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, MessageSquarePlus } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-4">
      <main className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">Enseignant3.0</h1>
        <p className="text-xl text-center text-gray-600">
          Assistant IA pour Enseignants
        </p>
        <p className="text-sm text-center text-green-600 font-medium mt-2">
          Bienvenue dans notre outil gratuit pour nos bêta-testeurs !
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/generateur-sequences" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Générateur de séquences
                  <ArrowRight className="h-5 w-5" />
                </CardTitle>
                <CardDescription>
                  Créez des séquences pédagogiques complètes en quelques clics.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/generateur-vocabulaire" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Générateur de vocabulaire
                  <ArrowRight className="h-5 w-5" />
                </CardTitle>
                <CardDescription>
                  Obtenez des listes de vocabulaire adaptées à vos besoins.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/createur-qcm" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Créateur de QCM
                  <ArrowRight className="h-5 w-5" />
                </CardTitle>
                <CardDescription>
                  Générez des questionnaires à choix multiples personnalisés.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/assistant-differenciation" className="block">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Assistant de différenciation
                  <ArrowRight className="h-5 w-5" />
                </CardTitle>
                <CardDescription>
                  Adaptez vos contenus pour répondre aux besoins de chaque élève.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/suggestions" className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5" />
              Votez pour de nouvelles fonctionnalités
            </Link>
          </Button>
        </div>
      </main>
      <footer className="mt-16 text-center text-gray-500">
        <p>&copy; 2024 Enseignant3.0. Tous droits réservés.</p>
      </footer>
    </div>
  )
}