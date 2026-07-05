// app/panelpage/layout.tsx
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white"> {/* আপনার প্যানেলের নিজস্ব থিম */}
        {children}
      </body>
    </html>
  );
}
