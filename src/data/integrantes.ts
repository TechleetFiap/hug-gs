export interface Integrante {
  id: string;
  nome: string;
  rm: string;
  turma: string;
  foto: string;
  github: string;
  linkedin: string;
  bio: string;
}

export const integrantes: Integrante[] = [
  {
    id: "samuel-pedroso",
    nome: "Samuel Pedroso",
    rm: "569335",
    turma: "1TDSR",
    foto: "/imagens/samuel.jpeg",
    github: "https://github.com/OSamuelXavierDev",
    linkedin: "https://www.linkedin.com/in/samuel-xavier-061434274",
    bio: "Integrante da equipe TechLeet, responsável pela idealização da ideia do projeto.",
  },
  {
    id: "diogo-pedroso-alves",
    nome: "Diogo Pedroso Alves",
    rm: "570024",
    turma: "1TDSR",
    foto: "/imagens/diogo.jpeg",
    github: "https://github.com/DiogoPedrosoAlves",
    linkedin: "https://www.linkedin.com/in/diogo-pedroso-alves-895346237/",
    bio: "Integrante da equipe TechLeet, responsável por criar o site e por desenvolver ideias para o projeto.",
  },
  {
    id: "murilo-munari-bissiato",
    nome: "Murilo Munari Bissiato",
    rm: "569602",
    turma: "1TDSR",
    foto: "/imagens/murilo.jpeg",
    github: "https://github.com/murilomunari",
    linkedin: "https://www.linkedin.com/in/murilomunaribissiato/",
    bio: "Integrante da equipe TechLeet, responsável pela criação do Back-End com base dos dados.",
  },
  {
    id: "pedro-henrique-toledo-sampaio",
    nome: "Pedro Henrique Toledo Sampaio",
    rm: "571707",
    turma: "1TDSR",
    foto: "/imagens/pedro.jpeg",
    github: "https://github.com/PedroSampaio20",
    linkedin: "https://www.linkedin.com/in/pedro-sampaio2002/",
    bio: "Integrante da equipe TechLeet, responsável pelo Back-End focando na parte de Python.",
  },
  {
    id: "felipe-ferreira-amado",
    nome: "Felipe Ferreira Amado",
    rm: "572567",
    turma: "1TDSR",
    foto: "/imagens/felipe.jpeg",
    github: "https://github.com/FelipeFerreiraAmado",
    linkedin: "https://www.linkedin.com/in/felipe-amado/",
    bio: "Integrante da equipe TechLeet, responsável na parte de Dados da TechLeet e implantação no Back-End.",
  },
];
