// Chamadas à API Hug. Cada função corresponde a uma rota do GUIA-FRONT-HUG.
import { ApiError, requisitar } from "./apiClient";
import type {
  Assinatura,
  AtualizacaoUsuario,
  Clinica,
  Conteudo,
  NovaClinica,
  NovoConteudo,
  NovoPsicologo,
  NovoRegistroHumor,
  NovoUsuario,
  PerfilPsicologo,
  Plano,
  PsicologoClinica,
  RegistroHumor,
  Usuario,
} from "../types/hug";
import { temHugPlusAgora } from "../utils/datas";

// ---------- Usuário ----------

export function entrar(dsEmail: string, dsSenhaHash: string): Promise<Usuario> {
  return requisitar<Usuario>("/usuario/login", {
    method: "POST",
    body: JSON.stringify({ dsEmail, dsSenhaHash }),
  });
}

export function buscarUsuario(id: number): Promise<Usuario> {
  return requisitar<Usuario>(`/usuario/${id}`);
}

export function cadastrarUsuario(dados: NovoUsuario): Promise<Usuario> {
  return requisitar<Usuario>("/usuario", { method: "POST", body: JSON.stringify(dados) });
}

export function atualizarUsuario(id: number, dados: AtualizacaoUsuario): Promise<unknown> {
  return requisitar<unknown>(`/usuario/${id}`, { method: "PUT", body: JSON.stringify(dados) });
}

export function excluirUsuario(id: number): Promise<void> {
  return requisitar<void>(`/usuario/${id}`, { method: "DELETE" });
}

// Lista completa (todos os usuários). Usada só na tela de administração, para mostrar nomes.
export function listarUsuarios(): Promise<Usuario[]> {
  return requisitar<Usuario[]>("/usuario");
}

// ---------- Psicólogo ----------

// 404 significa que o usuário é paciente (não tem perfil de psicólogo).
export async function buscarPerfilPsicologo(cdUsuario: number): Promise<PerfilPsicologo | null> {
  try {
    return await requisitar<PerfilPsicologo>(`/psicologo/usuario/${cdUsuario}`);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}

export function cadastrarPsicologo(dados: NovoPsicologo): Promise<PerfilPsicologo> {
  return requisitar<PerfilPsicologo>("/psicologo", { method: "POST", body: JSON.stringify(dados) });
}

// O PUT exige o dsStatus atual: o psicólogo não altera o próprio status.
export function atualizarPsicologo(perfil: PerfilPsicologo): Promise<unknown> {
  return requisitar<unknown>(`/psicologo/${perfil.id}`, {
    method: "PUT",
    body: JSON.stringify({
      cdUsuario: perfil.cdUsuario,
      dsCrp: perfil.dsCrp,
      dsBiografia: perfil.dsBiografia,
      dsStatus: perfil.dsStatus,
    }),
  });
}

// Lista completa de psicólogos (tela de administração).
export function listarPsicologos(): Promise<PerfilPsicologo[]> {
  return requisitar<PerfilPsicologo[]>("/psicologo");
}

// Aprovação pela equipe: manda o objeto inteiro que veio da lista, só com o status trocado.
export function aprovarPsicologo(psicologo: PerfilPsicologo): Promise<unknown> {
  return requisitar<unknown>(`/psicologo/${psicologo.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...psicologo, dsStatus: "APROVADO" }),
  });
}

// Precisa ser chamado antes de excluir o usuário: o banco não deixa apagar a conta com perfil ligado.
export function excluirPsicologo(id: number): Promise<void> {
  return requisitar<void>(`/psicologo/${id}`, { method: "DELETE" });
}

// ---------- Conteúdos ----------

// Para o usuário logado: a API já esconde os conteúdos exclusivos de quem não tem Hug+.
export function listarConteudosUsuario(cdUsuario: number): Promise<Conteudo[]> {
  return requisitar<Conteudo[]>(`/conteudo/usuario/${cdUsuario}`);
}

// Lista completa, usada só em "minhas publicações" (filtrada pelo cdPsicologo).
export function listarConteudos(): Promise<Conteudo[]> {
  return requisitar<Conteudo[]>("/conteudo");
}

export function buscarConteudo(id: number): Promise<Conteudo> {
  return requisitar<Conteudo>(`/conteudo/${id}`);
}

export function criarConteudo(dados: NovoConteudo): Promise<Conteudo> {
  return requisitar<Conteudo>("/conteudo", { method: "POST", body: JSON.stringify(dados) });
}

// PUT substitui o registro inteiro: manda todos os campos (inclusive a data de publicação original).
export function atualizarConteudo(id: number, dados: NovoConteudo): Promise<unknown> {
  return requisitar<unknown>(`/conteudo/${id}`, { method: "PUT", body: JSON.stringify(dados) });
}

export function excluirConteudo(id: number): Promise<void> {
  return requisitar<void>(`/conteudo/${id}`, { method: "DELETE" });
}

// ---------- Clínicas ----------

export function listarClinicas(): Promise<Clinica[]> {
  return requisitar<Clinica[]>("/clinica");
}

export function buscarClinica(id: number): Promise<Clinica> {
  return requisitar<Clinica>(`/clinica/${id}`);
}

// A API devolve "id": null no POST de clínica; para saber o id, busque a lista de novo.
export function criarClinica(dados: NovaClinica): Promise<unknown> {
  return requisitar<unknown>("/clinica", { method: "POST", body: JSON.stringify(dados) });
}

// ---------- Psicólogo x Clínica (N:N) ----------

export function listarVinculos(): Promise<PsicologoClinica[]> {
  return requisitar<PsicologoClinica[]>("/psicologoClinica");
}

export function vincularClinica(cdPsicologo: number, cdClinica: number): Promise<unknown> {
  return requisitar<unknown>("/psicologoClinica", {
    method: "POST",
    body: JSON.stringify({ cdPsicologo, cdClinica }),
  });
}

export function desvincularClinica(cdPsicologo: number, cdClinica: number): Promise<void> {
  return requisitar<void>(`/psicologoClinica/${cdPsicologo}/${cdClinica}`, { method: "DELETE" });
}

// ---------- Hug+ ----------

export function listarPlanos(): Promise<Plano[]> {
  return requisitar<Plano[]>("/plano");
}

export function listarAssinaturasUsuario(cdUsuario: number): Promise<Assinatura[]> {
  return requisitar<Assinatura[]>(`/assinatura/usuario/${cdUsuario}`);
}

// Não envia o valor: a API copia o preço do plano.
export function criarAssinatura(
  cdUsuario: number,
  cdPlano: number,
  dtInicio: string,
  dtFim: string
): Promise<Assinatura> {
  return requisitar<Assinatura>("/assinatura", {
    method: "POST",
    body: JSON.stringify({ cdUsuario, cdPlano, dtInicio, dtFim }),
  });
}

// Cancela a assinatura: o acesso aos conteúdos exclusivos some na hora.
export function excluirAssinatura(id: number): Promise<void> {
  return requisitar<void>(`/assinatura/${id}`, { method: "DELETE" });
}

// Dados que a tela de conteúdo precisa para decidir se o Hug+ está ativo.
export async function carregarAcessoHugPlus(cdUsuario: number) {
  // Uma chamada depois da outra (a API não deve receber requisições simultâneas).
  const assinaturas = await listarAssinaturasUsuario(cdUsuario);
  const planos = await listarPlanos();
  return { assinaturas, planos, temHugPlus: temHugPlusAgora(assinaturas, planos) };
}

// ---------- Registro de humor ----------

export function listarRegistrosUsuario(cdUsuario: number): Promise<RegistroHumor[]> {
  return requisitar<RegistroHumor[]>(`/registroHumor/usuario/${cdUsuario}`);
}

// A API devolve um número puro (dias seguidos).
export function buscarOfensiva(cdUsuario: number): Promise<number> {
  return requisitar<number>(`/registroHumor/ofensiva/${cdUsuario}`);
}

export function criarRegistro(dados: NovoRegistroHumor): Promise<RegistroHumor> {
  return requisitar<RegistroHumor>("/registroHumor", { method: "POST", body: JSON.stringify(dados) });
}

export function atualizarRegistro(id: number, dados: NovoRegistroHumor): Promise<unknown> {
  return requisitar<unknown>(`/registroHumor/${id}`, { method: "PUT", body: JSON.stringify(dados) });
}
