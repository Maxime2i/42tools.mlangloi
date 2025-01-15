import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import Image from "next/image";
import { RefreshButton } from '@/components/RefreshButton'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "42 RNCP Dashboard",
  description: "Plateforme de gestion RNCP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}>
        <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <NavigationMenu>
                <NavigationMenuList className="space-x-8">
                  <NavigationMenuItem>
                    <Image 
                      src="/logo.png" 
                      alt="42 Logo" 
                      width={32} 
                      height={32}
                      className="invert opacity-90 transition-all hover:opacity-100"
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                      href="/dashboard"
                    >
                      Dashboard
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                      href="/projects"
                    >
                      Projects
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                      href="/rncp"
                    >
                      Titre RNCP
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <RefreshButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
