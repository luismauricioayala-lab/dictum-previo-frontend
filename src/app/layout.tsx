import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-serif" 
});

export const metadata: Metadata = {
  title: "Dictum Previo | Una segunda opinión antes de firmar tus arras",
  description: "Evaluación independiente de riesgos de activos reales. Contrastamos el precio de oferta y simulamos tu esfuerzo hipotecario real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased selection:bg-orange-100 selection:text-orange-800">
        {children}
      </body>
    </html>
  );
}