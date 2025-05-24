"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailJSSetupGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">📧 EmailJS Setup Guide</h1>
        <p className="text-gray-300">Seuraa näitä ohjeita saadaksesi sähköpostit toimimaan</p>
      </div>

      {/* Step 1 */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Badge className="mr-3 bg-blue-500">1</Badge>
            Luo EmailJS tili
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Mene osoitteeseen{" "}
            <a
              href="https://www.emailjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline inline-flex items-center"
            >
              emailjs.com <ExternalLink className="ml-1 h-3 w-3" />
            </a>{" "}
            ja luo ilmainen tili
          </p>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center text-green-300 mb-2">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="font-semibold">Ilmainen: 200 viestiä/kuukausi</span>
            </div>
            <p className="text-gray-300 text-sm">Täysin riittävä pienelle yritykselle!</p>
          </div>
        </CardContent>
      </Card>

      {/* Step 2 */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Badge className="mr-3 bg-blue-500">2</Badge>
            Lisää sähköpostipalvelu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">EmailJS dashboardissa:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
            <li>Klikkaa "Email Services"</li>
            <li>Valitse "Gmail" (tai muu palveluntarjoaja)</li>
            <li>Kirjaudu Gmail-tilillesi</li>
            <li>Kopioi Service ID</li>
          </ol>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Vinkki:</strong> Service ID näyttää tältä: "service_xxxxxxx"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 3 */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Badge className="mr-3 bg-blue-500">3</Badge>
            Luo sähköpostitemplate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">Luo uusi template seuraavilla asetuksilla:</p>
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-white font-semibold">Template Name:</p>
              <code className="text-green-400">Aino AI Contact Form</code>
            </div>
            <div>
              <p className="text-white font-semibold">Subject:</p>
              <code className="text-green-400">
                Uusi yhteydenotto: {"{"}
                {"{"}company{"}"}
                {"}"}
              </code>
            </div>
            <div>
              <p className="text-white font-semibold">Template sisältö:</p>
              <div className="bg-gray-900 rounded p-3 text-sm text-gray-300 relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() =>
                    copyToClipboard(`Uusi yhteydenotto Aino AI:hin

Yhteystiedot:
- Nimi: {{from_name}}
- Sähköposti: {{from_email}}
- Yritys: {{company}}
- Puhelin: {{phone}}

Projektin tiedot:
- Budjetti: {{budget}}
- Aikataulu: {{timeline}}

Viesti:
{{message}}

---
Lähetetty Aino AI -sivustolta`)
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <pre className="whitespace-pre-wrap">
                  {`Uusi yhteydenotto Aino AI:hin

Yhteystiedot:
- Nimi: {{from_name}}
- Sähköposti: {{from_email}}
- Yritys: {{company}}
- Puhelin: {{phone}}

Projektin tiedot:
- Budjetti: {{budget}}
- Aikataulu: {{timeline}}

Viesti:
{{message}}

---
Lähetetty Aino AI -sivustolta`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4 */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Badge className="mr-3 bg-blue-500">4</Badge>
            Kopioi tunnisteet koodiin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">Päivitä contact-form.tsx tiedostoon:</p>
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <code className="text-green-400">const serviceId = "service_aino_ai"</code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('const serviceId = "service_aino_ai"')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-green-400">const templateId = "template_contact"</code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('const templateId = "template_contact"')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-green-400">const publicKey = "YOUR_PUBLIC_KEY"</code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('const publicKey = "YOUR_PUBLIC_KEY"')}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              ⚠️ <strong>Tärkeää:</strong> Vaihda "YOUR_PUBLIC_KEY" omaan Public Key:hin EmailJS dashboardista!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 5 */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Badge className="mr-3 bg-green-500">✓</Badge>
            Testaa toimivuus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">Kun olet tehnyt muutokset:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
            <li>Tallenna tiedostot</li>
            <li>Käynnistä dev-server uudelleen</li>
            <li>Täytä yhteydenottolomake</li>
            <li>Tarkista sähköposti!</li>
          </ol>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center text-green-300 mb-2">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="font-semibold">Valmis!</span>
            </div>
            <p className="text-gray-300 text-sm">Nyt sähköpostit lähetetään automaattisesti suoraan Gmail-tiliisi!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
