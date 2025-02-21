'use client'

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import Image from "next/image"
import { RefreshButton } from '@/components/RefreshButton'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export function Header() {
  const pathname = usePathname()
  const noHeaderRoutes = ['/', '/callback']
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  if (noHeaderRoutes.includes(pathname)) {
    return null
  }

  const getPageName = (pathname: string) => {
    if (pathname === '/accueil') return 'Accueil'
    if (pathname === '/projects') return 'Projects'
    if (pathname === '/rncp') return 'Titres RNCP'
    return '42'
  }

  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0 ">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row space-y-4 sm:space-y-0 sm:space-x-8">
              <NavigationMenuItem>
                <Image 
                  src="/logo.png" 
                  alt="42 Logo" 
                  width={32} 
                  height={32}
                  className="invert opacity-90 transition-all hover:opacity-100"
                />
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden sm:block">
                <Link legacyBehavior passHref href="/accueil">
                  <NavigationMenuLink className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200" onClick={closeMenu}>
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden sm:block">
                <Link legacyBehavior passHref href="/projects">
                  <NavigationMenuLink className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200" onClick={closeMenu}>
                    Projects
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden sm:block">
                <Link legacyBehavior passHref href="/rncp">
                  <NavigationMenuLink className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200" onClick={closeMenu}>
                    Titres RNCP
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* <div className="hidden sm:block mt-4 md:mt-0">
            <RefreshButton />
          </div> */}
          <div className="md:hidden">
            <h1 className="text-white text-2xl font-semibold">{getPageName(pathname)}</h1>
          </div>
          <div className="flex justify-end sm:hidden">
            <button className="text-gray-400 hover:text-white z-10" onClick={toggleMenu}>
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center h-[100vh]">
          <ul className="mt-2">
            <li><Link href="/accueil" className="block text-white text-4xl text-center" onClick={closeMenu}>Accueil</Link></li>
            <li><Link href="/projects" className="block text-white text-4xl mt-4 text-center" onClick={closeMenu}>Projects</Link></li>
            <li><Link href="/rncp" className="block text-white text-4xl mt-4 text-center" onClick={closeMenu}>Titres RNCP</Link></li>
          </ul>
        </div>
      )}
    </header>
  )
}