import Layout from "../components/layout/Layout";
import { usePageTitle } from "../hooks/usePageTitle";

const acoes = [
  {
    titulo: "Aprender",
    texto: "Textos e vídeos curtos de psicólogos sobre sentimentos, autocuidado, respiração e meditação. Parte do conteúdo é gratuita e parte é exclusiva do Hug+.",
  },
  {
    titulo: "Registrar",
    texto: "No diário, você escolhe um emoji para o humor do dia e, se quiser, escreve como se sente. O histórico e um gráfico simples mostram seus padrões ao longo do tempo, sem gerar diagnósticos.",
  },
  {
    titulo: "Encontrar apoio",
    texto: "Busque clínicas por cidade ou bairro, veja endereço, telefone e site e entre em contato direto. Psicólogos com CRP verificado também publicam seus conteúdos e apresentam seu trabalho.",
  },
];

const diferenciais = [
  "Conteúdo feito por psicólogos com CRP verificado.",
  "Diário de humor, conteúdos e catálogo de clínicas no mesmo site.",
  "Acesso básico gratuito, com o atalho do CVV sempre visível.",
  "Hug+ com assinatura acessível, a partir de R$ 9,90 por mês.",
];

const ods = [
  {
    numero: 3,
    nome: "Saúde e bem-estar",
    meta: "Meta 3.4: promover a saúde mental e o bem-estar.",
  },
  {
    numero: 10,
    nome: "Redução das desigualdades",
    meta: "Meta 10.2: promover a inclusão social, com acesso gratuito ao conteúdo básico e assinatura de preço acessível.",
  },
];

export default function Sobre() {
  usePageTitle("Sobre");

  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 py-12 font-sans">
        <header className="mb-12 text-center">
          <h2 className="mb-3 text-3xl">Sobre o Hug</h2>
          <p className="text-lg text-acento">Aprender, registrar e encontrar apoio em saúde mental</p>
        </header>

        <div className="flex flex-col gap-4 text-base leading-relaxed text-text-light">
          <p>
            O Hug é um site de saúde mental, responsivo para celular e computador, que reúne em um só lugar conteúdos de psicólogos, o acompanhamento pessoal do humor e a descoberta de clínicas. Ele apoia o autocuidado e a busca por atendimento, sem gerar diagnósticos e sem substituir o acompanhamento profissional.
          </p>
        </div>

        <section className="mt-12">
          <h3 className="mb-4 text-xl">O problema</h3>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-text-light">
            <p>
              Ansiedade e depressão estão entre os problemas de saúde mais frequentes no Brasil. Segundo o Panorama da Saúde Mental (Instituto Cactus e AtlasIntel, 2024), 68% dos brasileiros relataram sentir-se nervosos ou ansiosos nas semanas anteriores à pesquisa, e 55,8% nunca consultaram um profissional sobre o tema.
            </p>
            <p>
              Custo, falta de informação e estigma afastam as pessoas do cuidado. Uma consulta particular de psicologia em São Paulo custa de R$ 150 a R$ 350 (Doctoralia, 2026), e quem precisa nem sempre sabe por onde começar.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="mb-4 text-xl">Como o Hug ajuda</h3>
          <ul className="grid gap-4 md:grid-cols-3">
            {acoes.map((acao) => (
              <li key={acao.titulo} className="rounded-2xl bg-white p-6 text-left text-secondary">
                <h4 className="mb-2 text-lg font-semibold">{acao.titulo}</h4>
                <p className="text-sm leading-relaxed text-slate-600">{acao.texto}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl border border-acento/40 p-4 text-sm">
            <span className="font-semibold text-acento">Ajuda imediata:</span> o atalho para o CVV (ligação gratuita para o 188) fica visível em todas as telas.
          </p>
        </section>

        <section className="mt-12">
          <h3 className="mb-4 text-xl">Para quem é</h3>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-text-light">
            <p>
              <span className="font-semibold">Usuários:</span> jovens e adultos de 16 a 35 anos que sentem ansiedade, tristeza ou estresse, mas encontram barreiras para buscar apoio profissional.
            </p>
            <p>
              <span className="font-semibold">Psicólogos e clínicas:</span> profissionais com CRP ativo que querem divulgar seu trabalho e publicar conteúdo educativo.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="mb-4 text-xl">Diferenciais</h3>
          <ul className="flex flex-col gap-3 text-base text-text-light">
            {diferenciais.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="text-acento">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h3 className="mb-4 text-xl">CitizenTech e ODS da ONU</h3>
          <p className="mb-6 text-base leading-relaxed text-text-light">
            Para a Global Solution, o Hug se posiciona como uma CitizenTech: uma tecnologia que facilita o acesso à informação e aproxima o cidadão de profissionais e serviços de saúde mental. Funciona no navegador do celular que a pessoa já tem, sem precisar instalar nada.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {ods.map((item) => (
              <li key={item.numero} className="rounded-xl border border-primary p-4">
                <p className="text-sm text-acento">ODS {item.numero}: {item.nome}</p>
                <p className="mt-2 text-sm text-text-footer">{item.meta}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-xs text-text-footer">
          Dados: Panorama da Saúde Mental (Instituto Cactus e AtlasIntel, 2024); Doctoralia (consulta em 2026). Os valores de consulta e de assinatura podem variar.
        </p>
      </section>
    </Layout>
  );
}
