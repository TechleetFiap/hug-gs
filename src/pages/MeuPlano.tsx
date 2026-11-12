import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { EstadoCarregando, EstadoErro } from "../components/ui/Estados";
import Feedback from "../components/ui/Feedback";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { mensagemDeErro } from "../services/apiClient";
import { criarAssinatura, excluirAssinatura, listarAssinaturasUsuario, listarPlanos } from "../services/hugService";
import { dataLocalISO, formatarData, formatarReal, somarDias } from "../utils/datas";

// Duração padrão da assinatura (a mesma da página Hug+).
const DIAS_ASSINATURA = 30;

function diasRestantes(dtFim: string, hoje: string): number {
  const [a1, m1, d1] = hoje.split("-").map(Number);
  const [a2, m2, d2] = dtFim.split("-").map(Number);
  const ms = new Date(a2, m2 - 1, d2).getTime() - new Date(a1, m1 - 1, d1).getTime();
  return Math.round(ms / 86_400_000);
}

export default function MeuPlano() {
  usePageTitle("Meu plano");
  const { usuario } = useAuth();
  const cdUsuario = usuario?.id ?? null;
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [processando, setProcessando] = useState<number | null>(null);

  const { estado, recarregar } = useApi(async () => {
    if (cdUsuario === null) return { planos: [], assinaturas: [] };
    const planos = await listarPlanos();
    const assinaturas = await listarAssinaturasUsuario(cdUsuario);
    return { planos, assinaturas };
  }, [cdUsuario]);

  if (!usuario) return null;
  const usuarioAtual = usuario;
  const hoje = dataLocalISO();

  async function adquirir(cdPlano: number, inicio: string) {
    setProcessando(cdPlano);
    setFeedback(null);
    try {
      await criarAssinatura(usuarioAtual.id, cdPlano, inicio, somarDias(inicio, DIAS_ASSINATURA));
      setFeedback({ tipo: "sucesso", texto: "Plano adquirido com sucesso." });
      recarregar();
    } catch (err) {
      setFeedback({ tipo: "erro", texto: mensagemDeErro(err) });
    } finally {
      setProcessando(null);
    }
  }

  async function cancelar(id: number) {
    if (!window.confirm("Cancelar seu plano? O acesso aos conteúdos exclusivos termina agora.")) return;
    setProcessando(-1);
    setFeedback(null);
    try {
      await excluirAssinatura(id);
      setFeedback({ tipo: "sucesso", texto: "Plano cancelado." });
      recarregar();
    } catch (err) {
      setFeedback({ tipo: "erro", texto: mensagemDeErro(err) });
    } finally {
      setProcessando(null);
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <h2 className="mb-8 text-center text-3xl">Meu plano</h2>

        {estado.status === "loading" && <EstadoCarregando />}
        {estado.status === "error" && <EstadoErro mensagem={estado.message} onTentar={recarregar} />}

        {estado.status === "success" && (() => {
          const { planos, assinaturas } = estado.data;
          const planoPorId = new Map(planos.map((p) => [p.id, p]));
          // Plano ativo = período que inclui hoje.
          const ativa = assinaturas.find((a) => a.dtInicio <= hoje && hoje <= a.dtFim) ?? null;
          const planoAtivo = ativa ? planoPorId.get(ativa.cdPlano) : undefined;
          // Renovação começa no dia seguinte ao fim do plano atual (a API recusa períodos que se cruzam).
          const ultimoFim = assinaturas.reduce((max, a) => (a.dtFim > max ? a.dtFim : max), "");
          const inicioNovo = ultimoFim >= hoje ? somarDias(ultimoFim, 1) : hoje;
          const planosParaAdquirir = planos.filter((p) => p.flExclusivo === "S");

          return (
            <div className="flex flex-col gap-12">
              <div>
                <h3 className="mb-4 text-xl">Plano atual</h3>
                {ativa ? (
                  <Card className="flex flex-col items-start gap-2 text-left text-secondary">
                    <p className="text-lg font-semibold">{planoAtivo?.nmPlano ?? `Plano #${ativa.cdPlano}`}</p>
                    <p className="text-sm text-green-600">Ativo</p>
                    <p className="text-sm">Valor contratado: {formatarReal(ativa.vlMensalContratado)} / mês</p>
                    <p className="text-sm">
                      Período: {formatarData(ativa.dtInicio)} até {formatarData(ativa.dtFim)}
                      {" "}({diasRestantes(ativa.dtFim, hoje)} dia(s) restante(s))
                    </p>
                    <p className="text-sm text-slate-500">
                      {planoAtivo?.flExclusivo === "S" ? "Inclui conteúdos exclusivos do Hug+." : "Sem conteúdo exclusivo."}
                    </p>
                    <Button variante="perigo" className="mt-2" onClick={() => cancelar(ativa.id)} disabled={processando !== null}>
                      {processando === -1 ? "Cancelando..." : "Cancelar plano"}
                    </Button>
                  </Card>
                ) : (
                  <p className="text-text-footer">Você não tem nenhum plano ativo no momento.</p>
                )}
              </div>

              <div>
                <h3 className="mb-4 text-xl">{ativa ? "Renovar plano" : "Adquirir plano"}</h3>
                {ativa && (
                  <p className="mb-4 text-sm text-text-footer">
                    O novo período começa em {formatarData(inicioNovo)}, logo após o fim do plano atual.
                  </p>
                )}
                {planosParaAdquirir.length === 0 && <p className="text-text-footer">Nenhum plano disponível no momento.</p>}
                <ul className="grid gap-4 sm:grid-cols-2">
                  {planosParaAdquirir.map((plano) => (
                    <li key={plano.id} className="flex">
                      <Card className="flex w-full flex-col items-center gap-2 text-secondary">
                        <p className="font-semibold">{plano.nmPlano}</p>
                        <p className="text-2xl font-bold">
                          {formatarReal(plano.vlMensal)}
                          <span className="text-sm font-normal text-slate-500"> / mês</span>
                        </p>
                        <p className="text-sm text-slate-500">Inclui conteúdos exclusivos · {DIAS_ASSINATURA} dias</p>
                        <Button onClick={() => adquirir(plano.id, inicioNovo)} disabled={processando !== null} className="mt-2">
                          {processando === plano.id ? "Processando..." : ativa ? "Renovar plano" : "Adquirir plano"}
                        </Button>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>

              {assinaturas.length > 0 && (
                <div>
                  <h3 className="mb-4 text-xl">Histórico</h3>
                  <ul className="flex flex-col gap-2 text-sm text-text-footer">
                    {[...assinaturas].sort((a, b) => b.dtInicio.localeCompare(a.dtInicio)).map((a) => (
                      <li key={a.id}>
                        {planoPorId.get(a.cdPlano)?.nmPlano ?? `Plano #${a.cdPlano}`} · {formatarData(a.dtInicio)} a {formatarData(a.dtFim)} · {formatarReal(a.vlMensalContratado)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback && <Feedback tipo={feedback.tipo} texto={feedback.texto} />}
              <p className="text-center text-sm"><Link to="/perfil" className="underline">Voltar ao meu perfil</Link></p>
            </div>
          );
        })()}
      </section>
    </Layout>
  );
}
