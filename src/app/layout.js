import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import {
  Quicksand,
  Albert_Sans,
  Parkinsans,
  Montserrat,
  Poppins,
} from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  fallback: ["system-ui", "arial"],
  weight: ["400", "500", "600", "700"],
});

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  fallback: ["system-ui", "arial"],
  weight: ["400", "500", "600", "700"],
});

const parkinsans = Parkinsans({
  subsets: ["latin"],
  variable: "--font-parkinsans",
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "arial"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "arial"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "arial"],
});
export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      className={`${quicksand.variable} ${albertSans.variable} ${parkinsans.variable} ${montserrat.variable} ${poppins.variable}`}
    >
      <body className="antialiased font-[poppins]">
        <div className="flex max-h-screen overflow-hidden bg-[#e0e0eb] ">
          <Sidebar />
          <div className="flex w-full max-h-screen flex-col overflow-hidden py-5 pr-5">
            <main className="h-full w-full overflow-auto rounded-xl border-2 border-gray-300 bg-white p-7 shadow-sm">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
