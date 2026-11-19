import Layout from "../components/layout/Layout";
import { perguntasFrequentes } from "../data/faq";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Faq() {
  usePageTitle("FAQ");

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <h2 className="mb-10 text-center text-3xl">Perguntas frequentes</h2>
        <div className="flex flex-col gap-3">
          {perguntasFrequentes.map((item) => (
            <details key={item.id} className="group rounded-xl border border-primary p-4 open:bg-white/5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">{item.pergunta}<span aria-hidden="true" className="text-xl text-acento transition-transform group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm leading-relaxed text-text-footer">{item.resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </Layout>
  );
}
