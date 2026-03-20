import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";

const navItems = [
  { label: "Home", id: "home" },
  { label: "Styles", id: "styles" },
  { label: "Levels", id: "levels" },
  { label: "About Us", id: "about-us" },
  { label: "Contact", id: "contact" }
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const navigateToSection = (sectionId) => {
    if (sectionId === "home") {
      if (!isHomePage) {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const scrollToTarget = () => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (!isHomePage) {
      navigate("/");
      window.setTimeout(scrollToTarget, 80);
      return;
    }

    scrollToTarget();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigateToSection("home")}
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-white/80">Ensoul</p>
            <p className="font-heading text-lg leading-none text-white">Dance & Fitness Studio</p>
          </div>
        </motion.div>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * index }}
              className="font-body text-sm text-white/80"
            >
              <button
                type="button"
                onClick={() => navigateToSection(item.id)}
                className="transition hover:text-cyan-300"
              >
                {item.label}
              </button>
            </motion.li>
          ))}
        </ul>

        {isHomePage ? (
          <button
            type="button"
            onClick={() => navigateToSection("contact")}
            className="rounded-full border border-cyan-300/50 bg-cyan-400/10 px-4 py-2 font-body text-xs uppercase tracking-[0.18em] text-cyan-200 transition hover:bg-cyan-400/20"
          >
            Visit Studio
          </button>
        ) : (
          <Link
            to="/"
            className="rounded-full border border-cyan-300/50 bg-cyan-400/10 px-6 py-2 font-body text-xs uppercase tracking-[0.18em] text-cyan-200 transition hover:bg-cyan-400/20"
          >
            Home
          </Link>
        )}
      </nav>
    </header>
  );
}
