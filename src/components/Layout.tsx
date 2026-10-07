import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function Layout() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <nav
          className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          <Link
            to="/"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            CBT App
          </Link>
          <button
            type="button"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
