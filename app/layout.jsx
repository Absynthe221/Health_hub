import { Inter } from 'next/font/google';
import { NotificationProvider } from './contexts/NotificationContext';
import { UserProvider } from '../contexts/UserContext';
import { AuthProvider } from '../contexts/AuthContext';
import NextAuthSessionProvider from '../components/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Health Hub ECG - Learning Platform',
  description: 'Comprehensive ECG learning platform for healthcare professionals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <AuthProvider>
            <UserProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </UserProvider>
          </AuthProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
