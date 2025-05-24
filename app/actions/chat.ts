"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Initialize Groq with the API key from environment variables
const groq = createGroq({
  apiKey: process.env.API_KEY || process.env.GROQ_API_KEY,
})

export async function generateAIResponse(messages: ChatMessage[], scenario = "ecommerce"): Promise<string> {
  try {
    // Tarkista että API-avain on olemassa
    const apiKey = process.env.API_KEY || process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error("❌ API key missing!")
      throw new Error("API key not found")
    }

    console.log("✅ API key found, making request...")
    console.log("📝 Scenario:", scenario)
    console.log("💬 Messages count:", messages.length)

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

    console.log("✅ AI Response received:", text.substring(0, 100) + "...")
    return text
  } catch (error) {
    console.error("❌ AI Response Error:", error)

    // Tarkista onko kyse API-avaimesta
    if (error instanceof Error && error.message.includes("API key")) {
      return "🔑 **API-avain puuttuu!** Lisää GROQ_API_KEY ympäristömuuttujiin."
    }

    // Tarkista onko kyse mallista
    if (error instanceof Error && error.message.includes("model")) {
      return "🤖 **Malli-ongelma!** Kokeillaan toista mallia..."
    }

    // Yleinen virheviesti skenaariokohtaisesti
    const errorResponses = {
      ecommerce:
        "🛒 **TechMart Oy** - Järjestelmässä on väliaikainen häiriö. Kokeile hetken kuluttua uudelleen tai ota yhteyttä asiakaspalveluun **010-123 4567**.",

      restaurant:
        "🍽️ **Ravintola Kulma** - Varausjärjestelmässä on häiriö. Voit soittaa suoraan **09-123 4567** tai tulla paikan päälle (Keskuskatu 15, Helsinki).",

      realestate:
        "🏠 **Kiinteistö Koti Oy** - Järjestelmässä on häiriö. Ota yhteyttä välittäjiin **09-234 5678** tai **myynti@kiinteistokoti.fi**.",

      healthcare:
        "🏥 **TerveysKeskus Plus** - Ajanvarausjärjestelmässä häiriö. **Kiireellisissä tapauksissa soita 112!** Muuten **010-123 4567**.",

      banking:
        "🏦 **Koti Pankki** - Järjestelmässä häiriö. Asiakaspalvelu **24/7: 0200-12345**. **Muista: emme koskaan kysy tunnuksiasi puhelimitse!**",
    }

    return errorResponses[scenario as keyof typeof errorResponses] || errorResponses.ecommerce
  }
}

const contexts = {
  ecommerce: `Olet TechMart Oy:n asiakaspalveluassistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** tärkeille asioille
- *Kursiivi* korostukseen  
- ## Otsikot osioille
- • Luettelot selkeyttämään

**Yrityksen tiedot:**
- Nimi: TechMart Oy
- Erikoisala: Elektroniikka ja tekniikka
- Toimitusajat: 1-3 arkipäivää
- Palautusoikeus: 30 päivää
- Asiakaspalvelu: Ma-Pe 8-18

Vastaa ystävällisesti ja ammattimaisesti. Älä käytä liikaa emojeja.`,

  restaurant: `Olet Ravintola Kulman varausassistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** ruokien nimille
- ## Otsikot (Menu, Varaukset)
- • Luettelot vaihtoehdoille

**Ravintolan tiedot:**
- Nimi: Ravintola Kulma
- Sijainti: Keskuskatu 15, Helsinki
- Aukioloajat: Ma-To 11-22, Pe-La 11-23, Su 12-21
- Erikoisuudet: Vegaaniset vaihtoehdot

Vastaa lämminhenkisesti.`,

  realestate: `Olet Kiinteistö Koti Oy:n assistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** hinnoille
- ## Otsikot osioille
- • Luettelot ominaisuuksille

**Yrityksen tiedot:**
- Nimi: Kiinteistö Koti Oy
- Alue: Helsinki ja lähikunnat
- Palvelut: Myynti, vuokraus, arvioinnit
- Asiakaspalvelu: Ma-Pe 9-17

Vastaa asiantuntevasti.`,

  healthcare: `Olet TerveysKeskus Plus:n assistentti. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** tärkeille tiedoille
- ## Otsikot osioille
- • Luettelot palveluille

**Terveysaseman tiedot:**
- Nimi: TerveysKeskus Plus
- Aukioloajat: Ma-Pe 7-20, La-Su 9-18
- Ajanvaraus: 010-123 4567

**TÄRKEÄÄ:** Muistuta aina että kiireellisissä tapauksissa soitetaan 112.`,

  banking: `Olet Koti Pankin asiakasneuvoja. Vastaa AINA suomeksi ja lyhyesti.

**Käytä Markdown-muotoilua:**
- **Lihavointi** summille ja koroille
- ## Otsikot osioille
- • Luettelot palveluille

**Pankin tiedot:**
- Nimi: Koti Pankki
- Palvelut: Tilit, lainat, kortit
- Asiakaspalvelu: 24/7

**TÄRKEÄÄ:** Muistuta turvallisuudesta - emme koskaan kysy tunnuksia puhelimitse.`,
}
