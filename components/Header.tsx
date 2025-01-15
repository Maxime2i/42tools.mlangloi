'use client'

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import Image from "next/image"
import { RefreshButton } from '@/components/RefreshButton'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const noHeaderRoutes = ['/', '/callback']

  if (noHeaderRoutes.includes(pathname)) {
    return null
  }

  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
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
          <div className="mt-4 md:mt-0">
            <RefreshButton />
          </div>
        </div>
      </div>
    </header>
  )
}