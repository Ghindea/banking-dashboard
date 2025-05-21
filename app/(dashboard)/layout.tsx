// app/(dashboard)/layout.tsx

import { Inter } from "next/font/google"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <SidebarProvider>
          <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="p-4 w-full max-w-full">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  )
}