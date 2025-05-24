"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Demo-vastaukset jos API-avain puuttuu
const demoResponses = {
  ecommerce: [
    "Hei! 👋 Kiitos yhteydenotostasi **TechMart Oy:hyn**. Voin auttaa sinua tuotetietojen, tilausten ja palautusten kanssa.\n\n## Miten voin auttaa?\n• Tuotetiedot ja saatavuus\n• Tilausten seuranta\n• Palautukset ja reklamaatiot\n• Tekninen tuki",

    "**iPhone 15 Pro** on varastossa! 📱\n\n## Saatavilla olevat mallit:\n• 128GB - **1299€**\n• 256GB - **1449€**\n• 512GB - **1699€**\n\n*Toimitusaika: 1-2 arkipäivää*\n\nHaluatko lisätietoja jostain mallista?",

    "## Palautusohjeet 📦\n\nVoit palauttaa tuotteen **30 päivän** kuluessa ostosta:\n\n• Palauta tuote alkuperäispakkauksessa\n• Liitä mukaan **ostokuitti**\n• Ilmoita palautus syystä\n• Toimitamme palautustarran sähköpostitse\n\n*Palautuksen käsittelyaika: 3-5 arkipäivää*",
  ],

  restaurant: [
    "Tervetuloa **Ravintola Kulmaan**! 🍽️\n\n## Voin auttaa sinua:\n• Pöytävaraukset\n• Menu ja ruokalistat\n• Erikoisruokavaliot\n• Aukioloajat ja yhteystiedot\n\nMiten voin palvella?",

    "## Pöytävaraus kahdelle ✨\n\nVoin varata teille pöydän! Milloin haluaisitte tulla?\n\n**Vapaat ajat tänään:**\n• 18:00 - 20:00\n• 20:30 - 22:00\n\n*Varaus onnistuu myös puhelimitse: 09-123 4567*",

    "## Vegaaniset vaihtoehdot 🌱\n\nMeillä on erinomainen valikoima vegaanisia ruokia:\n\n• **Vegaaninen risotto** - 18€\n• **Kasvispihvi perunoilla** - 16€\n• **Vegaaninen pasta** - 15€\n\n*Kaikki kastikkeet ja lisukkeet ovat myös vegaanisia!*",
  ],

  healthcare: [
    "Tervetuloa **TerveysKeskus Plus:aan**! 🏥\n\n## Voin auttaa:\n• Ajanvaraukset\n• Palvelumme\n• Aukioloajat\n• Yhteystiedot\n\n**KIIREELLISISSÄ TAPAUKSISSA SOITA 112!**",

    "## Ajanvaraus lääkärille 👩‍⚕️\n\n**Vapaat ajat tällä viikolla:**\n• Tiistai 14:30\n• Keskiviikko 10:15\n• Perjantai 16:00\n\n*Varaa aika: 010-123 4567*\n\nMikä aika sopisi sinulle parhaiten?",
  ],

  realestate: [
    "Tervetuloa **Kiinteistö Koti Oy:hyn**! 🏠\n\n## Voin auttaa:\n• Asuntojen haku\n• Näyttöjen varaaminen\n• Hintatiedot\n• Laina-asiat\n\nMitä asuntoa etsit?",

    "## 3h+k asunnot Helsingissä 🏙️\n\n**Saatavilla olevia kohteita:**\n• Punavuori, 75m² - **450 000€**\n• Kallio, 68m² - **380 000€**\n• Töölö, 82m² - **520 000€**\n\n*Voin varata näytön mihin tahansa kohteeseen!*",
  ],

  banking: [
    "Tervetuloa **Koti Pankkiin**! 🏦\n\n## Voin auttaa:\n• Tilit ja kortit\n• Lainat ja asuntolainat\n• Sijoitukset\n• Maksuliikenteen ongelmat\n\n**Muista: emme koskaan kysy tunnuksiasi puhelimitse!**",

    "## Asuntolainan hakeminen 🏠\n\n**Tarvittavat tiedot:**\n• Tulotiedot (palkkatodistus)\n• Varallisuustiedot\n• Kohteen tiedot\n• Henkilöllisyystodistus\n\n*Lainapäätös yleensä 1-3 arkipäivässä*\n\nHaluatko varata ajan lainaneuvotteluun?",
  ],
}

export async function generateAIResponse(messages: ChatMessage[], scenario = "ecommerce"): Promise<string> {
  // Tarkista kaikki mahdolliset ympäristömuuttujat
  const apiKey =
    process.env.NEXT_PUBLIC_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.API_KEY ||
    process.env.NEXT_PUBLIC_GROQ_API_KEY

  console.log("🔍 Environment check:")
  console.log("- NEXT_PUBLIC_API_KEY:", process.env.NEXT_PUBLIC_API_KEY ? "✅ Found" : "❌ Missing")
  console.log("- GROQ_API_KEY:", process.env.GROQ_API_KEY ? "✅ Found" : "❌ Missing")
  console.log("- API_KEY:", process.env.API_KEY ? "✅ Found" : "❌ Missing")
  console.log("- NEXT_PUBLIC_GROQ_API_KEY:", process.env.NEXT_PUBLIC_GROQ_API_KEY ? "✅ Found" : "❌ Missing")
  console.log(
    "- Final API key:",
    apiKey ? `✅ Using key starting with: ${apiKey.substring(0, 10)}...` : "❌ No key found",
  )

  // Jos API-avain puuttuu, käytä demo-vastauksia
  if (!apiKey || apiKey.length < 10) {
    console.log("🎭 Demo mode - using predefined responses")

    const responses = demoResponses[scenario as keyof typeof demoResponses] || demoResponses.ecommerce
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    // Simuloi latausaikaa
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    return randomResponse + "\n\n*⚠️ Demo-mode: Lisää GROQ_API_KEY .env.local tiedostoon oikeaa AI:ta varten*"
  }

  try {
    console.log("🤖 Attempting to use real AI with Groq")

    // Initialize Groq with the API key
    const groq = createGroq({
      apiKey: apiKey,
    })

    const context = contexts[scenario as keyof typeof contexts] || contexts.ecommerce

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        {
          role: "system",
          content: context,
        },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 500,
    })

    console.log("✅ AI Response received successfully")
    return text
  } catch (error) {
    console.error("❌ AI Response Error:", error)

    // Tarkista virhetyyppi
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "🔑 **API-avain virhe!** Tarkista että GROQ_API_KEY on oikein .env.local tiedostossa."
      }
      if (error.message.includes("model")) {
        return "🤖 **Malli-ongelma!** Groq-malli ei ole käytettävissä. Kokeile myöhemmin uudelleen."
      }
      if (error.message.includes("rate limit")) {
        return "⏱️ **Liikaa pyyntöjä!** Odota hetki ennen seuraavaa viestiä."
      }
    }

    // Fallback demo-vastauksiin
    const responses = demoResponses[scenario as keyof typeof demoResponses] || demoResponses.ecommerce
    return responses[0] + "\n\n*⚠️ Virhe AI:ssa - käytössä demo-mode*"
  }
}

const contexts = {
  ecommerce: `Olet TechMart Oy:n asiakaspalveluassistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** tärkeille asioille
- ## Otsikot osioille
- • Luettelot selkeyttämään

Vastaa ystävällisesti ja ammattimaisesti.`,

  restaurant: `Olet Ravintola Kulman varausassistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** ruokien nimille
- ## Otsikot osioille

Vastaa lämminhenkisesti.`,

  realestate: `Olet Kiinteistö Koti Oy:n assistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** hinnoille
- ## Otsikot osioille

Vastaa asiantuntevasti.`,

  healthcare: `Olet TerveysKeskus Plus:n assistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** tärkeille tiedoille
- ## Otsikot osioille

TÄRKEÄÄ: Muistuta aina että kiireellisissä tapauksissa soitetaan 112.`,

  banking: `Olet Koti Pankin asiakasneuvoja. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** summille
- ## Otsikot osioille

TÄRKEÄÄ: Muistuta turvallisuudesta.`,
}
