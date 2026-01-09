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

      {/* Seção de Histórico Global com Dropdown */}
      {globalTropeHistory.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <details style={{ cursor: "pointer" }}>
            <summary style={{ fontSize: "1.17em", fontWeight: "bold", marginBottom: "10px" }}>
              Exibir Histórico Global ({globalTropeHistory.length})
            </summary>
            
            <div style={{ 
              maxHeight: "500px", // Aumentei um pouco a altura para acomodar os detalhes
              overflowY: "auto", 
              border: "1px solid #eee", 
              padding: "10px", 
              borderRadius: "5px",
              marginTop: "10px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {globalTropeHistory.slice().reverse().map((t, index) => (
                  <details key={index} style={{ border: "1px solid #f0f0f0", padding: "8px", borderRadius: "5px" }}>
                    <summary style={{ fontWeight: "500" }}>
                      <strong>{t.nome}</strong> - <small>{t.tipo}</small>
                    </summary>
                    
                    <div style={{ marginTop: "10px", fontSize: "0.9em", paddingLeft: "15px", borderLeft: "2px solid #ccc" }}>
                      <p><strong>Quem é:</strong> {t.quem_e}</p>
                      <p><strong>Você sempre:</strong> {t.voce_sempre}</p>
                      <p><strong>Você nunca:</strong> {t.voce_nunca}</p>
                      <p><strong>Objetivo imediato:</strong> {t.objetivo_imediato}</p>
                      <p><strong>Gatilho de conflito:</strong> {t.gatilho_de_conflito}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default TropeDraw;
