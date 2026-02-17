import DashboardLayout from '@/components/layout/dashboard-layout';
import { SidebarProvider } from '@/context/sidebar-context';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </SidebarProvider>
    );
}
