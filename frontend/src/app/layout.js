export const metadata = {
  title: 'FinFlow',
  description: 'Financial management application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
