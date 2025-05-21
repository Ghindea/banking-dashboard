// components/sidebar.tsx

"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Tag,
  Calendar,
  ShoppingBag,
  BarChart3,
  Settings,
  LifeBuoy,
  ChevronLeft,
  LogOut
} from "lucide-react"
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
  const router = useRouter()
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Handle logout functionality
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated")
    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className={cn("relative", isCollapsed ? "w-16" : "w-60")}>
      <aside className={cn("bg-georgel-lightPurple h-screen flex flex-col transition-all duration-300", isCollapsed ? "w-16" : "w-60")}>
        <div className={cn("p-4 flex items-center", isCollapsed && "justify-center")}>
          <div className="h-8 w-8 bg-georgel-purple rounded-full flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          {!isCollapsed && <span className="ml-2 font-bold text-lg">Georgel</span>}
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
                      isCollapsed && "justify-center",
                      isActive ? "bg-georgel-purple text-white" : "text-gray-700 hover:bg-georgel-lightPurple/70",
                    )}
                    title={isCollapsed ? item.title : undefined} // Show title on hover when collapsed
                  >
                    <Icon size={18} />
                    {!isCollapsed && item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={cn("p-4 mt-auto flex items-center", isCollapsed && "justify-center", "relative")}>
          <div className="h-10 w-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">J</span>
          </div>

          {!isCollapsed && (
            <>
              <div className="ml-2 flex-1">
                <div className="text-xs text-gray-500">Welcome back</div>
                <div className="font-medium">Jonathan</div>
              </div>

              {/* Logout button - visible when sidebar is expanded */}
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}

          {/* Logout button - visible when sidebar is collapsed */}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 h-6 w-6 transform -translate-y-1/2 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-100 z-10"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft className={cn("h-3 w-3 text-gray-600 transition-transform", isCollapsed && "rotate-180")} />
      </button>
    </div>
  )
}