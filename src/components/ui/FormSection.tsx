"use client";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

const gridCols = { 1: "grid-cols-1", 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-3" };

export function FormSection({ title, children, columns = 2 }: FormSectionProps) {
  return (
    <section className="space-y-4">
      <h2 
        className="text-xs font-bold text-[#1a2a4a] uppercase tracking-wider border-b-2 border-[#e2ebe6] pb-2"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h2>
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {children}
      </div>
    </section>
  );
}
