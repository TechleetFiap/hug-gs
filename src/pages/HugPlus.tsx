import { useNavigate } from "react-router-dom";
import ConteudoCard from "../components/conteudos/ConteudoCard";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { EstadoCarregando, EstadoErro, EstadoVazio } from "../components/ui/Estados";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { listarAssinaturasUsuario, listarConteudosUsuario, listarPlanos } from "../services/hugService";
import type { Conteudo } from "../types/hug";
import { formatarData, formatarReal, temHugPlusAgora } from "../utils/datas";

export default function HugPlus() {
  usePageTitle("Hug+");
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const cdUsuario = usuario?.id ?? null;

  // Chamadas uma depois da outra. Os conteúdos só são pedidos a quem tem Hug+ ativo.
  const { estado, recarregar } = useApi(async () => {
    const planos = await listarPlanos();
    const assinaturas = cdUsuario ? await listarAssinaturasUsuario(cdUsuario) : [];
    const temHugPlus = temHugPlusAgora(assinaturas, planos);
    let exclusivos: Conteudo[] = [];
    if (cdUsuario && temHugPlus) {
      const conteudos = await listarConteudosUsuario(cdUsuario);
      exclusivos = conteudos.filter((c) => c.flExclusivo === "S");
    }
    return { planos, assinaturas, temHugPlus, exclusivos };
  }, [cdUsuario]);

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 py-12 font-sans">
        <h2 className="mb-3 text-center text-3xl">Hug+</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-text-footer sm:text-base">
          Conteúdos exclusivos dos psicólogos, com assinatura de valor acessível. O acesso básico continua gratuito.
        </p>

        {estado.status === "loading" && <EstadoCarregando />}
        {estado.status === "error" && <EstadoErro mensagem={estado.message} onTentar={recarregar} />}

        {estado.status === "success" && (() => {
          const { planos, assinaturas, temHugPlus, exclusivos } = estado.data;
          const ultima = assinaturas.length > 0 ? assinaturas[assinaturas.length - 1] : null;

          return (
            <>

              {!temHugPlus && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-text-footer">
                    Os conteúdos exclusivos são liberados para quem tem uma assinatura Hug+ ativa.
                  </p>
                  {usuario && ultima && (
                    <p className="text-sm text-text-footer">
                      Última assinatura: de {formatarData(ultima.dtInicio)} até {formatarData(ultima.dtFim)}.
                    </p>
                  )}
                  <Button onClick={() => navigate("/meu-plano")}>Assinar</Button>
                </div>
              )}

              {temHugPlus && (
                <>
                  <p className="mb-8 text-center text-green-400">Você tem o Hug+ ativo.</p>
                  <h3 className="mb-6 text-center text-xl">Conteúdos exclusivos</h3>
                  {exclusivos.length === 0 ? (
                    <EstadoVazio texto="Ainda não há conteúdos exclusivos publicados." onTentar={recarregar} />
                  ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {exclusivos.map((conteudo) => (
                        <li key={conteudo.id} className="flex">
                          <ConteudoCard conteudo={conteudo} />
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          );
        })()}
      </section>
    </Layout>
  );
}
