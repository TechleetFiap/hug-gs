import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { mensagemDeErro } from "../../services/apiClient";
import {
  criarClinica,
  desvincularClinica,
  listarClinicas,
  listarVinculos,
  vincularClinica,
} from "../../services/hugService";
import type { Clinica } from "../../types/hug";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { EstadoCarregando, EstadoErro } from "../ui/Estados";
import Feedback from "../ui/Feedback";

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

interface DadosClinica {
  nmClinica: string;
  dsEndereco: string;
  nmBairro: string;
  nmCidade: string;
  sgUf: string;
  dsTelefone: string;
  dsSite: string;
}

type Msg = { tipo: "sucesso" | "erro"; texto: string } | null;

// Um psicólogo pode atuar em várias clínicas e uma clínica pode ter vários psicólogos (N:N).
export default function MinhasClinicas({ cdPsicologo }: { cdPsicologo: number }) {
  const [clinicas, setClinicas] = useState<Clinica[] | null>(null);
  const [minhasIds, setMinhasIds] = useState<number[]>([]);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [ocupado, setOcupado] = useState(false);
  const [escolhida, setEscolhida] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DadosClinica>({
    defaultValues: { sgUf: "" },
  });

  // Mantém os dados na tela durante o recarregamento (não desmonta os formulários).
  async function carregar() {
    setErro("");
    try {
      // Uma chamada depois da outra.
      const todas = await listarClinicas();
      const vinculos = await listarVinculos();
      setClinicas(todas);
      setMinhasIds(vinculos.filter((v) => v.cdPsicologo === cdPsicologo).map((v) => v.cdClinica));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cdPsicologo]);

  async function entrar(cdClinica: number) {
    setMsg(null);
    setOcupado(true);
    try {
      await vincularClinica(cdPsicologo, cdClinica);
      setEscolhida("");
      setMsg({ tipo: "sucesso", texto: "Você agora atua nesta clínica." });
      await carregar();
    } catch (err) {
      setMsg({ tipo: "erro", texto: mensagemDeErro(err) });
    } finally {
      setOcupado(false);
    }
  }

  async function sair(c: Clinica) {
    if (!window.confirm(`Deixar de atuar em "${c.nmClinica}"?`)) return;
    setMsg(null);
    setOcupado(true);
    try {
      await desvincularClinica(cdPsicologo, c.id);
      setMsg({ tipo: "sucesso", texto: "Vínculo removido." });
      await carregar();
    } catch (err) {
      setMsg({ tipo: "erro", texto: mensagemDeErro(err) });
    } finally {
      setOcupado(false);
    }
  }

  async function cadastrar(d: DadosClinica) {
    setMsg(null);
    const nova = {
      nmClinica: d.nmClinica.trim(),
      dsEndereco: d.dsEndereco.trim(),
      nmBairro: d.nmBairro.trim(),
      nmCidade: d.nmCidade.trim(),
      sgUf: d.sgUf,
      dsTelefone: d.dsTelefone.trim() || null,
      dsSite: d.dsSite.trim() || null,
    };
    try {
      await criarClinica(nova);
      // O POST não devolve o id: busca a lista de novo e acha a clínica recém-criada.
      const todas = await listarClinicas();
      const criada = todas
        .filter((c) => c.nmClinica === nova.nmClinica && c.dsEndereco === nova.dsEndereco)
        .sort((a, b) => b.id - a.id)[0];
      if (criada) {
        await vincularClinica(cdPsicologo, criada.id);
        setMsg({ tipo: "sucesso", texto: "Clínica cadastrada e vinculada ao seu perfil." });
      } else {
        setMsg({ tipo: "sucesso", texto: "Clínica cadastrada. Selecione-a na lista para entrar nela." });
      }
      reset({ sgUf: "" });
      setMostrarForm(false);
      await carregar();
    } catch (err) {
      setMsg({ tipo: "erro", texto: mensagemDeErro(err) });
    }
  }

  if (erro) return <EstadoErro mensagem={erro} onTentar={carregar} />;
  if (clinicas === null) return <EstadoCarregando />;

  const minhas = clinicas.filter((c) => minhasIds.includes(c.id));
  const disponiveis = clinicas.filter((c) => !minhasIds.includes(c.id));
  const campo = "rounded-lg border bg-white/5 px-4 py-3 text-text-light outline-none placeholder:text-text-footer";
  const borda = (invalido: boolean) => (invalido ? "border-red-500" : "border-primary");

  return (
    <div className="flex flex-col gap-8">
      {msg && <Feedback tipo={msg.tipo} texto={msg.texto} />}

      <div>
        <h4 className="mb-3 font-semibold">Clínicas onde atuo</h4>
        {minhas.length === 0 ? (
          <p className="text-text-footer">Você ainda não atua em nenhuma clínica.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {minhas.map((c) => (
              <li key={c.id}>
                <Card className="flex flex-col items-start justify-between gap-3 text-left text-secondary sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">{c.nmClinica}</p>
                    <p className="text-xs text-slate-500">{c.dsEndereco} · {c.nmBairro} · {c.nmCidade}/{c.sgUf}</p>
                  </div>
                  <Button variante="perigo" onClick={() => sair(c)} disabled={ocupado}>Sair da clínica</Button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="mb-3 font-semibold">Entrar em uma clínica</h4>
        {disponiveis.length === 0 ? (
          <p className="text-text-footer">Não há outras clínicas cadastradas. Cadastre uma nova abaixo.</p>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={escolhida}
              onChange={(e) => setEscolhida(e.target.value)}
              className={`${campo} flex-1 border-primary`}
            >
              <option value="" className="text-black">Selecione uma clínica</option>
              {disponiveis.map((c) => (
                <option key={c.id} value={c.id} className="text-black">
                  {c.nmClinica} — {c.nmCidade}/{c.sgUf}
                </option>
              ))}
            </select>
            <Button onClick={() => entrar(Number(escolhida))} disabled={ocupado || escolhida === ""}>
              Entrar na clínica
            </Button>
          </div>
        )}
      </div>

      <div>
        {!mostrarForm ? (
          <Button variante="secundaria" onClick={() => setMostrarForm(true)}>Cadastrar nova clínica</Button>
        ) : (
          <form onSubmit={handleSubmit(cadastrar)} noValidate className="flex flex-col gap-4 rounded-2xl border border-primary p-6">
            <h4 className="font-semibold">Cadastrar nova clínica</h4>

            <label className="flex flex-col gap-1 text-sm">
              Nome da clínica*
              <input maxLength={150} className={`${campo} ${borda(!!errors.nmClinica)}`}
                {...register("nmClinica", { required: "Informe o nome da clínica." })} />
              {errors.nmClinica && <span className="text-xs text-red-400">{errors.nmClinica.message}</span>}
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Endereço*
              <input maxLength={250} className={`${campo} ${borda(!!errors.dsEndereco)}`}
                {...register("dsEndereco", { required: "Informe o endereço." })} />
              {errors.dsEndereco && <span className="text-xs text-red-400">{errors.dsEndereco.message}</span>}
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm">
                Bairro*
                <input maxLength={100} className={`${campo} ${borda(!!errors.nmBairro)}`}
                  {...register("nmBairro", { required: "Informe o bairro." })} />
                {errors.nmBairro && <span className="text-xs text-red-400">{errors.nmBairro.message}</span>}
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Cidade*
                <input maxLength={100} className={`${campo} ${borda(!!errors.nmCidade)}`}
                  {...register("nmCidade", { required: "Informe a cidade." })} />
                {errors.nmCidade && <span className="text-xs text-red-400">{errors.nmCidade.message}</span>}
              </label>
              <label className="flex flex-col gap-1 text-sm">
                UF*
                <select className={`${campo} ${borda(!!errors.sgUf)}`}
                  {...register("sgUf", { required: "Selecione a UF." })}>
                  <option value="" className="text-black">Selecione</option>
                  {UFS.map((uf) => <option key={uf} value={uf} className="text-black">{uf}</option>)}
                </select>
                {errors.sgUf && <span className="text-xs text-red-400">{errors.sgUf.message}</span>}
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                Telefone
                <input maxLength={20} placeholder="(11) 99999-9999" className={`${campo} border-primary`}
                  {...register("dsTelefone")} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Site
                <input type="url" maxLength={500} placeholder="https://" className={`${campo} ${borda(!!errors.dsSite)}`}
                  {...register("dsSite", {
                    pattern: { value: /^$|^https?:\/\/\S+$/, message: "Informe um link válido, começando com http:// ou https://." },
                  })} />
                {errors.dsSite && <span className="text-xs text-red-400">{errors.dsSite.message}</span>}
              </label>
            </div>

            <p className="text-xs text-text-footer">Ao cadastrar, você já passa a atuar nesta clínica.</p>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Cadastrando..." : "Cadastrar clínica"}</Button>
              <Button type="button" variante="secundaria" onClick={() => setMostrarForm(false)} disabled={isSubmitting}>Cancelar</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
