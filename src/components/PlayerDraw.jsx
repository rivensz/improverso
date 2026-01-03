import React, { useState } from "react";
import allPlayers from "../data/players.json";
import { useStore } from "../Store";


// função para embaralhar arrays
const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};


export default function PlayerDraw() {
    const {
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
    } = useStore();


  // selecionar jogadores presentes no dia
  const handlePlayerSelect = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // sorteio de jogadores com lógica de repetição controlada
  const drawPlayers = () => {
    if (selectedPlayers.length === 0) {
      alert("Selecione pelo menos um jogador presente!");
      return;
    }

    if (!gameName.trim()) {
      alert("Digite o nome do jogo antes de sortear!");
      return;
    }

    if (drawCount > selectedPlayers.length) {
      alert("O número de jogadores a sortear não pode ser maior que os presentes!");
      return;
    }

    // jogadores ainda disponíveis para sorteio sem repetir (temporário)
    let available = selectedPlayers.filter(
      (p) => !usedTempPlayers.some((up) => up.id === p.id)
    );

    const draw = [];
    const newTempUsed = [...usedTempPlayers];

    // primeiro escolhe todos os que ainda não apareceram
    if (available.length > 0) {
      const takeCount = Math.min(available.length, drawCount);
      const shuffledAvailable = shuffleArray(available);
      draw.push(...shuffledAvailable.slice(0, takeCount));
      shuffledAvailable.slice(0, takeCount).forEach((p) => newTempUsed.push(p));
    }

    // se ainda faltar completar a quantidade, pega jogadores do histórico antigo
    if (draw.length < drawCount) {
      const alreadyUsed = selectedPlayers.filter(
        (p) => !draw.some((d) => d.id === p.id)
      );
      const remainingNeeded = drawCount - draw.length;
      const shuffledOld = shuffleArray(alreadyUsed);
      draw.push(...shuffledOld.slice(0, remainingNeeded));
      // esses jogadores não entram no histórico temporário nesta rodada
    }

    // reinicia histórico temporário se todos já apareceram
    if (newTempUsed.length === selectedPlayers.length) {
      setUsedTempPlayers([]);
    } else {
      setUsedTempPlayers(newTempUsed);
    }

    // atualiza histórico global incluindo o nome do jogo
    const newGlobalHistory = [
      ...globalHistory,
      ...draw.map((p) => `${p.nome} (${gameName})`)
    ];
    setGlobalHistory(newGlobalHistory);
    setCurrentDraw(draw);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Sorteio de Jogadores</h2>

      <div>
        <label>
          Nome do jogo:{" "}
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </label>
      </div>

      <h3 style={{ marginTop: "20px" }}>Jogadores presentes:</h3>
      <div>
        {allPlayers.map((player) => (
          <label key={player.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedPlayers.includes(player)}
              onChange={() => handlePlayerSelect(player)}
            />
            {player.nome}
          </label>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>
          Quantos jogadores sortear?{" "}
          <input
            type="number"
            min="1"
            max={selectedPlayers.length}
            value={drawCount}
            onChange={(e) => setDrawCount(Number(e.target.value))}
          />
        </label>
      </div>

      <button
        style={{ marginTop: "20px", padding: "10px 20px" }}
        onClick={drawPlayers}
      >
        Selecionar Jogadores
      </button>

      <h3 style={{ marginTop: "20px" }}>Jogadores sorteados:</h3>
      <ul>
        {currentDraw.map((p) => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>

      <h3 style={{ marginTop: "20px" }}>Histórico global:</h3>
      <ul>
        {globalHistory.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
