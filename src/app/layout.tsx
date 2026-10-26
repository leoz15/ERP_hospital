import './globals.css';
import { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MainContent } from '@/components/layout/MainContent';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'Hospital ERP & Inventory Management System',
  description: 'Enterprise ERP ระบบบริหารจัดการโรงพยาบาล คลังสินค้า และจัดซื้อจัดจ้าง',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-[#F5F8FC] text-[#14213D] antialiased selection:bg-blue-100 selection:text-blue-900">
        <AppProvider>
          <div className="flex min-h-screen bg-[#F5F8FC]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              <MainContent>{children}</MainContent>
            </div>
          </div>
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
