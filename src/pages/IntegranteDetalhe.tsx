import { Link, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import { integrantes } from "../data/integrantes";
import { usePageTitle } from "../hooks/usePageTitle";

export default function IntegranteDetalhe() {
  const { id } = useParams<{ id: string }>();
  const integrante = integrantes.find((i) => i.id === id);
  usePageTitle(integrante ? integrante.nome : "Integrante");

  return (
    <Layout>
      <section className="mx-auto max-w-md px-4 py-12">
        {integrante ? (
          <Card className="flex flex-col items-center gap-3 text-secondary">
            <img
              src={integrante.foto}
              alt={`Foto de ${integrante.nome}`}
              className="h-32 w-32 rounded-full object-cover"
            />
            <h2 className="text-center font-sans text-2xl font-semibold">{integrante.nome}</h2>
            <p className="font-sans text-sm text-slate-500">RM {integrante.rm} · {integrante.turma}</p>
            <p className="text-center font-sans text-sm">{integrante.bio}</p>
            <div className="mt-2 flex gap-4 font-sans text-sm">
              <a href={integrante.github} target="_blank" rel="noopener noreferrer" className="underline">
                GitHub
              </a>
              <a href={integrante.linkedin} target="_blank" rel="noopener noreferrer" className="underline">
                LinkedIn
              </a>
            </div>
          </Card>
        ) : (
          <p className="text-center font-sans text-text-footer">Integrante não encontrado.</p>
        )}
        <Link to="/integrantes" className="mt-8 block text-center font-sans text-sm text-acento">
          Voltar para integrantes
        </Link>
      </section>
    </Layout>
  );
}
