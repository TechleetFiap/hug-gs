import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import CadastroPsicologo from "../components/psicologo/CadastroPsicologo";
import MinhasClinicas from "../components/psicologo/MinhasClinicas";
import PublicarConteudo from "../components/psicologo/PublicarConteudo";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { EstadoCarregando, EstadoErro } from "../components/ui/Estados";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { mensagemDeErro } from "../services/apiClient";
import Feedback from "../components/ui/Feedback";
import { excluirConteudo, listarConteudos } from "../services/hugService";
import type { Conteudo } from "../types/hug";
import { formatarData } from "../utils/datas";

export default function Psicologo() {
  usePageTitle("Área do psicólogo");
  const { usuario, psicologo, recarregarPsicologo } = useAuth();
  const [minhas, setMinhas] = useState<Conteudo[] | null>(null);
  const [erroLista, setErroLista] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const cdPsicologo = psicologo?.id ?? null;

  function carregarMinhas() {
    if (cdPsicologo === null) return;
    setErroLista("");
    listarConteudos()
      .then((todos) => setMinhas(todos.filter((c) => c.cdPsicologo === cdPsicologo)))
      .catch((err) => setErroLista(mensagemDeErro(err)));
  }

  async function excluir(c: Conteudo) {
    if (!window.confirm(`Excluir o conteúdo "${c.nmTitulo}"? Esta ação não pode ser desfeita.`)) return;
    setFeedback(null);
    setExcluindoId(c.id);
    try {
      await excluirConteudo(c.id);
      setFeedback({ tipo: "sucesso", texto: "Conteúdo excluído." });
      carregarMinhas();
    } catch (err) {
      setFeedback({ tipo: "erro", texto: mensagemDeErro(err) });
    } finally {
      setExcluindoId(null);
    }
  }

  useEffect(() => {
    if (psicologo?.dsStatus === "APROVADO") carregarMinhas();
    // Recarrega quando o status muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cdPsicologo, psicologo?.dsStatus]);

  if (!usuario) return null;

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <h2 className="mb-8 text-center text-3xl">Área do psicólogo</h2>

        {!psicologo && (
          <CadastroPsicologo cdUsuario={usuario.id} onCriado={recarregarPsicologo} />
        )}

        {psicologo?.dsStatus === "PENDENTE" && (
          <p className="text-center text-text-footer">Seu cadastro está em análise pela equipe. Você será avisado quando a área for liberada.</p>
        )}

        {psicologo?.dsStatus === "INATIVO" && (
          <p className="text-center text-text-footer">Seu acesso à área do psicólogo está indisponível. Fale com a equipe pelo contato.</p>
        )}

        {psicologo?.dsStatus === "APROVADO" && (
          <div className="flex flex-col gap-12">
            <div>
              <h3 className="mb-6 text-xl">Minhas clínicas</h3>
              <MinhasClinicas cdPsicologo={psicologo.id} />
            </div>

            <div>
              <h3 className="mb-6 text-xl">Publicar conteúdo</h3>
              <PublicarConteudo cdPsicologo={psicologo.id} onPublicado={carregarMinhas} />
            </div>

            <div>
              <h3 className="mb-6 text-xl">Minhas publicações</h3>
              {feedback && <div className="mb-4"><Feedback tipo={feedback.tipo} texto={feedback.texto} /></div>}
              {erroLista && <EstadoErro mensagem={erroLista} onTentar={carregarMinhas} />}
              {!erroLista && minhas === null && <EstadoCarregando />}
              {minhas && minhas.length === 0 && <p className="text-text-footer">Você ainda não publicou nenhum conteúdo.</p>}
              {minhas && minhas.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {minhas.map((c) => (
                    <li key={c.id}>
                      {editandoId === c.id ? (
                        <div className="rounded-2xl border border-primary p-6">
                          <PublicarConteudo
                            cdPsicologo={psicologo.id}
                            conteudo={c}
                            onPublicado={carregarMinhas}
                            onCancelar={() => setEditandoId(null)}
                          />
                        </div>
                      ) : (
                        <Card className="flex flex-col items-start justify-between gap-4 text-left text-secondary sm:flex-row sm:items-center">
                          <div>
                            <p className="font-semibold">{c.nmTitulo}</p>
                            <p className="text-xs text-slate-500">
                              {c.dsTema} · {c.dsTipo === "VIDEO" ? "Vídeo" : "Texto"} · {formatarData(c.dtPublicacao)}
                              {c.flExclusivo === "S" ? " · Hug+" : ""}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variante="secundaria" className="!border-secondary !text-secondary hover:!bg-secondary/10"
                              onClick={() => { setFeedback(null); setEditandoId(c.id); }} disabled={excluindoId !== null}>
                              Editar
                            </Button>
                            <Button variante="perigo" onClick={() => excluir(c)} disabled={excluindoId !== null}>
                              {excluindoId === c.id ? "Excluindo..." : "Excluir"}
                            </Button>
                          </div>
                        </Card>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
