import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    
    const redirect_uri = process.env.NEXT_PUBLIC_42_REDIRECT_URI

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_42_CLIENT_ID || '',
      client_secret: process.env.CLIENT_SECRET_42 || '',
      code: code,
      redirect_uri: redirect_uri || '',
    })

    const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Réponse API 42:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData
      })
      return NextResponse.json({ error: 'Erreur d\'authentification', details: errorData }, { status: 401 })
    }

    const tokenData = await tokenResponse.json()
    return NextResponse.json(tokenData)

  } catch (error) {
    console.error('Erreur complète:', error)
    return NextResponse.json({ error: 'Erreur serveur', details: error }, { status: 500 })
  }
}