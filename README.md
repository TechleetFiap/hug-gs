# Hug

Site de saúde mental que reúne conteúdos de psicólogos, acompanhamento pessoal do humor e descoberta de clínicas. Projeto da disciplina Front-End Design Engineering, Global Solution 2026/2 (FIAP), no tema CitizenTech.

## Objetivo

Ampliar o acesso ao conhecimento sobre saúde emocional, principalmente para pessoas com barreiras para buscar apoio profissional. O usuário aprende com conteúdos, registra o humor diariamente e encontra clínicas. O Hug complementa, mas não substitui o acompanhamento profissional.

## Tecnologias

- React 18 + Vite + TypeScript
- Tailwind CSS (layout responsivo: mobile 390×844, tablet 768×1024, desktop 1440×900)
- React Router (rotas estáticas e dinâmicas)
- React Hook Form (formulários com validação)
- Fetch API (requisições HTTP; sem Axios)

## Estrutura

```
src/
  components/   componentes reutilizáveis (layout, ui, diário, conteúdos, psicólogo, auth)
  pages/        uma página por rota
  services/     apiClient (HTTP central) e hugService (uma função por rota da API)
  types/        tipos dos dados da API
  context/      sessão do usuário (AuthContext)
  hooks/        useApi, useAuth, usePageTitle
  utils/        datas e humor
  data/         conteúdo fixo (integrantes, FAQ, contato)
```

## Integrantes

- A definir (nome, RM, turma)

## Execução local

Pré-requisitos: Node.js 18 ou superior e acesso à API Hug (padrão: a publicada em `https://hug-gs.onrender.com`).

```bash
npm install
npm run dev
```

Para apontar para outra API (ex.: local em `http://localhost:8080`), copie `.env.example` para `.env.local` e ajuste `VITE_API_URL`.

Build de produção: `npm run build`.

## GitHub

- Repositório: https://github.com/TechleetFiap/hug-gs

## Vercel

- URL do front: https://hug-gs.vercel.app

## API

- Disciplina: Domain Driven Design Using Java
- URL pública: https://hug-gs.onrender.com
- Rotas usadas: `/hug/usuario`, `/hug/psicologo`, `/hug/conteudo`, `/hug/clinica`, `/hug/plano`, `/hug/assinatura`, `/hug/registroHumor`

## YouTube

- Vídeo de apresentação (até 3 min): _a preencher_

## Contato

- E-mail: _a preencher_
