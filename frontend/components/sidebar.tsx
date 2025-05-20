"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Tag, Calendar, ShoppingBag, BarChart3, Settings, LifeBuoy, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

interface SidebarItem {
  title: string
  path: string
  icon: React.ElementType
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Offers",
    path: "/offers",
    icon: Tag,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
  {
    title: "Suppliers",
    path: "/suppliers",
    icon: ShoppingBag,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Support",
    path: "/support",
    icon: LifeBuoy,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  return (
    <div className="relative w-60">
      <aside className="w-60 bg-georgel-lightPurple h-screen flex flex-col">
        <div className="p-4 flex items-center">
          <div className="h-8 w-8 bg-georgel-purple rounded-full flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <span className="ml-2 font-bold text-lg">Georgel</span>
        </div>

        <nav className="flex-1 mt-8">
          <ul className="space-y-2 px-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      isActive ? "bg-georgel-purple text-white" : "text-gray-700 hover:bg-georgel-lightPurple/70",
                    )}
                  >
                    <Icon size={18} />
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto flex items-center">
          <div className="h-10 w-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">J</span>
          </div>
          <div className="ml-2">
            <div className="text-xs text-gray-500">Welcome back</div>
            <div className="font-medium">Jonathan</div>
          </div>
        </div>
      </aside>

      {/* Collapse button positioned exactly on the edge */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 h-6 w-6 transform -translate-y-1/2 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-100 z-10"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft className="h-3 w-3 text-gray-600" />
      </button>
    </div>
  )
}
