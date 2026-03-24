"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar...", className }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full max-w-sm px-4 py-2 bg-white border-2 border-[#e2ebe6] rounded-sm text-[#1a2a4a] placeholder:text-gray-400
        focus:border-[#1a4a3a] focus:shadow-[3px_3px_0_0_#1a4a3a] focus:outline-none transition-all
        ${className}`}
      style={{ fontFamily: "var(--font-serif)" }}
    />
  );
}
