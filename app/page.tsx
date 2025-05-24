"use client"

import { useState, useEffect, Suspense, lazy, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, ArrowRight, TrendingUp, Shield, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AinoLogo from "@/components/aino-logo"
import LoadingSpinner from "@/components/loading-spinner"
import AnimatedBackground from "@/components/animated-background"

// Lazy load heavy components for better performance
const ChatDemo = lazy(() => import("@/components/chat-demo"))
const ContactForm = lazy(() => import("@/components/contact-form"))

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const chatSectionRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      name: "Maria Virtanen",
      company: "TechStore Oy",
      text: "Chatbot vähensi asiakaspalvelun työmäärää 75%. ROI saavutettiin 2 kuukaudessa!",
      rating: 5,
    },
    {
      name: "Jukka Nieminen",
      company: "Kiinteistö Nord",
      text: "Asiakkaat saavat vastaukset välittömästi, myös öisin. Myynti kasvoi 40%.",
      rating: 5,
    },
    {
      name: "Anna Koskinen",
      company: "Ravintola Aroma",
      text: "Varaukset hoituvat automaattisesti. Henkilökunta voi keskittyä asiakkaisiin.",
      rating: 5,
    },
  ]

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showDemo || showContact) {
      // Odota hetki että komponentti on renderöitynyt
      setTimeout(() => {
        if (chatSectionRef.current) {
          // Scrollaa chatbox-osion kohdalle, mutta jätä hieman tilaa yläpuolelle
          const yOffset = -100 // 100px tilaa yläpuolelle
          const element = chatSectionRef.current
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

          window.scrollTo({
            top: y,
            behavior: "smooth",
          })
        }
      }, 100)
    }
  }, [showDemo, showContact])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AinoLogo className="h-10 w-auto" />
            </motion.div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 hidden sm:flex">
              <Sparkles className="w-3 h-3 mr-1" />
              Live Demo
            </Badge>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto px-4 py-6 sm:py-12 z-10">
        <AnimatePresence mode="wait">
          {!showDemo && !showContact ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <section className="text-center mb-12 sm:mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Badge className="mb-4 sm:mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                    🚀 Uusi teknologia - Aino AI, suomalainen chatbot-ratkaisu
                  </Badge>
                  <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    Aino AI - Älykäs
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {" "}
                      Chatbot Yrityksellesi
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed hero-text">
                    Automatisoi asiakaspalvelu, paranna asiakaskokemusta ja säästä aikaa 24/7 AI-chatbotilla.
                    <span className="text-blue-400 font-semibold"> Tehokas ratkaisu suomalaisille yrityksille.</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                    <Button
                      size="lg"
                      onClick={() => setShowDemo(true)}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-all duration-200 will-change-transform"
                      aria-label="Kokeile Aino AI demoa ilmaiseksi"
                    >
                      <Sparkles className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                      Kokeile Demoa Ilmaiseksi
                      <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowContact(true)}
                      className="w-full sm:w-auto border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-200"
                      aria-label="Ota yhteyttä Aino AI:hin"
                    >
                      Ota yhteyttä
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-blue-400">75%</div>
                      <div className="text-xs sm:text-sm text-gray-400">Vähemmän tukipyyntöjä</div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-green-400">24/7</div>
                      <div className="text-xs sm:text-sm text-gray-400">Asiakaspalvelu</div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-purple-400">2min</div>
                      <div className="text-xs sm:text-sm text-gray-400">Vastausaika</div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-400">95%</div>
                      <div className="text-xs sm:text-sm text-gray-400">Tyytyväisyys</div>
                    </motion.div>
                  </div>
                </motion.div>
              </section>

              {/* Features */}
              <motion.section
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                aria-labelledby="features-heading"
              >
                <h2 id="features-heading" className="sr-only">
                  Aino AI:n ominaisuudet
                </h2>
                <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 will-change-transform">
                        <Zap className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-white text-xl">Välittömät Vastaukset</CardTitle>
                      <CardDescription className="text-gray-300">
                        AI vastaa asiakkaiden kysymyksiin alle 2 sekunnissa, 24/7. Ei enää jonoja tai odottelua.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 will-change-transform">
                        <TrendingUp className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-white text-xl">Kasvata Myyntiä</CardTitle>
                      <CardDescription className="text-gray-300">
                        Chatbot ohjaa asiakkaita ostopäätökseen ja ehdottaa sopivia tuotteita. Keskimäärin +40% myynti.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="sm:col-span-2 lg:col-span-1"
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group h-full">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 will-change-transform">
                        <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-white text-xl">Luotettava & Turvallinen</CardTitle>
                      <CardDescription className="text-gray-300">
                        GDPR-yhteensopiva, suomalainen data-hosting. Chatbot oppii vain sinun tiedoistasi.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </motion.section>

              {/* CTA Section */}
              <motion.section
                className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 sm:p-12 border border-white/10 backdrop-blur-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                aria-labelledby="cta-heading"
              >
                <h2 id="cta-heading" className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                  Valmis Aloittamaan?
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Tutustu Aino AI:hin ja katso miten suomalainen chatbot-ratkaisu voi mullistaa yrityksesi
                  asiakaspalvelun.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setShowDemo(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-all duration-200 will-change-transform"
                    aria-label="Kokeile Aino AI demoa nyt"
                  >
                    <Sparkles className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                    Kokeile Demoa Nyt
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowContact(true)}
                    className="w-full sm:w-auto border-blue-400/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-200"
                    aria-label="Ota yhteyttä Aino AI:hin"
                  >
                    Ota yhteyttä
                  </Button>
                </div>
              </motion.section>
            </motion.div>
          ) : showDemo ? (
            <Suspense fallback={<LoadingSpinner />}>
              <motion.div
                key="demo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div ref={chatSectionRef}>
                  <ChatDemo onBack={() => setShowDemo(false)} />
                </div>
              </motion.div>
            </Suspense>
          ) : showContact ? (
            <Suspense fallback={<LoadingSpinner />}>
              <motion.div
                key="contact"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div ref={chatSectionRef}>
                  <ContactForm onBack={() => setShowContact(false)} />
                </div>
              </motion.div>
            </Suspense>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
