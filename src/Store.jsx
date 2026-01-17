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


  // ---------- CARTAS HISTÓRICAS ----------
  const [historicalType, setHistoricalType] = useState("virada_era");
  const [historicalDrawCount, setHistoricalDrawCount] = useState(1);

  const [currentHistoricalDraw, setCurrentHistoricalDraw] = useState([]);
  // usado temporário separado por tipo: { virada_era: ["VE_01", ...], evento: ["EV_02", ...] }
  const [usedTempHistoricalByType, setUsedTempHistoricalByType] = useState({});
  const [globalHistoricalHistory, setGlobalHistoricalHistory] = useState([]);


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
        // cartas históricas
        historicalType,
        setHistoricalType,
        historicalDrawCount,
        setHistoricalDrawCount,
        currentHistoricalDraw,
        setCurrentHistoricalDraw,
        usedTempHistoricalByType,
        setUsedTempHistoricalByType,
        globalHistoricalHistory,
        setGlobalHistoricalHistory,

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
