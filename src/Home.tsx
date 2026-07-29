import { useEffect, useState, useRef } from "react";

function Home() {
  const youtubeAPI = import.meta.env.VITE_API_KEY;
  const inputRef = useRef(null);
  const nextRef = useRef(null);
  const backRef = useRef(null);
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [result, setResult] = useState(null);
  const [contador, setContador] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [access, setAccess] = useState(true);
  const [code, setCode] = useState("");
  const [esp, setEsp] = useState(false);
  const [mode, setMode] = useState(true);

  const resultRef = useRef(null);

  function handleLang() {
    setEsp(!esp);
  }

  function handleMode() {
    setMode(!mode);
  }

  const resultVid = videos.length > 0 ? videos[contador] : null;
  const ready = resultVid && resultVid.snippet;

  useEffect(() => {
    if (!ready) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [contador, ready]);

  useEffect(() => {
    if (ready) setError("");
  }, [ready]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.ctrlKey && event.key === "ArrowRight") {
        event.preventDefault();
        if (contador < videos.length - 1) setContador((c) => c + 1);
      }
      if (event.ctrlKey && event.key === "ArrowLeft") {
        event.preventDefault();
        if (contador > 0) setContador((c) => c - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contador, videos]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(search)}&key=${youtubeAPI}`
      );
      if (!res.ok) throw new Error(esp ? "Error al buscar" : "Search failed");
      const data = await res.json();
      const items = data.items || [];
      setVideos(items);
      setContador(0);
      if (items.length === 0) {
        setError(esp ? "Sin resultados" : "No results");
      }
    } catch (err) {
      setError(err.message || (esp ? "Error de conexión" : "Connection error"));
    } finally {
      setLoading(false);
    }
  };

  function handleCode(e) {
    e.preventDefault();
    if (code === import.meta.env.VITE_LOGIN_KEY) {
      setAccess(true);
    } else {
      alert(esp ? "Contraseña incorrecta!" : "Wrong password!");
    }
  }

  function resetApp() {
    setSearch("");
    setResult(null);
    setVideos([]);
    setContador(0);
    setError("");
  }

  function handleHomeKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      resetApp();
    }
  }

  return (
    <div className={mode ? "home home-dark" : "home"} role="main">
      <h1
        className="top"
        onClick={resetApp}
        onKeyDown={handleHomeKey}
        role="button"
        tabIndex={0}
        aria-label={esp ? "YouFast - Volver al inicio" : "YouFast - Go home"}
      >
        YouFast
      </h1>

      {access ? (
        <>
          <form onSubmit={handleSearch} role="search" aria-label={esp ? "Buscar canciones" : "Search songs"}>
            <div className={mode ? "buscador-dark search-song top" : "buscador search-song top"}>
              <label htmlFor="searchInput" className="sr-only">
                {esp ? "Buscar canción" : "Search song"}
              </label>
              <input
                id="searchInput"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                maxLength={60}
                placeholder={esp ? "Escribir canción" : "Write a song"}
                autoFocus
                ref={inputRef}
                aria-label={esp ? "Escribir canción" : "Write a song"}
              />
            </div>
          </form>

          {error && (
            <p className="top" style={{ color: mode ? "#ff9999" : "#cc0000" }}>
              {error}
            </p>
          )}

          {loading && <p className="top">{esp ? "Buscando..." : "Searching..."}</p>}

          {!loading && !error && !ready && (esp ?
            <div className="instrucciones top">
              <p className="title"><u>Instrucciones</u></p>
              <p>1. Escribí el título y el artista de la canción.</p>
              <p>2. Apretá ENTER.</p>
              <p>3. Si no es la que buscas, dale a Siguiente ⏭.</p>
            </div> :
            <div className="instrucciones top">
              <p className="title"><u>Instructions</u></p>
              <p>1. Write the title and the artist of the song.</p>
              <p>2. Hit ENTER.</p>
              <p>3. If it's not what you want, hit Next ⏭.</p>
            </div>
          )}

          {ready && (
            <div className="video top" ref={resultRef}>
              <h3 style={{ fontSize: "1.4rem" }}>{resultVid.snippet.title}</h3>
              <iframe
                className="iframe top"
                width="600"
                height="315"
                src={`https://www.youtube.com/embed/${resultVid.id.videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1`}
                title={resultVid.snippet.title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className={mode ? "botones-dark top" : "botones top"}>
                {contador > 0 && (
                  <button
                    ref={backRef}
                    onClick={() => setContador((c) => c - 1)}
                    aria-label={esp ? "Anterior" : "Previous"}
                  >
                    ⏮ {esp ? "Anterior" : "Previous"}
                  </button>
                )}
                {contador < videos.length - 1 && (
                  <button
                    ref={nextRef}
                    onClick={() => setContador((c) => c + 1)}
                    aria-label={esp ? "Siguiente" : "Next"}
                  >
                    {esp ? "Siguiente" : "Next"} ⏭
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="title-clave">{esp ? "Ingrese código:" : "Insert code:"}</p>
          <form onSubmit={handleCode}>
            <div className="buscador top">
              <label htmlFor="codeInput" className="sr-only">
                {esp ? "Código" : "Code"}
              </label>
              <input
                id="codeInput"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={30}
                placeholder="********"
                autoFocus
                ref={inputRef}
                aria-label={esp ? "Código de acceso" : "Access code"}
              />
            </div>
          </form>
        </>
      )}

      <div style={{ flex: "1" }} />

      <footer className="top" style={{ fontSize: "1.1rem" }}>
        <div className={mode ? "boton-idioma-contenedor-dark" : "boton-idioma-contenedor"}>
          <button
            onClick={handleMode}
            className="boton-idioma"
            aria-label={mode ? (esp ? "Activar modo claro" : "Switch to light mode") : (esp ? "Activar modo oscuro" : "Switch to dark mode")}
            aria-pressed={!mode}
          >
            {mode ? (esp ? "Modo Claro" : "Light Mode") : (esp ? "Modo Oscuro" : "Dark Mode")}
          </button>
        </div>
        <p className="firma">
          {esp ? "Hecho con ❤️ por Brandon 🏰" : "Made with ❤️ by Brandon 🏰"}
        </p>
        <div className={mode ? "boton-idioma-contenedor-dark" : "boton-idioma-contenedor"}>
          <button
            onClick={handleLang}
            className="boton-idioma"
            aria-label={esp ? "Cambiar a inglés" : "Switch to Spanish"}
          >
            {esp ? "English" : "Español"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Home;
