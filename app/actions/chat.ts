"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Initialize Groq with the API key from environment variables
// Try different possible environment variable names
const groq = createGroq({
  apiKey: process.env.API_KEY || process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
})

export async function generateAIResponse(messages: ChatMessage[], scenario = "ecommerce"): Promise<string> {
  try {
    // Debug: Log available environment variables (remove in production)
    console.log("Available env vars:", {
      API_KEY: process.env.API_KEY ? "✓ Found" : "✗ Missing",
      GROQ_API_KEY: process.env.GROQ_API_KEY ? "✓ Found" : "✗ Missing",
      NEXT_PUBLIC_GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY ? "✓ Found" : "✗ Missing",
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

    return text
  } catch (error) {
    console.error("AI Response Error:", error)

    // Fallback vastaukset eri skenaarioille
    const fallbackResponses = {
      ecommerce:
        "Kiitos yhteydenotostasi! Valitettavasti järjestelmässämme on tällä hetkellä teknisiä ongelmia. Voit ottaa yhteyttä asiakaspalveluumme puhelimitse **010-123 4567** tai sähköpostitse **asiakaspalvelu@techmart.fi**. Olemme tavoitettavissa ma-pe 8-18.",

      restaurant:
        "Kiitos yhteydenotostasi Ravintola Kulmaan! Järjestelmässämme on tällä hetkellä teknisiä ongelmia. Voit varata pöydän suoraan puhelimitse **09-123 4567** tai käydä paikan päällä osoitteessa **Keskuskatu 15, Helsinki**. Olemme avoinna ma-to 11-22, pe-la 11-23, su 12-21.",

      realestate:
        "Kiitos yhteydenotostasi Kiinteistö Koti Oy:hyn! Järjestelmässämme on teknisiä ongelmia. Ota yhteyttä kiinteistönvälittäjiimme suoraan puhelimitse **09-234 5678** tai sähköpostitse **myynti@kiinteistokoti.fi**. Asiakaspalvelu ma-pe 9-17, la 10-14.",

      healthcare:
        "Kiitos yhteydenotostasi TerveysKeskus Plus:aan! Järjestelmässä on teknisiä ongelmia. **Kiireellisissä tapauksissa soita 112.** Ajanvaraukseen voit soittaa **010-123 4567** (ma-pe 7-20, la-su 9-18) tai käydä päivystyksessä.",

      banking:
        "Kiitos yhteydenotostasi Koti Pankkiin! Järjestelmässä on teknisiä ongelmia. Ota yhteyttä asiakaspalveluumme **24/7 numerossa 0200-12345** tai käy lähimmässä konttorissa (Helsinki, Espoo, Vantaa). **Muista: emme koskaan kysy tunnuksiasi puhelimitse tai sähköpostitse.**",
    }

    return fallbackResponses[scenario as keyof typeof fallbackResponses] || fallbackResponses.ecommerce
  }
}

const contexts = {
  ecommerce: `Olet TechMart Oy:n asiakaspalveluassistentti. Auta asiakkaita tuotetietojen, tilausten, palautusten ja teknisen tuen kanssa. Ole ystävällinen ja ammattimainen. Vastaa AINA suomeksi.

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
- Asiakaspalvelu: Ma-Pe 8-18

Vastaa lyhyesti ja ytimekkäästi. Älä käytä liikaa emojeja.`,

  restaurant: `Olet Ravintola Kulman varausassistentti. Auta asiakkaita pöytävarauksissa, menussa ja yleisissä kysymyksissä. Ole lämminhenkinen ja palveluhenkinen. Vastaa AINA suomeksi.

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
- Erikoisuudet: Vegaaniset vaihtoehdot, kotiinkuljetus

Vastaa lyhyesti ja ytimekkäästi.`,

  realestate: `Olet Kiinteistö Koti Oy:n kiinteistöassistentti. Auta asiakkaita asuntojen haussa, näytöissä ja kiinteistöasioissa. Ole asiantunteva ja luotettava. Vastaa AINA suomeksi.

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
- Asiakaspalvelu: Ma-Pe 9-17, La 10-14

Vastaa lyhyesti ja ytimekkäästi.`,

  healthcare: `Olet TerveysKeskus Plus:n ajanvarausassistentti. Auta asiakkaita ajanvarauksissa, terveyspalveluissa ja yleisneuvonnassa. Ole empaattinen ja ammattimainen. Vastaa AINA suomeksi.

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
- Ajanvaraus: Puh 010-123 4567

Vastaa lyhyesti ja ytimekkäästi. Muistuta aina että kiireellisissä tapauksissa soitetaan 112.`,

  banking: `Olet Koti Pankin asiakasneuvoja. Auta asiakkaita pankkipalveluissa, lainoissa ja tileissä. Ole luotettava ja selkeä. Vastaa AINA suomeksi.

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
- Asiakaspalvelu: 24/7 puhelinpalvelu

Vastaa lyhyesti ja ytimekkäästi. Muistuta turvallisuudesta.`,
}
