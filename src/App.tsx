import "./styles/app.css";
import Home from "./Home";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Analytics />
      <Home />
    </>
  );
}

export default App;
