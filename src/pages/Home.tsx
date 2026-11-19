import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";

interface Acao {
  titulo: string;
  texto: string;
  acao: string;
  to: string;
}

const acoes: Acao[] = [
  { titulo: "Aprender", texto: "Conteúdos de psicólogos sobre sentimentos, autocuidado, respiração e meditação.", acao: "Ver conteúdos", to: "/conteudos" },
  { titulo: "Registrar", texto: "Anote seu humor do dia e veja seus próprios padrões ao longo do tempo.", acao: "Abrir diário", to: "/diario" },
  { titulo: "Encontrar apoio", texto: "Procure clínicas por cidade e bairro e entre em contato direto.", acao: "Buscar clínicas", to: "/clinicas" },
];

export default function Home() {
  usePageTitle("Início");
  const { usuario } = useAuth();

  return (
    <Layout>
      <section className="bg-gradient-to-b from-secondary-dark to-secondary px-4 py-16 text-center sm:py-24">
        <h2 className="mx-auto max-w-3xl font-sans text-3xl font-bold leading-tight sm:text-5xl">
          Cuidar da saúde emocional começa com informação.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-base text-text-footer sm:text-lg">
          Aprenda com psicólogos, acompanhe seu humor e encontre apoio profissional perto de você.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {usuario ? (
            <Link to="/diario" className="rounded-full bg-acento px-6 py-3 font-sans text-sm font-semibold text-secondary transition-opacity hover:opacity-90">
              Registrar meu humor de hoje
            </Link>
          ) : (
            <Link to="/cadastro" className="rounded-full bg-acento px-6 py-3 font-sans text-sm font-semibold text-secondary transition-opacity hover:opacity-90">
              Criar conta gratuita
            </Link>
          )}
          <a href="tel:188" className="rounded-full border border-acento px-6 py-3 font-sans text-sm font-medium transition-colors hover:bg-acento/10">
            Preciso de ajuda agora: 188
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:grid-cols-3">
        {acoes.map((acao) => (
          <Link key={acao.to} to={acao.to} className="flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acento rounded-2xl">
            <Card className="flex w-full flex-col items-start gap-3 text-left text-secondary transition-transform hover:-translate-y-1">
              <h3 className="font-sans text-xl font-semibold">{acao.titulo}</h3>
              <p className="font-sans text-sm text-slate-500">{acao.texto}</p>
              <span className="mt-auto pt-2 font-sans text-sm font-semibold text-teal-700">{acao.acao} →</span>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 text-center font-sans text-sm text-text-footer">
        <p>
          O Hug não faz diagnósticos e não substitui o acompanhamento profissional. Em caso de emergência, procure o serviço de saúde mais próximo.
        </p>
      </section>
    </Layout>
  );
}
