import Sidebar from "@/components/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<div className="flex h-screen">
				<Sidebar />
				<main className="flex-1 overflow-auto">
					<div className="p-4">
						<SidebarTrigger className="mb-4" />
						{children}
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}