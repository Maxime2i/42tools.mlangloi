import { Metadata } from 'next'
import localFont from "next/font/local"
import "./globals.css"
import { Header } from "@/components/Header"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const generateMetadata = async ({ params, searchParams }): Promise<Metadata> => {
  const pathname = params?.slug || ''
  
  try {
    if (pathname.includes('rncp')) {
      const { metadata } = await import('./rncp/metadata')
      return metadata
    } else if (pathname.includes('projects')) {
      const { metadata } = await import('./projects/metadata')
      return metadata
    } else if (pathname.includes('dashboard')) {
      const { metadata } = await import('./dashboard/metadata')
      return metadata
    } else if (pathname.includes('callback')) {
      const { metadata } = await import('./callback/metadata')
      return metadata
    }
  } catch (error) {
    console.error('Erreur lors du chargement des métadonnées:', error)
  }
  
  const { metadata } = await import('./metadata')
  return metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href="https://42tools.mlangloi.fr" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
