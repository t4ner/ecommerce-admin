import "./globals.css";
import Sidebar from "@/components/sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <div className="flex min-h-screen bg-[#e0e0eb]">
          <Sidebar />
          <div className="flex flex-col min-h-screen w-full py-5 pr-5 overflow-hidden">
            <main className="bg-white p-6 w-full h-full overflow-auto rounded-xl border-2 border-gray-300">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
