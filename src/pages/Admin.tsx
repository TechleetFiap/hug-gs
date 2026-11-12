import { useState } from "react";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { EstadoCarregando, EstadoErro, EstadoVazio } from "../components/ui/Estados";
import Feedback from "../components/ui/Feedback";
import { useApi } from "../hooks/useApi";
import { usePageTitle } from "../hooks/usePageTitle";
import { mensagemDeErro } from "../services/apiClient";
import { aprovarPsicologo, listarPsicologos, listarUsuarios } from "../services/hugService";
import type { PerfilPsicologo } from "../types/hug";

// Busca psicólogos e usuários juntos: o nome do psicólogo está no cadastro do usuário.
async function carregar() {
  const [psicologos, usuarios] = await Promise.all([listarPsicologos(), listarUsuarios()]);
  const nomes = new Map(usuarios.map((u) => [u.id, u.nmUsuario]));
  return psicologos
    .filter((p) => p.dsStatus === "PENDENTE")
    .map((p) => ({ psicologo: p, nome: nomes.get(p.cdUsuario) ?? `Usuário #${p.cdUsuario}` }));
}

export default function Admin() {
  usePageTitle("Aprovar psicólogos");
  const { estado, recarregar } = useApi(carregar, []);
  const [aprovando, setAprovando] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  async function aprovar(psicologo: PerfilPsicologo, nome: string) {
    setFeedback(null);
    setAprovando(psicologo.id);
    try {
      await aprovarPsicologo(psicologo); // 201: segue para recarregar a lista
      setFeedback({ tipo: "sucesso", texto: `${nome} foi aprovado(a).` });
      recarregar();
    } catch (err) {
      // 400: mostra a mensagem que a API devolveu.
      setFeedback({ tipo: "erro", texto: mensagemDeErro(err) });
    } finally {
      setAprovando(null);
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <h2 className="mb-8 text-center text-3xl">Aprovar psicólogos</h2>

        {feedback && <div className="mb-6 text-center"><Feedback tipo={feedback.tipo} texto={feedback.texto} /></div>}

        {estado.status === "loading" && <EstadoCarregando />}
        {estado.status === "error" && <EstadoErro mensagem={estado.message} onTentar={recarregar} />}
        {estado.status === "success" && estado.data.length === 0 && (
          <EstadoVazio texto="Nenhum psicólogo aguardando aprovação." onTentar={recarregar} />
        )}
        {estado.status === "success" && estado.data.length > 0 && (
          <ul className="flex flex-col gap-3">
            {estado.data.map(({ psicologo, nome }) => (
              <li key={psicologo.id}>
                <Card className="flex flex-col items-start justify-between gap-4 text-left text-secondary sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">{nome}</p>
                    <p className="text-xs text-slate-500">CRP {psicologo.dsCrp}</p>
                    {psicologo.dsBiografia && <p className="mt-2 text-sm">{psicologo.dsBiografia}</p>}
                  </div>
                  <Button
                    onClick={() => aprovar(psicologo, nome)}
                    disabled={aprovando !== null}
                  >
                    {aprovando === psicologo.id ? "Aprovando..." : "Aprovar"}
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}
