import { Inter } from "next/font/google"
import Sidebar from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
} 