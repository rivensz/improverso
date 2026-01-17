// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import PlayerDraw from "./components/PlayerDraw";
import TropeDraw from "./components/TropeDraw";
import HistoricalCardDraw from "./components/HistoricalCardDraw";


function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <header style={{ marginBottom: "20px" }}>
          <nav style={{ display: "flex", gap: "10px" }}>
            <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
              Sorteio de Jogadores
            </Link>
            <Link to="/tropes" style={{ textDecoration: "none", color: "blue" }}>
              Sorteio de Personagens
            </Link>
            <Link to="/historicas" style={{ textDecoration: "none", color: "blue" }}>
              Sorteio de Cartas Históricas
            </Link>

          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<PlayerDraw />} />
            <Route path="/tropes" element={<TropeDraw />} />
            <Route path="/historicas" element={<HistoricalCardDraw />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
