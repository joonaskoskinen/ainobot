import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message, budget, timeline } = body

    // Validoi pakolliset kentät
    if (!name || !email || !company || !message) {
      return NextResponse.json({ error: "Pakolliset kentät puuttuvat" }, { status: 400 })
    }

    // Log yhteydenotto (kehitysvaiheessa)
    console.log("📧 Uusi yhteydenotto:", {
      name,
      email,
      company,
      phone,
      message,
      budget,
      timeline,
      timestamp: new Date().toISOString(),
    })

    // EmailJS hoitaa sähköpostin lähetyksen frontend-puolella
    // Tämä endpoint voi tallentaa tiedot tietokantaan tai tehdä muita toimenpiteitä

    return NextResponse.json({
      success: true,
      message: "Yhteydenotto lähetetty onnistuneesti!",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Viestin lähetys epäonnistui" }, { status: 500 })
  }
}
