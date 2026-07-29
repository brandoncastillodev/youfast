import { useState } from "react";
import "./styles/app.css";
import Home from "./Home";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");
  function handleData(value) {
    setSearch(value);
  }
  function handleResults(value) {
    setResults(value);
  }
  return (
    <>
      <Analytics />
      <Home search={handleData} results={handleResults} />
    </>
  );
}

export default App;
