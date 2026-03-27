import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "S.R Motor Teck ERP",
  description: "ERP da S.R Motor Teck Auto Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          background: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
