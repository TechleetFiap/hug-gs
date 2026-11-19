import type { Assinatura, NrHumor, Plano } from "../types/hug";

// Data local do aparelho no formato AAAA-MM-DD. Não usar toISOString:
// depois das 21h no Brasil ele devolve o dia seguinte e a API recusa o registro.
export function dataLocalISO(data: Date = new Date()): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function somarDias(iso: string, dias: number): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return dataLocalISO(new Date(ano, mes - 1, dia + dias));
}

export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarReal(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Hug+ ativo = alguma assinatura com período que inclui hoje, num plano exclusivo.
export function temHugPlusAgora(assinaturas: Assinatura[], planos: Plano[]): boolean {
  const hoje = dataLocalISO();
  const exclusivos = new Set(planos.filter((p) => p.flExclusivo === "S").map((p) => p.id));
  return assinaturas.some(
    (a) => a.dtInicio <= hoje && hoje <= a.dtFim && exclusivos.has(a.cdPlano)
  );
}

export const HUMOR: Record<NrHumor, { emoji: string; rotulo: string }> = {
  1: { emoji: "😢", rotulo: "Muito triste" },
  2: { emoji: "🙁", rotulo: "Triste" },
  3: { emoji: "😐", rotulo: "Neutro" },
  4: { emoji: "🙂", rotulo: "Bem" },
  5: { emoji: "😄", rotulo: "Muito bem" },
};

// Remove acentos e caixa para busca por cidade e bairro.
export function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
