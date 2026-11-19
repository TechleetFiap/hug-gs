import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import Feedback from "../ui/Feedback";
import { atualizarRegistro, criarRegistro } from "../../services/hugService";
import { mensagemDeErro } from "../../services/apiClient";
import type { NrHumor, RegistroHumor } from "../../types/hug";
import { dataLocalISO, HUMOR } from "../../utils/datas";

interface FormularioHumorProps {
  cdUsuario: number;
  registroHoje: RegistroHumor | null;
  onSalvo: () => void;
}

const OPCOES: NrHumor[] = [1, 2, 3, 4, 5];

export default function FormularioHumor({ cdUsuario, registroHoje, onSalvo }: FormularioHumorProps) {
  const [nrHumor, setNrHumor] = useState<NrHumor | null>(registroHoje?.nrHumor ?? null);
  const [relato, setRelato] = useState<string>(registroHoje?.dsRelato ?? "");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    if (!nrHumor) {
      setErro("Escolha como você está hoje.");
      return;
    }
    if (relato.length > 2000) {
      setErro("O relato pode ter até 2000 caracteres.");
      return;
    }

    // Um registro por dia: se já existe o de hoje, edita em vez de criar outro.
    const dados = {
      cdUsuario,
      dtRegistro: dataLocalISO(),
      nrHumor,
      dsRelato: relato.trim() || null,
    };

    setEnviando(true);
    try {
      if (registroHoje) {
        await atualizarRegistro(registroHoje.id, dados);
        setSucesso("Registro de hoje atualizado.");
      } else {
        await criarRegistro(dados);
        setSucesso("Humor de hoje registrado.");
      }
      onSalvo();
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-sans text-sm">Escolha um emoji</legend>
        <div className="flex flex-wrap justify-between gap-2">
          {OPCOES.map((opcao) => (
            <button
              key={opcao}
              type="button"
              aria-pressed={nrHumor === opcao}
              aria-label={HUMOR[opcao].rotulo}
              onClick={() => setNrHumor(opcao)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl border p-3 font-sans text-xs transition-colors ${
                nrHumor === opcao ? "border-acento bg-acento/10" : "border-primary hover:bg-white/5"
              }`}
            >
              <span className="text-3xl" aria-hidden="true">{HUMOR[opcao].emoji}</span>
              <span className="hidden sm:inline">{HUMOR[opcao].rotulo}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 font-sans text-sm">
        Quer escrever sobre como se sente? (opcional, só você vê)
        <textarea
          rows={4}
          maxLength={2000}
          value={relato}
          onChange={(e) => setRelato(e.target.value)}
          className="rounded-lg border border-primary bg-white/5 px-4 py-3 text-text-light outline-none placeholder:text-text-footer"
          placeholder="Como foi o seu dia?"
        />
        <span className="self-end text-xs text-text-footer">{relato.length}/2000</span>
      </label>

      <Button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : registroHoje ? "Atualizar registro de hoje" : "Registrar meu humor"}
      </Button>

      {erro && <Feedback tipo="erro" texto={erro} />}
      {sucesso && <Feedback tipo="sucesso" texto={sucesso} />}
    </form>
  );
}
