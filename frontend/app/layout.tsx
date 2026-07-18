import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata = {
  title: "Employee Management System",
  description: "EMS built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  );
}