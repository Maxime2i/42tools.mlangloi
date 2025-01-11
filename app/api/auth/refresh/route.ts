import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json()

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.NEXT_PUBLIC_42_CLIENT_ID || '',
      client_secret: process.env.CLIENT_SECRET_42 || '',
      refresh_token: refreshToken,
    })

    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: 'Erreur de rafraîchissement du token', details: errorData }, { status: 401 })
    }

    const tokenData = await response.json()
    return NextResponse.json(tokenData)

  } catch (error) {
    console.error('Erreur complète:', error)
    return NextResponse.json({ error: 'Erreur serveur', details: error }, { status: 500 })
  }
}