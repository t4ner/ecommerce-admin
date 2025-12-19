import "./globals.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
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
      <body className="antialiased">
        <ProtectedRoute>
          <AppLayout>{children}</AppLayout>
        </ProtectedRoute>
      </body>
    </html>
  );
}
