import type { ButtonHTMLAttributes } from "react";

type Variante = "primaria" | "secundaria" | "perigo";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const classesPorVariante: Record<Variante, string> = {
  primaria: "bg-acento text-secondary hover:opacity-90",
  secundaria: "bg-transparent border border-primary text-text-light hover:bg-primary/20",
  perigo: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  variante = "primaria",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full px-6 py-3 font-sans text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${classesPorVariante[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
