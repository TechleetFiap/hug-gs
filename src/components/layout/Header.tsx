import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface LinkNavegacao {
  label: string;
  to: string;
}

const linksPrincipais: LinkNavegacao[] = [
  { label: "Conteúdos", to: "/conteudos" },
  { label: "Diário", to: "/diario" },
  { label: "Clínicas", to: "/clinicas" },
  { label: "Hug+", to: "/hug-plus" },
  { label: "Sobre", to: "/sobre" },
  { label: "Integrantes", to: "/integrantes" },
  { label: "FAQ", to: "/faq" },
  { label: "Contato", to: "/contato" },
];

const classesBotaoLogin =
  "shrink-0 rounded-full border border-primary px-3 py-2 font-sans text-xs font-medium transition-colors hover:bg-primary/20 sm:px-4 sm:text-sm";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();

  const links: LinkNavegacao[] = usuario
    ? [...linksPrincipais, { label: "Área do psicólogo", to: "/psicologo" }, { label: "Meu perfil", to: "/perfil" }]
    : linksPrincipais;

  // Fecha o menu mobile ao trocar de rota.
  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  function handleSair() {
    sair();
    navigate("/");
  }

  return (
    <header className="relative z-50">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-8">
        <Link to="/" className="min-w-0 shrink">
          <h1 className="truncate py-6 font-sans text-2xl font-bold text-acento sm:text-3xl">Hug</h1>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`whitespace-nowrap font-sans text-sm transition-colors hover:text-white ${location.pathname === link.to ? "text-acento" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {usuario ? (
            <>
              <span className="max-w-[72px] truncate font-sans text-xs sm:max-w-[160px] sm:text-sm">
                Olá, {usuario.nmUsuario.split(" ")[0]}
              </span>
              <button type="button" onClick={handleSair} className={classesBotaoLogin}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className={classesBotaoLogin}>
              Entrar
            </Link>
          )}

          <button
            type="button"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-controls="navegacao-mobile"
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="flex h-6 w-8 shrink-0 flex-col justify-between lg:hidden"
          >
            <span className={`block h-[3px] w-full rounded bg-white transition-transform ${menuAberto ? "translate-y-[10.5px] rotate-45" : ""}`} />
            <span className={`block h-[3px] w-full rounded bg-white transition-opacity ${menuAberto ? "opacity-0" : ""}`} />
            <span className={`block h-[3px] w-full rounded bg-white transition-transform ${menuAberto ? "-translate-y-[10.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      <nav
        id="navegacao-mobile"
        className={`absolute inset-x-0 top-full w-full overflow-y-auto overflow-x-hidden bg-secondary shadow-lg transition-all duration-300 lg:hidden ${
          menuAberto ? "max-h-[70vh]" : "max-h-0"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block border-b border-white/10 px-6 py-4 font-sans text-sm ${location.pathname === link.to ? "text-acento" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
