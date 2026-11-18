import { useCallback, useEffect, useState } from "react";
import { mensagemDeErro } from "../services/apiClient";
import type { ApiState } from "../types/requisicao";

/**
 * Executa uma função assíncrona (chamada à API) e expõe o estado da operação.
 * Sempre que as dependências mudam, a chamada é refeita.
 */
export function useApi<T>(buscar: () => Promise<T>, dependencias: unknown[]) {
  const [estado, setEstado] = useState<ApiState<T>>({ status: "loading" });
  const [versao, setVersao] = useState<number>(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ status: "loading" });

    buscar()
      .then((data) => {
        if (!cancelado) setEstado({ status: "success", data });
      })
      .catch((erro: unknown) => {
        if (!cancelado) setEstado({ status: "error", message: mensagemDeErro(erro) });
      });

    return () => {
      cancelado = true;
    };
  }, [...dependencias, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return { estado, recarregar };
}
