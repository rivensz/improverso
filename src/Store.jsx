// src/Store.jsx
import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // ---------- JOGADORES ----------
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [drawCount, setDrawCount] = useState(1);
  const [usedTempPlayers, setUsedTempPlayers] = useState([]);
  const [currentDraw, setCurrentDraw] = useState([]);
  const [globalHistory, setGlobalHistory] = useState([]);
  const [gameName, setGameName] = useState("");

  // ---------- PERSONAGENS ----------
  const [currentTropeDraw, setCurrentTropeDraw] = useState([]);
  const [usedTempTropes, setUsedTempTropes] = useState([]);
  const [globalTropeHistory, setGlobalTropeHistory] = useState([]);
  const [drawCountTrope, setDrawCountTrope] = useState(1);

  return (
    <StoreContext.Provider
      value={{
        // jogadores
        selectedPlayers,
        setSelectedPlayers,
        drawCount,
        setDrawCount,
        usedTempPlayers,
        setUsedTempPlayers,
        currentDraw,
        setCurrentDraw,
        globalHistory,
        setGlobalHistory,
        gameName,
        setGameName,
        // personagens
        currentTropeDraw,
        setCurrentTropeDraw,
        usedTempTropes,
        setUsedTempTropes,
        globalTropeHistory,
        setGlobalTropeHistory,
        drawCountTrope,
        setDrawCountTrope,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// hook personalizado para acessar o store
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore deve ser usado dentro do StoreProvider");
  }
  return context;
}
