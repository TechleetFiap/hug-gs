import { useState } from "react";
import Layout from "../components/layout/Layout";
import FormularioHumor from "../components/diario/FormularioHumor";
import GraficoHumor from "../components/diario/GraficoHumor";
import { EstadoCarregando, EstadoErro } from "../components/ui/Estados";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { buscarOfensiva, listarRegistrosUsuario } from "../services/hugService";
import { dataLocalISO, formatarData, HUMOR } from "../utils/datas";

export default function Diario() {
  usePageTitle("Diário");
  const { usuario } = useAuth();
  const cdUsuario = usuario?.id ?? 0;
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const { estado, recarregar } = useApi(
    async () => {
      const registros = await listarRegistrosUsuario(cdUsuario);
      const ofensiva = await buscarOfensiva(cdUsuario);
      return { registros, ofensiva };
    },
    [cdUsuario]
  );

  const hoje = dataLocalISO();

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <h2 className="mb-3 text-center text-3xl">Diário de humor</h2>
        <p className="mb-8 text-center text-sm text-text-footer">
          Registre como você está. Seus registros ajudam a observar seus próprios padrões. Não geram diagnóstico.
        </p>

        {estado.status === "loading" && <EstadoCarregando />}
        {estado.status === "error" && <EstadoErro mensagem={estado.message} onTentar={recarregar} />}

        {estado.status === "success" && (() => {
          const { registros, ofensiva } = estado.data;
          const registroHoje = registros.find((r) => r.dtRegistro === hoje) ?? null;
          const historico = [...registros].sort((a, b) => b.dtRegistro.localeCompare(a.dtRegistro));

          return (
            <div className="flex flex-col gap-10">
              <p className="text-center text-lg">
                {ofensiva > 0
                  ? `${ofensiva} ${ofensiva === 1 ? "dia seguido" : "dias seguidos"} registrando.`
                  : "Comece sua sequência registrando seu humor hoje."}
              </p>

              <div className="rounded-2xl border border-primary p-6">
                <h3 className="mb-6 text-xl">{registroHoje ? "Seu registro de hoje" : "Como você está hoje?"}</h3>
                <FormularioHumor
                  key={registroHoje ? "editar" : "novo"}
                  cdUsuario={cdUsuario}
                  registroHoje={registroHoje}
                  onSalvo={recarregar}
                />
              </div>

              <div>
                <h3 className="mb-4 text-xl">Últimos 14 dias</h3>
                <GraficoHumor registros={registros} />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setMostrarHistorico((v) => !v)}
                  aria-expanded={mostrarHistorico}
                  className="mb-4 text-sm text-acento underline"
                >
                  {mostrarHistorico ? "Ocultar histórico" : "Ver histórico completo"}
                </button>
                {mostrarHistorico && (
                  historico.length === 0 ? (
                    <p className="text-text-footer">Nenhum registro ainda.</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {historico.map((r) => (
                        <li key={r.id} className="flex gap-4 rounded-xl border border-primary p-4">
                          <span className="text-3xl" aria-hidden="true">{HUMOR[r.nrHumor].emoji}</span>
                          <div className="min-w-0">
                            <p className="text-sm">
                              {formatarData(r.dtRegistro)} · {HUMOR[r.nrHumor].rotulo}
                            </p>
                            {r.dsRelato && <p className="mt-1 break-words text-sm text-text-footer">{r.dsRelato}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </div>
          );
        })()}
      </section>
    </Layout>
  );
}
