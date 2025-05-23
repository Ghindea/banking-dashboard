"use client"

import type React from "react"
import Link from "next/link"
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
  LogOut,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect } from "react"
import axios from "axios"

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
    title: "Products",
    path: "/products",
    icon: ShoppingBag,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
  {
    title: "Accounts",
    path: "/accounts",
    icon: CreditCard,
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()
  const { user, logout } = useAuth()
  const isCollapsed = state === "collapsed"
  const [userName, setUserName] = useState("User")
  const [userInitial, setUserInitial] = useState("U")
  const [customerType, setCustomerType] = useState("")

  // Fetch user data when sidebar loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.type === "client") {
        try {
          const response = await axios.get("http://20.185.231.218:5000/user/profile")
          if (response.data) {
            // Get user info from data
            const occupation = response.data.GPI_CLS_CODE_PT_OCCUP || "User"
            const customerTypeDesc = response.data.GPI_CUSTOMER_TYPE_DESC || ""
            const age = response.data.GPI_AGE || ""

            // Create a display name
            let displayName = occupation;
            if (age) {
              displayName = `${occupation}, ${age}y`;
            }

            setUserName(displayName)
            setUserInitial(occupation.charAt(0))
            setCustomerType(customerTypeDesc)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setUserName("Client")
          setUserInitial("C")
        }
      } else if (user?.type === "admin") {
        setUserName("Admin")
        setUserInitial("A")
        setCustomerType("Administrator")
      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user])

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
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
            <span className="text-white font-bold">{userInitial}</span>
          </div>

          {!isCollapsed && (
            <>
              <div className="ml-2 flex-1 min-w-0 flex items-center justify-center">
                <div className="text-sm font-medium text-gray-900">Welcome back</div>
              </div>

              {/* Logout button - visible when sidebar is expanded */}
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
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
              onClick={logout}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
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
        className="absolute top-1/2 -right-3 h-6 w-6 transform -translate-y-1/2 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-100 z-10 transition-colors"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft className={cn("h-3 w-3 text-gray-600 transition-transform", isCollapsed && "rotate-180")} />
      </button>
    </div>
  )
}