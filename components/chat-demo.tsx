"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  MessageCircle,
  Zap,
  Star,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Settings,
  Smile,
  Paperclip,
  ImageIcon,
  FileText,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateAIResponse, type ChatMessage } from "@/app/actions/chat"
import { MarkdownRenderer } from "./markdown-renderer"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  typing?: boolean
  reactions?: { thumbsUp: boolean; thumbsDown: boolean }
  attachments?: Array<{ type: string; name: string; url: string }>
  suggestions?: string[]
}

interface ChatDemoProps {
  onBack: () => void
}

export default function ChatDemo({ onBack }: ChatDemoProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hei! 👋 Olen TechMart Oy:n AI-asiakaspalveluassistentti. Voin auttaa sinua tuotetietojen, tilausten, palautusten ja teknisen tuen kanssa. Miten voin auttaa tänään?",
      timestamp: new Date(),
      suggestions: ["Näytä uusimmat tuotteet", "Tarkista tilaukseni", "Haluan palauttaa tuotteen", "Tekninen tuki"],
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedDemo, setSelectedDemo] = useState<string>("ecommerce")
  const [isListening, setIsListening] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [chatSettings, setChatSettings] = useState({
    fontSize: "medium",
    theme: "dark",
    autoScroll: true,
    soundNotifications: true,
    showTimestamps: true,
    compactMode: false,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const demoScenarios = {
    ecommerce: {
      name: "E-commerce Kauppa",
      icon: "🛒",
      color: "blue",
      context: "TechMart Oy - Aino AI asiakaspalvelu",
    },
    restaurant: {
      name: "Ravintola",
      icon: "🍽️",
      color: "green",
      context: "Ravintola Kulma - Aino AI varausassistentti",
    },
    realestate: {
      name: "Kiinteistöala",
      icon: "🏠",
      color: "purple",
      context: "Kiinteistö Koti Oy - Aino AI kiinteistöassistentti",
    },
    healthcare: {
      name: "Terveydenhuolto",
      icon: "🏥",
      color: "red",
      context: "TerveysKeskus Plus - Aino AI ajanvarausassistentti",
    },
    banking: {
      name: "Pankki",
      icon: "🏦",
      color: "indigo",
      context: "Koti Pankki - Aino AI asiakasneuvoja",
    },
  }

  const quickQuestions = {
    ecommerce: [
      "Onko iPhone 15 Pro varastossa?",
      "Miten voin palauttaa tuotteen?",
      "Mitkä ovat toimitusajat?",
      "Voitteko suositella kannettavaa?",
      "Milloin saan tilauksen?",
      "Onko alennuksia tulossa?",
    ],
    restaurant: [
      "Haluaisin varata pöydän kahdelle",
      "Onko teillä vegaanisia vaihtoehtoja?",
      "Mitkä ovat aukioloajat?",
      "Voiko ruoan tilata kotiin?",
      "Mikä on päivän menu?",
      "Onko terassilla tilaa?",
    ],
    realestate: [
      "Etsin 3h+k asuntoa Helsingistä",
      "Mikä on asunnon X hinta?",
      "Voinko varata näytön?",
      "Mitä lainaa saisin 400k asuntoon?",
      "Mitkä ovat hoitokulut?",
      "Onko asunto vapaa heti?",
    ],
    healthcare: [
      "Haluaisin varata ajan lääkärille",
      "Milloin pääsen kiireelliseen?",
      "Voiko reseptin uusia netissä?",
      "Mitkä ovat laboratorion aukioloajat?",
      "Tarvitsen todistuksen työhön",
      "Miten perun ajan?",
    ],
    banking: [
      "Haluan avata tilin",
      "Miten haen asuntolainaa?",
      "Miksi korttini on lukittu?",
      "Voinko nostaa luottorajaa?",
      "Miten teen tilisiirron?",
      "Missä on lähin konttori?",
    ],
  }

  const emojis = ["😊", "👍", "❤️", "😂", "🤔", "👏", "🙏", "💯", "🔥", "⭐"]

  const scrollToBottom = () => {
    // Poistettu automaattinen scrollaus - käyttäjä voi scrollata itse
    // if (chatSettings.autoScroll) {
    //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    // }
  }

  useEffect(() => {
    // Poistettu automaattinen scrollaus viestien jälkeen
    // scrollToBottom()
  }, [messages])

  // Ääniefektit
  const playSound = (type: "send" | "receive" | "notification") => {
    if (!isSoundEnabled || !chatSettings.soundNotifications) return

    // Simuloi ääniefektit (oikeassa sovelluksessa käytettäisiin Audio API:a)
    console.log(`🔊 Playing ${type} sound`)
  }

  // Puheentunnistus (simuloitu)
  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simuloi puheentunnistusta
      setTimeout(() => {
        setInput("Hei, haluaisin tietää lisää tuotteistanne")
        setIsListening(false)
      }, 2000)
    }
  }

  // Tiedoston lataus
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const attachment = {
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
        url: URL.createObjectURL(file),
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Lähetin tiedoston: ${file.name}`,
        timestamp: new Date(),
        attachments: [attachment],
      }

      setMessages((prev) => [...prev, userMessage])
      playSound("send")

      // AI vastaus tiedostoon
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Kiitos tiedostosta! Analysoin ${file.name} ja voin auttaa sinua sen kanssa. ${file.type.startsWith("image/") ? "Näen kuvan sisällön ja voin vastata siihen liittyviin kysymyksiin." : "Käyn tiedoston läpi ja vastaan kysymyksiisi."}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        playSound("receive")
      }, 1500)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsTyping(true)
    playSound("send")

    try {
      // Muunnetaan viestit AI SDK:n muotoon
      const chatMessages: ChatMessage[] = [
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: currentInput,
        },
      ]

      // Kutsutaan AI:ta
      const aiResponse = await generateAIResponse(chatMessages, selectedDemo)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      playSound("receive")
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Anteeksi, tapahtui virhe. Yritä hetken kuluttua uudelleen tai ota yhteyttä asiakaspalveluun.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const switchDemo = (demo: string) => {
    setSelectedDemo(demo)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `Hei! 👋 Olen ${demoScenarios[demo as keyof typeof demoScenarios].context}. Miten voin auttaa sinua tänään?`,
        timestamp: new Date(),
        suggestions: quickQuestions[demo as keyof typeof quickQuestions].slice(0, 4),
      },
    ])
  }

  const handleReaction = (messageId: string, reaction: "thumbsUp" | "thumbsDown") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [reaction]: !msg.reactions?.[reaction],
                [reaction === "thumbsUp" ? "thumbsDown" : "thumbsUp"]: false,
              },
            }
          : msg,
      ),
    )
    playSound("notification")
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Näytä toast-viesti
  }

  const exportChat = () => {
    const chatData = messages
      .map((msg) => `[${msg.timestamp.toLocaleTimeString()}] ${msg.role === "user" ? "Sinä" : "AI"}: ${msg.content}`)
      .join("\n")

    const blob = new Blob([chatData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `aino-ai-chat-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `Hei! 👋 Olen ${demoScenarios[selectedDemo as keyof typeof demoScenarios].context}. Miten voin auttaa sinua tänään?`,
        timestamp: new Date(),
        suggestions: quickQuestions[selectedDemo as keyof typeof quickQuestions].slice(0, 4),
      },
    ])
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Button variant="outline" onClick={onBack} className="mb-6 border-white/20 text-white hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Takaisin
        </Button>

        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-white mb-4">🤖 Aino AI Demo</h1>
            <p className="text-gray-300 text-lg mb-6">Kokeile miten Aino AI toimii eri toimialoilla</p>

            {/* Demo Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {Object.entries(demoScenarios).map(([key, scenario]) => (
                <Button
                  key={key}
                  onClick={() => switchDemo(key)}
                  variant={selectedDemo === key ? "default" : "outline"}
                  className={`${
                    selectedDemo === key
                      ? `bg-${scenario.color}-600 hover:bg-${scenario.color}-700 text-white`
                      : "border-white/20 text-white hover:bg-white/10"
                  } transition-all duration-300`}
                >
                  <span className="mr-2">{scenario.icon}</span>
                  {scenario.name}
                </Button>
              ))}
            </div>

            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
              <Sparkles className="mr-1 h-3 w-3" />
              Powered by Aino AI + Groq ⚡
            </Badge>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-[700px] flex flex-col">
            <CardHeader className="border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-white">
                  <div className="relative mr-3">
                    <Bot className="h-6 w-6 text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  {demoScenarios[selectedDemo as keyof typeof demoScenarios].context}
                  <Badge variant="outline" className="ml-3 border-green-500/30 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    AI Online
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                    className="text-gray-400 hover:text-white"
                  >
                    {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={exportChat} className="text-gray-400 hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-400 hover:text-white">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white/10 text-gray-100 border border-white/10"
                      } shadow-lg group`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {message.role === "user" && (
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="leading-relaxed">
                            <MarkdownRenderer content={message.content} />
                          </div>

                          {/* Attachments */}
                          {message.attachments && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                                  {attachment.type === "image" ? (
                                    <ImageIcon className="h-4 w-4 text-blue-400" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-green-400" />
                                  )}
                                  <span className="text-sm">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.suggestions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs border-white/20 text-white hover:bg-white/10"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            {chatSettings.showTimestamps && (
                              <div className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString("fi-FI", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}

                            {/* Message Actions */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {message.role === "assistant" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReaction(message.id, "thumbsUp")}
                                    className={`h-6 w-6 p-0 ${message.reactions?.thumbsUp ? "text-green-400" : "text-gray-400"}`}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReaction(message.id, "thumbsDown")}
                                    className={`h-6 w-6 p-0 ${message.reactions?.thumbsDown ? "text-red-400" : "text-gray-400"}`}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 max-w-[85%] shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-gray-400 text-sm">AI ajattelee...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t border-white/10 p-6 bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-white"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleListening}
                    className={`${isListening ? "text-red-400" : "text-gray-400"} hover:text-white`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Kuuntelen..." : "Kirjoita viestisi..."}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                  disabled={isListening || isTyping}
                />

                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isListening || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20"
                >
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setInput((prev) => prev + emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="text-lg hover:bg-white/10"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Voice Recording Indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center justify-center space-x-2 text-red-400"
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Nauhoitan ääntä...</span>
                </motion.div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Questions */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                Pikakysymykset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickQuestions[selectedDemo as keyof typeof quickQuestions].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 whitespace-normal border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => handleQuickQuestion(question)}
                >
                  <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0 text-blue-400" />
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Actions */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Chat-toiminnot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => navigator.share?.({ title: "Aino AI Chat", text: "Kokeile Aino AI chatbottia!" })}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Jaa chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={exportChat}
              >
                <Download className="mr-2 h-4 w-4" />
                Lataa keskustelu
              </Button>
            </CardContent>
          </Card>

          {/* Demo Features */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Demo-ominaisuudet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {[
                { icon: "⚡", text: "Nopeat vastaukset (1-3s)", color: "text-yellow-400" },
                { icon: "🧠", text: "Kontekstin ymmärtäminen", color: "text-blue-400" },
                { icon: "🇫🇮", text: "Suomenkielinen tuki", color: "text-green-400" },
                { icon: "🕐", text: "24/7 saatavuus", color: "text-purple-400" },
                { icon: "📊", text: "Analytiikka & raportit", color: "text-pink-400" },
                { icon: "🔗", text: "CRM-integraatiot", color: "text-indigo-400" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-lg">{feature.icon}</span>
                  <span className={`${feature.color} font-medium`}>{feature.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-400" />
                Suorituskyky
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">98.5%</div>
                  <div className="text-xs text-gray-400">Tarkkuus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">1.2s</div>
                  <div className="text-xs text-gray-400">Vastausaika</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-xs text-gray-400">Käytettävyys</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">95%</div>
                  <div className="text-xs text-gray-400">Tyytyväisyys</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
