import { Link, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { EstadoCarregando, EstadoErro } from "../components/ui/Estados";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { buscarConteudo, carregarAcessoHugPlus } from "../services/hugService";
import { formatarData } from "../utils/datas";

export default function ConteudoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const cdUsuario = usuario?.id ?? 0;
  const numeroId = Number(id);

  const { estado, recarregar } = useApi(
    async () => {
      const conteudo = await buscarConteudo(numeroId);
      const acesso = await carregarAcessoHugPlus(cdUsuario);
      return { conteudo, temHugPlus: acesso.temHugPlus };
    },
    [numeroId, cdUsuario]
  );

  usePageTitle(estado.status === "success" ? estado.data.conteudo.nmTitulo : "Conteúdo");

  return (
    <Layout>
      <article className="mx-auto max-w-2xl px-4 py-12 font-sans">
        {estado.status === "loading" && <EstadoCarregando />}
        {estado.status === "error" && <EstadoErro mensagem={estado.message} onTentar={recarregar} />}

        {estado.status === "success" && (() => {
          const { conteudo, temHugPlus } = estado.data;

          if (conteudo.flExclusivo === "S" && !temHugPlus) {
            return (
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-2xl">Conteúdo exclusivo do Hug+</h2>
                <p className="text-text-footer">Assine o Hug+ para ler este conteúdo.</p>
                <Link to="/hug-plus" className="rounded-full bg-acento px-6 py-3 text-sm font-semibold text-secondary">
                  Ver planos
                </Link>
              </div>
            );
          }

          return (
            <>
              <p className="mb-2 text-sm text-acento">{conteudo.dsTema}</p>
              <h2 className="mb-2 text-3xl">{conteudo.nmTitulo}</h2>
              <p className="mb-8 text-xs text-text-footer">Publicado em {formatarData(conteudo.dtPublicacao)}</p>

              {conteudo.dsTipo === "TEXTO" && conteudo.dsTexto && (
                <div className="flex flex-col gap-4 leading-relaxed text-text-light">
                  {conteudo.dsTexto.split(/\n+/).map((paragrafo, i) => (
                    <p key={i}>{paragrafo}</p>
                  ))}
                </div>
              )}

              {conteudo.dsTipo === "VIDEO" && conteudo.dsUrlVideo && (
                <a href={conteudo.dsUrlVideo} target="_blank" rel="noreferrer" className="text-acento underline">
                  Assistir ao vídeo
                </a>
              )}
            </>
          );
        })()}

        <Link to="/conteudos" className="mt-12 block text-center text-sm text-acento">
          Voltar para conteúdos
        </Link>
      </article>
    </Layout>
  );
}
