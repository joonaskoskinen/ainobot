"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Clock, AlertTriangle, Heart, Shield, User } from "lucide-react"
import { motion } from "framer-motion"

interface EscalationCardProps {
  reason: "medical_emergency" | "security_issue" | "safety_issue" | "customer_request"
  contactInfo: {
    phone: string
    email: string
    hours: string
    urgency: "low" | "medium" | "high"
  }
}

export default function EscalationCard({ reason, contactInfo }: EscalationCardProps) {
  const getIcon = () => {
    switch (reason) {
      case "medical_emergency":
        return <Heart className="h-6 w-6 text-red-400" />
      case "security_issue":
        return <Shield className="h-6 w-6 text-orange-400" />
      case "safety_issue":
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />
      default:
        return <User className="h-6 w-6 text-blue-400" />
    }
  }

  const getTitle = () => {
    switch (reason) {
      case "medical_emergency":
        return "Kiireellinen terveysasia"
      case "security_issue":
        return "Turvallisuusasia"
      case "safety_issue":
        return "Turvallisuusasia"
      default:
        return "Henkilökohtainen palvelu"
    }
  }

  const getBorderColor = () => {
    switch (contactInfo.urgency) {
      case "high":
        return "border-red-500/50"
      case "medium":
        return "border-orange-500/50"
      default:
        return "border-blue-500/50"
    }
  }

  const handleCall = () => {
    window.open(`tel:${contactInfo.phone}`, "_self")
  }

  const handleEmail = () => {
    window.open(`mailto:${contactInfo.email}`, "_blank")
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className={`bg-white/10 ${getBorderColor()} border-2 backdrop-blur-xl`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            {getIcon()}
            <h3 className="text-white font-semibold">{getTitle()}</h3>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCall}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Soita: {contactInfo.phone}</span>
            </Button>

            <Button
              onClick={handleEmail}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 flex items-center justify-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Lähetä sähköposti</span>
            </Button>

            <div className="flex items-center space-x-2 text-gray-300 text-sm">
              <Clock className="h-4 w-4" />
              <span>{contactInfo.hours}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
