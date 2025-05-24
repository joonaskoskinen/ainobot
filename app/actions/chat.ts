"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface EscalationInfo {
  shouldEscalate: boolean
  reason?: string
  contactInfo?: {
    phone?: string
    email?: string
    hours?: string
    urgency?: "low" | "medium" | "high"
  }
}

export async function generateAIResponse(messages: ChatMessage[], scenario: string): Promise<string> {
  try {
    // Luodaan Groq-instanssi API-avaimella
    const groq = createGroq({
      apiKey: process.env.API_KEY,
    })

    // Tarkistetaan tarvitaanko eskalaatiota
    const escalation = checkForEscalation(messages[messages.length - 1]?.content || "", scenario)

    if (escalation.shouldEscalate) {
      return generateEscalationResponse(escalation, scenario)
    }

    // Määritellään konteksti eri toimialoille
    const contexts = {
      ecommerce: `Olet TechMart Oy:n asiakaspalveluassistentti. Auta asiakkaita tuotetietojen, tilausten, palautusten ja teknisen tuen kanssa. Ole ystävällinen ja ammattimainen. Vastaa suomeksi.

TÄRKEÄÄ: Käytä Markdown-muotoilua vastauksissa:
- **Lihavointi** tärkeille asioille
- *Kursiivi* korostukseen
- ## Otsikot eri osioille
- • Luettelot selkeyttämään
- \`Koodit\` teknisille termeille
- > Lainaukset tärkeille tiedoille

Yrityksen tiedot:
- Nimi: TechMart Oy
- Erikoisala: Elektroniikka ja tekniikka
- Palvelut: Verkkokauppa, myymälä, tekninen tuki
- Toimitusajat: 1-3 arkipäivää
- Palautusoikeus: 30 päivää
- Asiakaspalvelu: Ma-Pe 8-18`,

      restaurant: `Olet Ravintola Kulman varausassistentti. Auta asiakkaita pöytävarauksissa, menussa ja yleisissä kysymyksissä. Ole lämminhenkinen ja palveluhenkinen. Vastaa suomeksi.

TÄRKEÄÄ: Käytä Markdown-muotoilua vastauksissa:
- **Lihavointi** ruokien nimille ja hinnoille
- *Kursiivi* korostukseen
- ## Otsikot eri osioille (Menu, Varaukset, jne.)
- • Luettelot ruokavaihtoehdoille
- > Lainaukset päivän suosituksille

Ravintolan tiedot:
- Nimi: Ravintola Kulma
- Tyyli: Moderni suomalainen keittiö
- Sijainti: Keskuskatu 15, Helsinki
- Aukioloajat: Ma-To 11-22, Pe-La 11-23, Su 12-21
- Erikoisuudet: Vegaaniset vaihtoehdot, kotiinkuljetus`,

      realestate: `Olet Kiinteistö Koti Oy:n kiinteistöassistentti. Auta asiakkaita asuntojen haussa, näytöissä ja kiinteistöasioissa. Ole asiantunteva ja luotettava. Vastaa suomeksi.

TÄRKEÄÄ: Käytä Markdown-muotoilua vastauksissa:
- **Lihavointi** hinnoille ja tärkeille tiedoille
- *Kursiivi* korostukseen
- ## Otsikot eri osioille (Asunnot, Hinnat, jne.)
- • Luettelot asuntojen ominaisuuksille
- > Lainaukset tärkeille huomioille

Yrityksen tiedot:
- Nimi: Kiinteistö Koti Oy
- Palvelualue: Helsinki ja lähikunnat
- Palvelut: Myynti, vuokraus, arvioinnit
- Yhteistyökumppanit: Pankit lainaneuvontaan
- Asiakaspalvelu: Ma-Pe 9-17, La 10-14`,

      healthcare: `Olet TerveysKeskus Plus:n ajanvarausassistentti. Auta asiakkaita ajanvarauksissa, terveyspalveluissa ja yleisneuvonnassa. Ole empaattinen ja ammattimainen. Vastaa suomeksi.

TÄRKEÄÄ: Käytä Markdown-muotoilua vastauksissa:
- **Lihavointi** tärkeille terveystiedoille
- *Kursiivi* korostukseen
- ## Otsikot eri osioille (Ajanvaraus, Palvelut, jne.)
- • Luettelot palveluille ja hinnoille
- > Lainaukset tärkeille terveysohjeille

Terveysaseman tiedot:
- Nimi: TerveysKeskus Plus
- Palvelut: Yleislääkäri, erikoislääkärit, laboratorio
- Aukioloajat: Ma-Pe 7-20, La-Su 9-18
- Päivystys: Arkisin 8-20, viikonloppuisin 9-18
- Ajanvaraus: Puh 010-123 4567`,

      banking: `Olet Koti Pankin asiakasneuvoja. Auta asiakkaita pankkipalveluissa, lainoissa ja tileissä. Ole luotettava ja selkeä. Vastaa suomeksi.

TÄRKEÄÄ: Käytä Markdown-muotoilua vastauksissa:
- **Lihavointi** tärkeille rahasummille ja koroille
- *Kursiivi* korostukseen
- ## Otsikot eri osioille (Lainat, Tilit, jne.)
- • Luettelot palveluille ja hinnoille
- > Lainaukset tärkeille turvallisuusohjeille

Pankin tiedot:
- Nimi: Koti Pankki
- Palvelut: Tilit, lainat, kortit, sijoitukset
- Konttorit: Helsinki, Espoo, Vantaa
- Aukioloajat: Ma-Pe 9-17
- Asiakaspalvelu: 24/7 puhelinpalvelu`,
    }

    const systemPrompt = contexts[scenario as keyof typeof contexts] || contexts.ecommerce

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      maxTokens: 500,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("AI response error:", error)
    return "Anteeksi, tapahtui virhe. Yritä hetken kuluttua uudelleen tai ota yhteyttä asiakaspalveluun."
  }
}

function checkForEscalation(userMessage: string, scenario: string): EscalationInfo {
  const lowerMessage = userMessage.toLowerCase()

  // Yleiset eskalaatio-avainsanat
  const generalEscalationKeywords = [
    "haluan puhua ihmiselle",
    "haluan puhua henkilölle",
    "en ole tyytyväinen",
    "tämä ei toimi",
    "haluan valittaa",
    "tämä on kiireellinen",
    "hätätapaus",
    "en saa apua",
    "tämä ei auta",
    "haluan asiakaspalveluun",
    "soittakaa minulle",
    "tarvitsen apua heti",
  ]

  // Tarkista yleiset eskalaatio-avainsanat
  for (const keyword of generalEscalationKeywords) {
    if (lowerMessage.includes(keyword)) {
      return {
        shouldEscalate: true,
        reason: "customer_request",
        contactInfo: getContactInfo(scenario, "high"),
      }
    }
  }

  // Toimialakohtaiset eskalaatiot
  switch (scenario) {
    case "healthcare":
      const healthcareKeywords = [
        "kipu",
        "särky",
        "kuume",
        "hengenahdistus",
        "rintakipu",
        "tajuttomuus",
        "verenvuoto",
        "myrkyty",
        "allerginen reaktio",
        "sydänkohtaus",
        "aivohalvaus",
        "vakava tapaturma",
      ]

      for (const keyword of healthcareKeywords) {
        if (lowerMessage.includes(keyword)) {
          return {
            shouldEscalate: true,
            reason: "medical_emergency",
            contactInfo: getContactInfo(scenario, "high"),
          }
        }
      }
      break

    case "banking":
      const bankingKeywords = [
        "kortti varastettu",
        "tili hakkeroitu",
        "luvaton maksu",
        "identiteettivarkaus",
        "petos",
        "huijaus",
        "väärinkäyttö",
      ]

      for (const keyword of bankingKeywords) {
        if (lowerMessage.includes(keyword)) {
          return {
            shouldEscalate: true,
            reason: "security_issue",
            contactInfo: getContactInfo(scenario, "high"),
          }
        }
      }
      break

    case "ecommerce":
      const ecommerceKeywords = [
        "tuote rikki",
        "vaarallinen tuote",
        "sähköisku",
        "tulipalo",
        "myrkyllinen",
        "allergia",
        "loukkaantuminen",
      ]

      for (const keyword of ecommerceKeywords) {
        if (lowerMessage.includes(keyword)) {
          return {
            shouldEscalate: true,
            reason: "safety_issue",
            contactInfo: getContactInfo(scenario, "high"),
          }
        }
      }
      break
  }

  return { shouldEscalate: false }
}

function getContactInfo(scenario: string, urgency: "low" | "medium" | "high") {
  const contactInfoMap = {
    ecommerce: {
      phone: "010-123-4567",
      email: "asiakaspalvelu@techmart.fi",
      hours: "Ma-Pe 8-18",
      urgency,
    },
    restaurant: {
      phone: "09-123-4567",
      email: "varaukset@ravintolakulma.fi",
      hours: "Ma-To 11-22, Pe-La 11-23, Su 12-21",
      urgency,
    },
    realestate: {
      phone: "010-456-7890",
      email: "myynti@kiinteistokoti.fi",
      hours: "Ma-Pe 9-17, La 10-14",
      urgency,
    },
    healthcare: {
      phone: urgency === "high" ? "112" : "010-123-4567",
      email: "ajanvaraus@terveysplus.fi",
      hours: urgency === "high" ? "24/7 hätänumero" : "Ma-Pe 7-20, La-Su 9-18",
      urgency,
    },
    banking: {
      phone: urgency === "high" ? "0800-123-456 (24h turvalinja)" : "010-789-0123",
      email: "asiakaspalvelu@kotipankki.fi",
      hours: urgency === "high" ? "24/7 turvapalvelu" : "Ma-Pe 9-17",
      urgency,
    },
  }

  return contactInfoMap[scenario as keyof typeof contactInfoMap] || contactInfoMap.ecommerce
}

function generateEscalationResponse(escalation: EscalationInfo, scenario: string): string {
  const { contactInfo, reason } = escalation

  if (!contactInfo) return "Ota yhteyttä asiakaspalveluun saadaksesi lisäapua."

  let response = ""

  // Räätälöidyt viestit syyn mukaan
  switch (reason) {
    case "medical_emergency":
      response = `## 🚨 KIIREELLINEN TILANNE

Jos kyseessä on **hätätilanne**, soita heti **112**.

### Muissa kiireellisissä terveysasioissa:
• **Puhelin:** ${contactInfo.phone}
• **Sähköposti:** ${contactInfo.email}
• **Aukioloajat:** ${contactInfo.hours}

> Voin auttaa yleisneuvonnassa, mutta lääketieteelliset asiat vaativat ammattilaisen arvion.`
      break

    case "security_issue":
      response = `## 🔒 TURVALLISUUSASIA

Ota **välittömästi** yhteyttä turvapalveluumme:

### Yhteystiedot:
• **Puhelin:** ${contactInfo.phone}
• **Sähköposti:** ${contactInfo.email}
• **Aukioloajat:** ${contactInfo.hours}

> **TÄRKEÄÄ:** Jos epäilet petosta tai väärinkäyttöä, älä jaa henkilökohtaisia tietoja chatissa.`
      break

    case "safety_issue":
      response = `## ⚠️ TURVALLISUUSASIA

Turvallisuuteen liittyvissä asioissa ota **heti** yhteyttä:

### Yhteystiedot:
• **Puhelin:** ${contactInfo.phone}
• **Sähköposti:** ${contactInfo.email}
• **Aukioloajat:** ${contactInfo.hours}

> Jos tuote aiheuttaa välitöntä vaaraa, **lopeta sen käyttö välittömästi**.`
      break

    case "customer_request":
    default:
      response = `## 👋 Yhdistän sinut henkilökohtaiseen palveluun

Ymmärrän että tarvitset henkilökohtaista apua. Ota yhteyttä:

### Yhteystiedot:
• **Puhelin:** ${contactInfo.phone}
• **Sähköposti:** ${contactInfo.email}
• **Aukioloajat:** ${contactInfo.hours}

*Asiakaspalvelumme auttaa sinua mielellään kaikissa asioissa!*`
      break
  }

  // Lisää toimialakohtaisia ohjeita
  switch (scenario) {
    case "healthcare":
      response += `

### 💡 Vinkki
Voit myös varata ajan verkossa osoitteessa **terveysplus.fi**`
      break
    case "restaurant":
      response += `

### 💡 Vinkki
Kiireellisissä varauksissa **soittaminen** on nopein tapa!`
      break
    case "banking":
      response += `

### 💡 Muista
Pankki ei **koskaan** kysy salasanoja puhelimitse tai sähköpostitse.`
      break
  }

  return response
}
