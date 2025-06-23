import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from '@/contextes/AuthContext';
import { CartProvider } from '@/contextes/CartContext';
import { ModalProvider } from '@/contextes/ModalContext';
import { OrderModalProvider } from '@/contextes/OrderModalContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YATTE",
  description: "La boutique des bonnes affaires",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <ModalProvider>
              <OrderModalProvider>
                {children}
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  pauseOnHover
                  theme="light"
                  style={{ zIndex: 999999999 }}
                />
              </OrderModalProvider>
            </ModalProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
