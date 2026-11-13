// Tipos conforme o GUIA-FRONT-HUG (nomes de campos iguais aos da API).
// O guia não nomeia o campo id dos registros de lista; usamos "id", como nos POSTs. Confirmar com o back.

export interface Usuario {
  id: number;
  nmUsuario: string;
  dsEmail: string;
  dtCadastro: string;
}

export interface NovoUsuario {
  nmUsuario: string;
  dsEmail: string;
  dsSenhaHash: string;
}

// PUT substitui o cadastro: a senha só é enviada quando o usuário troca a senha.
export interface AtualizacaoUsuario {
  nmUsuario: string;
  dsEmail: string;
  dsSenhaHash?: string;
}

export type StatusPsicologo = "PENDENTE" | "APROVADO" | "INATIVO";

// Em GET /psicologo/usuario/{cdUsuario}, o "id" é o cdPsicologo.
export interface PerfilPsicologo {
  id: number;
  cdUsuario: number;
  dsCrp: string;
  dsBiografia: string | null;
  dsStatus: StatusPsicologo;
}

export interface NovoPsicologo {
  cdUsuario: number;
  dsCrp: string;
  dsBiografia: string | null;
}

export type TipoConteudo = "TEXTO" | "VIDEO";
export type SimNao = "S" | "N";

export interface Conteudo {
  id: number;
  cdPsicologo: number;
  nmTitulo: string;
  dsTema: string;
  dsTipo: TipoConteudo;
  dsTexto: string | null;
  dsUrlVideo: string | null;
  flExclusivo: SimNao;
  dtPublicacao: string;
}

export interface NovoConteudo {
  cdPsicologo: number;
  nmTitulo: string;
  dsTema: string;
  dsTipo: TipoConteudo;
  dsTexto: string | null;
  dsUrlVideo: string | null;
  flExclusivo: SimNao;
  dtPublicacao: string;
}

export interface Clinica {
  id: number;
  nmClinica: string;
  dsEndereco: string;
  nmBairro: string;
  nmCidade: string;
  sgUf: string;
  dsTelefone: string | null;
  dsSite: string | null;
}

export type NovaClinica = Omit<Clinica, "id">;

// Vínculo N:N entre psicólogo e clínica.
export interface PsicologoClinica {
  cdPsicologo: number;
  cdClinica: number;
}

export interface Plano {
  id: number;
  nmPlano: string;
  vlMensal: number;
  flExclusivo: SimNao;
}

export interface Assinatura {
  id: number;
  cdUsuario: number;
  cdPlano: number;
  dtInicio: string;
  dtFim: string;
  vlMensalContratado: number;
}

export type NrHumor = 1 | 2 | 3 | 4 | 5;

export interface RegistroHumor {
  id: number;
  cdUsuario: number;
  dtRegistro: string;
  nrHumor: NrHumor;
  dsRelato: string | null;
}

export interface NovoRegistroHumor {
  cdUsuario: number;
  dtRegistro: string;
  nrHumor: NrHumor;
  dsRelato: string | null;
}
