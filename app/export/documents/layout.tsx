export default function DocumentsExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[900px] w-[1440px] overflow-hidden bg-[#EDECEA]">
      {children}
    </div>
  );
}
