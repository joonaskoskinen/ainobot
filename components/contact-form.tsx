"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, CheckCircle, Mail, MapPin, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import emailjs from "@emailjs/browser"

interface ContactFormProps {
  onBack: () => void
}

export default function ContactForm({ onBack }: ContactFormProps) {
  const form = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    budget: "",
    timeline: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // EmailJS konfiguraatio - VALMIS! ✅
      const serviceId = "service_a9sboqo" // ✅ Sinun Service ID
      const templateId = "template_mqei9af" // ✅ Sinun Template ID
      const publicKey = "9R_r8_7n_jDgN1Ppo" // ✅ Sinun Public Key

      // Valmistele template parametrit
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company,
        phone: formData.phone || "Ei annettu",
        message: formData.message,
        budget: formData.budget || "Ei määritelty",
        timeline: formData.timeline || "Ei määritelty",
        to_email: "ainochatbot@gmail.com",
        reply_to: formData.email,
        // Lisätään timestamp
        timestamp: new Date().toLocaleString("fi-FI"),
      }

      console.log("📧 Lähetetään EmailJS:n kautta:", templateParams)

      // Lähetä sähköposti EmailJS:n kautta
      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey)

      console.log("✅ EmailJS Success:", result)

      // Lähetä myös backend API:lle (valinnainen)
      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      setIsSubmitted(true)
    } catch (error: any) {
      console.error("❌ EmailJS Error:", error)

      // Tarkista onko kyse puuttuvasta Public Key:stä
      if (error.text && error.text.includes("Invalid public key")) {
        setError("EmailJS ei ole vielä konfiguroitu. Tarkista Public Key.")
      } else if (error.text && error.text.includes("Template")) {
        setError("Sähköpostitemplate puuttuu. Luo template EmailJS:ssä.")
      } else {
        setError("Sähköpostin lähetys epäonnistui. Kokeile uudelleen.")
      }

      // Fallback: mailto-linkki jos EmailJS epäonnistuu
      const subject = encodeURIComponent(`Aino AI yhteydenotto: ${formData.company}`)
      const body = encodeURIComponent(`
Nimi: ${formData.name}
Yritys: ${formData.company}
Sähköposti: ${formData.email}
Puhelin: ${formData.phone}
Budjetti: ${formData.budget}
Aikataulu: ${formData.timeline}

Viesti:
${formData.message}
      `)

      // Avaa mailto vasta 2 sekunnin kuluttua, jotta käyttäjä ehtii lukea virheviestin
      setTimeout(() => {
        window.open(`mailto:ainochatbot@gmail.com?subject=${subject}&body=${body}`, "_blank")
      }, 2000)
    }

    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Button variant="outline" onClick={onBack} className="mb-6 border-white/20 text-white hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Takaisin
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-2xl p-12 border border-green-500/30 backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Kiitos yhteydenotostasi! 🎉</h1>
          <p className="text-xl text-gray-300 mb-6">
            Viestisi on lähetetty onnistuneesti sähköpostitse osoitteeseen{" "}
            <span className="text-blue-400 font-semibold">ainochatbot@gmail.com</span>
          </p>
          <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-white font-semibold mb-3">Mitä tapahtuu seuraavaksi?</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Saat vahvistussähköpostin</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Analysoin yrityksesi tarpeet</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Valmistelen räätälöidyn ehdotuksen</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Otan yhteyttä 24h sisällä</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="outline" onClick={onBack} className="mb-6 border-white/20 text-white hover:bg-white/10">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Takaisin
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Ota Yhteyttä Aino AI:hin 📞</h1>
        <p className="text-gray-300 text-lg">
          Kerro projektistasi ja saat henkilökohtaisen tarjouksen 24 tunnin sisällä
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-xl">Kerro projektistasi</CardTitle>
              {error && (
                <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Nimi *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Etunimi Sukunimi"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Sähköposti *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="nimi@yritys.fi"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Yritys *</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="Yrityksen nimi"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Puhelinnumero</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="+358 40 123 4567"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Budjetti</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                    >
                      <option value="" className="bg-gray-800">
                        Valitse budjetti
                      </option>
                      <option value="alle-500" className="bg-gray-800">
                        Alle 500€/kk
                      </option>
                      <option value="500-1000" className="bg-gray-800">
                        500-1000€/kk
                      </option>
                      <option value="1000-2000" className="bg-gray-800">
                        1000-2000€/kk
                      </option>
                      <option value="yli-2000" className="bg-gray-800">
                        Yli 2000€/kk
                      </option>
                      <option value="kertaluonteinen" className="bg-gray-800">
                        Kertaluonteinen projekti
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Aikataulu</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white"
                    >
                      <option value="" className="bg-gray-800">
                        Milloin aloitetaan?
                      </option>
                      <option value="heti" className="bg-gray-800">
                        Heti
                      </option>
                      <option value="1-2-viikkoa" className="bg-gray-800">
                        1-2 viikon sisällä
                      </option>
                      <option value="kuukauden-sisalla" className="bg-gray-800">
                        Kuukauden sisällä
                      </option>
                      <option value="2-3-kuukautta" className="bg-gray-800">
                        2-3 kuukauden sisällä
                      </option>
                      <option value="ei-kiirettä" className="bg-gray-800">
                        Ei kiirettä
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Kerro projektistasi *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Kerro yrityksestäsi, asiakaspalvelun haasteista ja miten chatbot voisi auttaa..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Lähetetään sähköpostia...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Lähetä Yhteydenotto
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info & Benefits */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Yhteystiedot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-white font-medium">Sähköposti</div>
                  <div className="text-gray-400 text-sm">ainochatbot@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">Vastausaika</div>
                  <div className="text-gray-400 text-sm">24 tunnin sisällä</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="text-white font-medium">Sijainti</div>
                  <div className="text-gray-400 text-sm">Suomi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Mitä saat?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Ilmainen konsultaatio ja tarpeiden kartoitus",
                "Räätälöity tarjous 24h sisällä",
                "Demo omalla sisällölläsi",
                "Selkeä projektisuunnitelma",
                "Kiinteä hinta - ei yllätyksiä",
                "Henkilökohtainen tuki koko projektin ajan",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Guarantee */}
          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-white font-bold mb-2">Tyytyväisyystakuu</h3>
              <p className="text-gray-300 text-sm">
                Jos et ole tyytyväinen chatbottiin 30 päivän sisällä, saat rahasi takaisin.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
