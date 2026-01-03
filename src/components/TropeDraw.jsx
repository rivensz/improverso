// src/TropeDraw.jsx
import React from "react";
import tropes from "../data/tropes.json";
import { useStore } from "../Store";


const TropeDraw = () => {
  const {
    currentTropeDraw,
    setCurrentTropeDraw,
    usedTempTropes,
    setUsedTempTropes,
    globalTropeHistory,
    setGlobalTropeHistory,
    drawCountTrope,
    setDrawCountTrope,
  } = useStore();

  const drawTrope = () => {
    if (!tropes.length) return;

    let available = tropes.filter(
      (t) => !usedTempTropes.some((ut) => ut.id === t.id)
    );

    const drawResult = [];

    for (let i = 0; i < drawCountTrope; i++) {
      if (available.length === 0) {
        // todos já foram usados, reinicia o temporário
        setUsedTempTropes([]);
        available = [...tropes];
      }

      const randomIndex = Math.floor(Math.random() * available.length);
      const selected = available[randomIndex];

      drawResult.push(selected);

      // Remove do disponível e adiciona ao temporário
      available.splice(randomIndex, 1);
    }

    // Atualiza temporário: adiciona apenas os que não estavam lá antes
    const newUsedTemp = [
      ...usedTempTropes,
      ...drawResult.filter((t) => !usedTempTropes.some((ut) => ut.id === t.id)),
    ];
    setUsedTempTropes(newUsedTemp);

    // Atualiza draw atual e histórico global
    setCurrentTropeDraw(drawResult);
    setGlobalTropeHistory([...globalTropeHistory, ...drawResult]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sorteio de Personagens</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Quantidade de personagens:
          <input
            type="number"
            min="1"
            max={tropes.length}
            value={drawCountTrope}
            onChange={(e) => setDrawCountTrope(Number(e.target.value))}
            style={{ width: "50px", marginLeft: "5px" }}
          />
        </label>
      </div>

      <button onClick={drawTrope}>Sortear Personagens</button>

      {currentTropeDraw.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Personagens Sorteados Agora:</h3>
          {currentTropeDraw.map((t) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{t.nome}</h3>
              <p><i>{t.tipo}</i></p>
              <p><strong>Quem é:</strong> {t.quem_e}</p>
              <p><strong>Você sempre:</strong> {t.voce_sempre}</p>
              <p><strong>Você nunca:</strong> {t.voce_nunca}</p>
              <p><strong>Objetivo imediato:</strong> {t.objetivo_imediato}</p>
              <p><strong>Gatilho de conflito:</strong> {t.gatilho_de_conflito}</p>
            </div>
          ))}
        </div>
      )}

      {globalTropeHistory.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Histórico Global:</h3>
          <ul>
            {globalTropeHistory.map((t, index) => (
              <li key={index}>
                <strong>{t.nome}</strong> ({t.tipo})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TropeDraw;
