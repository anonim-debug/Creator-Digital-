export const metadata = {
  title: "Creator Digital",
  description: "Tools AI, portofolio, dan website builder otomatis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
  }
