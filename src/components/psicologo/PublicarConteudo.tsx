import { useState } from "react";
import { useForm } from "react-hook-form";
import { atualizarConteudo, criarConteudo } from "../../services/hugService";
import { mensagemDeErro } from "../../services/apiClient";
import type { Conteudo, SimNao, TipoConteudo } from "../../types/hug";
import { dataLocalISO } from "../../utils/datas";
import Button from "../ui/Button";
import Feedback from "../ui/Feedback";

interface Dados {
  nmTitulo: string;
  dsTema: string;
  dsTipo: TipoConteudo;
  dsTexto: string;
  dsUrlVideo: string;
  exclusivo: boolean;
}

// Sem "conteudo": publica um novo. Com "conteudo": edita o existente (PUT).
export default function PublicarConteudo({
  cdPsicologo,
  onPublicado,
  conteudo,
  onCancelar,
}: {
  cdPsicologo: number;
  onPublicado: () => void;
  conteudo?: Conteudo;
  onCancelar?: () => void;
}) {
  const editando = Boolean(conteudo);
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<Dados>({
    defaultValues: conteudo
      ? {
          nmTitulo: conteudo.nmTitulo,
          dsTema: conteudo.dsTema,
          dsTipo: conteudo.dsTipo,
          dsTexto: conteudo.dsTexto ?? "",
          dsUrlVideo: conteudo.dsUrlVideo ?? "",
          exclusivo: conteudo.flExclusivo === "S",
        }
      : { dsTipo: "TEXTO", exclusivo: false },
  });
  const tipo = watch("dsTipo");
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  async function enviar(dados: Dados) {
    setFeedback(null);
    try {
      const corpo = {
        cdPsicologo,
        nmTitulo: dados.nmTitulo.trim(),
        dsTema: dados.dsTema.trim(),
        dsTipo: dados.dsTipo,
        // TEXTO leva dsTexto e não leva URL; VIDEO é o contrário.
        dsTexto: dados.dsTipo === "TEXTO" ? dados.dsTexto.trim() : null,
        dsUrlVideo: dados.dsTipo === "VIDEO" ? dados.dsUrlVideo.trim() : null,
        flExclusivo: (dados.exclusivo ? "S" : "N") as SimNao,
      };
      if (conteudo) {
        // Na edição mantém a data de publicação original (campo obrigatório no PUT).
        await atualizarConteudo(conteudo.id, { ...corpo, dtPublicacao: conteudo.dtPublicacao });
        onPublicado();
        onCancelar?.();
        return;
      }
      await criarConteudo({ ...corpo, dtPublicacao: dataLocalISO() });
      reset({ dsTipo: "TEXTO", exclusivo: false });
      setFeedback({ tipo: "sucesso", texto: "Conteúdo publicado." });
      onPublicado();
    } catch (err) {
      setFeedback({ tipo: "erro", texto: mensagemDeErro(err) });
    }
  }

  const campo = "rounded-lg border bg-white/5 px-4 py-3 text-text-light outline-none placeholder:text-text-footer";

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 font-sans text-sm">
        Título*
        <input
          maxLength={180}
          className={`${campo} ${errors.nmTitulo ? "border-red-500" : "border-primary"}`}
          {...register("nmTitulo", { required: "Informe o título.", maxLength: { value: 180, message: "Título muito longo." } })}
        />
        {errors.nmTitulo && <span className="text-xs text-red-400">{errors.nmTitulo.message}</span>}
      </label>

      <label className="flex flex-col gap-1 font-sans text-sm">
        Tema*
        <input
          maxLength={80}
          placeholder="Ex.: Respiração, Autocuidado"
          className={`${campo} ${errors.dsTema ? "border-red-500" : "border-primary"}`}
          {...register("dsTema", { required: "Informe o tema.", maxLength: { value: 80, message: "Tema muito longo." } })}
        />
        {errors.dsTema && <span className="text-xs text-red-400">{errors.dsTema.message}</span>}
      </label>

      <fieldset className="flex gap-6 font-sans text-sm">
        <legend className="mb-2">Formato*</legend>
        <label className="flex items-center gap-2"><input type="radio" value="TEXTO" {...register("dsTipo")} /> Texto</label>
        <label className="flex items-center gap-2"><input type="radio" value="VIDEO" {...register("dsTipo")} /> Vídeo</label>
      </fieldset>

      {tipo === "TEXTO" ? (
        <label className="flex flex-col gap-1 font-sans text-sm">
          Texto*
          <textarea
            rows={8}
            className={`${campo} ${errors.dsTexto ? "border-red-500" : "border-primary"}`}
            {...register("dsTexto", { required: "Escreva o texto do conteúdo." })}
          />
          {errors.dsTexto && <span className="text-xs text-red-400">{errors.dsTexto.message}</span>}
        </label>
      ) : (
        <label className="flex flex-col gap-1 font-sans text-sm">
          Link do vídeo*
          <input
            type="url"
            maxLength={1000}
            placeholder="https://"
            className={`${campo} ${errors.dsUrlVideo ? "border-red-500" : "border-primary"}`}
            {...register("dsUrlVideo", {
              required: "Informe o link do vídeo.",
              pattern: { value: /^https?:\/\/\S+$/, message: "Informe um link válido, começando com http:// ou https://." },
            })}
          />
          {errors.dsUrlVideo && <span className="text-xs text-red-400">{errors.dsUrlVideo.message}</span>}
        </label>
      )}

      <label className="flex items-center gap-2 font-sans text-sm">
        <input type="checkbox" {...register("exclusivo")} />
        Conteúdo exclusivo do Hug+
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {editando
            ? isSubmitting ? "Salvando..." : "Salvar alterações"
            : isSubmitting ? "Publicando..." : "Publicar conteúdo"}
        </Button>
        {editando && onCancelar && (
          <Button type="button" variante="secundaria" onClick={onCancelar} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
      </div>
      {feedback && <Feedback tipo={feedback.tipo} texto={feedback.texto} />}
    </form>
  );
}
