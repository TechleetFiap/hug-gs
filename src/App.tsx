import { Route, Routes } from "react-router-dom";
import RotaProtegida from "./components/auth/RotaProtegida";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Integrantes from "./pages/Integrantes";
import IntegranteDetalhe from "./pages/IntegranteDetalhe";
import Faq from "./pages/Faq";
import Contato from "./pages/Contato";
import Conteudos from "./pages/Conteudos";
import ConteudoDetalhe from "./pages/ConteudoDetalhe";
import Diario from "./pages/Diario";
import Clinicas from "./pages/Clinicas";
import ClinicaDetalhe from "./pages/ClinicaDetalhe";
import HugPlus from "./pages/HugPlus";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import Psicologo from "./pages/Psicologo";
import Admin from "./pages/Admin";
import MeuPlano from "./pages/MeuPlano";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Rotas estáticas */}
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/integrantes" element={<Integrantes />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/clinicas" element={<Clinicas />} />
      <Route path="/hug-plus" element={<HugPlus />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/conteudos" element={<RotaProtegida><Conteudos /></RotaProtegida>} />
      <Route path="/diario" element={<RotaProtegida><Diario /></RotaProtegida>} />
      <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
      <Route path="/meu-plano" element={<RotaProtegida><MeuPlano /></RotaProtegida>} />
      <Route path="/psicologo" element={<RotaProtegida><Psicologo /></RotaProtegida>} />

      {/* Rotas dinâmicas [useParams] */}
      <Route path="/integrantes/:id" element={<IntegranteDetalhe />} />
      <Route path="/conteudos/:id" element={<RotaProtegida><ConteudoDetalhe /></RotaProtegida>} />
      <Route path="/clinicas/:id" element={<ClinicaDetalhe />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
