import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Feedback from "../components/ui/Feedback";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import { ApiError, mensagemDeErro } from "../services/apiClient";
import { atualizarUsuario, buscarUsuario, excluirPsicologo, excluirUsuario } from "../services/hugService";

// Mensagens da exclusão de conta (ajuste os textos aqui).
const MENSAGENS_EXCLUSAO = {
  confirmar: "Excluir sua conta? Esta ação não pode ser desfeita.",
  perfilPsicologoVinculado:
    "Não foi possível excluir seu perfil de psicólogo porque ele ainda possui vínculos (ex.: publicações ou clínicas).",
  contaVinculada: "Não foi possível excluir a conta porque ela possui registros vinculados (ex.: diário).",
};

interface Dados {
  nome: string;
  email: string;
  novaSenha: string;
}

export default function Perfil() {
  usePageTitle("Meu perfil");
  const navigate = useNavigate();
  const { usuario, psicologo, sair, atualizarUsuario: salvarNoContexto, recarregarPsicologo } = useAuth();
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Dados>({
    defaultValues: { nome: usuario?.nmUsuario ?? "", email: usuario?.dsEmail ?? "", novaSenha: "" },
  });

  if (!usuario) return null;
  const usuarioAtual = usuario;

  async function salvar(dados: Dados) {
    setFeedback(null);
    try {
      // O PUT substitui o cadastro. A senha só vai junto quando o usuário a troca.
      await atualizarUsuario(usuarioAtual.id, {
        nmUsuario: dados.nome.trim(),
        dsEmail: dados.email.trim(),
        ...(dados.novaSenha ? { dsSenhaHash: dados.novaSenha } : {}),
      });
      const atualizado = await buscarUsuario(usuarioAtual.id);
      salvarNoContexto(atualizado);
      reset({ nome: atualizado.nmUsuario, email: atualizado.dsEmail, novaSenha: "" });
      setFeedback({ tipo: "sucesso", texto: "Dados atualizados." });
    } catch (err) {
      setFeedback({ tipo: "erro", texto: mensagemDeErro(err) });
    }
  }

  async function excluir() {
    if (!window.confirm(MENSAGENS_EXCLUSAO.confirmar)) return;
    setFeedback(null);

    // O banco não deixa apagar a conta enquanto existe perfil de psicólogo ligado a ela:
    // primeiro DELETE /hug/psicologo/{id}, depois DELETE /hug/usuario/{id}.
    if (psicologo) {
      try {
        await excluirPsicologo(psicologo.id);
      } catch (err) {
        const texto =
          err instanceof ApiError && err.status === 404
            ? MENSAGENS_EXCLUSAO.perfilPsicologoVinculado
            : mensagemDeErro(err);
        setFeedback({ tipo: "erro", texto });
        return;
      }
    }

    try {
      await excluirUsuario(usuarioAtual.id);
      sair();
      navigate("/", { replace: true });
    } catch (err) {
      // A API responde 404 quando o usuário tem registros vinculados (ex.: diário).
      const texto =
        err instanceof ApiError && err.status === 404
          ? MENSAGENS_EXCLUSAO.contaVinculada
          : mensagemDeErro(err);
      setFeedback({ tipo: "erro", texto });
      // O perfil de psicólogo já foi removido: sincroniza a sessão para não ficar desatualizada.
      if (psicologo) await recarregarPsicologo().catch(() => undefined);
    }
  }

  const campo = "rounded-lg border bg-white/5 px-4 py-3 text-text-light outline-none placeholder:text-text-footer";

  return (
    <Layout>
      <section className="mx-auto max-w-md px-4 py-12 font-sans">
        <h2 className="mb-6 text-center text-3xl">Meu perfil</h2>
        <form onSubmit={handleSubmit(salvar)} noValidate className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Nome*
            <input maxLength={120} className={`${campo} ${errors.nome ? "border-red-500" : "border-primary"}`}
              {...register("nome", { required: "Informe seu nome." })} />
            {errors.nome && <span className="text-xs text-red-400">{errors.nome.message}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            E-mail*
            <input type="email" maxLength={254} className={`${campo} ${errors.email ? "border-red-500" : "border-primary"}`}
              {...register("email", { required: "Informe seu e-mail.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Informe um e-mail válido." } })} />
            {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Nova senha (deixe em branco para manter)
            <input type="password" maxLength={255} className={`${campo} border-primary`} {...register("novaSenha")} />
          </label>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar alterações"}</Button>
        </form>

        <div className="mt-12 border-t border-primary pt-8">
          <h3 className="mb-3 text-lg">Excluir conta</h3>
          <p className="mb-4 text-sm text-text-footer">Remove seu cadastro. Esta ação não pode ser desfeita.</p>
          <Button variante="perigo" onClick={excluir}>Excluir minha conta</Button>
        </div>

        {feedback && <div className="mt-8"><Feedback tipo={feedback.tipo} texto={feedback.texto} /></div>}
      </section>
    </Layout>
  );
}
