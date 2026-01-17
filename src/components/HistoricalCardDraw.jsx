import React, { useMemo } from "react";
import deck from "../data/historical_deck.json";
import { useStore } from "../Store";

const TYPE_LABELS = {
  virada_era: "Virada de Era",
  evento: "Evento Histórico",
  sistema: "Sistema de Poder",
  figura: "Figura Arquetípica",
  ideia: "Ideia / Documento",
};

// embaralha (Fisher-Yates)
const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function HistoricalCardDraw() {
  const {
    // filtros / config
    historicalType,
    setHistoricalType,
    historicalDrawCount,
    setHistoricalDrawCount,

    // estado do sorteio
    currentHistoricalDraw,
    setCurrentHistoricalDraw,
    usedTempHistoricalByType,
    setUsedTempHistoricalByType,
    globalHistoricalHistory,
    setGlobalHistoricalHistory,
  } = useStore();

  const allCards = deck?.cards ?? [];

  // cartas filtradas pelo tipo selecionado
  const cardsOfType = useMemo(() => {
    return allCards.filter((c) => c.tipo === historicalType);
  }, [allCards, historicalType]);

  const drawHistoricalCards = () => {
    if (!cardsOfType.length) {
      alert("Não há cartas desse tipo no baralho.");
      return;
    }

    const drawCount = Math.max(1, Math.min(historicalDrawCount, cardsOfType.length));

    const usedIds = new Set(usedTempHistoricalByType[historicalType] ?? []);

    // disponíveis sem repetir (temporário)
    let available = cardsOfType.filter((c) => !usedIds.has(c.id));
    let picked = [];

    // pega primeiro do disponível (sem repetir até esgotar)
    if (available.length > 0) {
      const shuffled = shuffleArray(available);
      picked = shuffled.slice(0, Math.min(drawCount, shuffled.length));
    }

    // se ainda faltar, completa com cartas já usadas (permitindo repetição após esgotar)
    if (picked.length < drawCount) {
      const remainingNeeded = drawCount - picked.length;
      const notPicked = cardsOfType.filter((c) => !picked.some((p) => p.id === c.id));
      const shuffledOld = shuffleArray(notPicked);
      picked = [...picked, ...shuffledOld.slice(0, remainingNeeded)];
    }

    // atualiza usados temporários
    const newUsedIds = new Set(usedIds);
    picked.forEach((c) => newUsedIds.add(c.id));

    // se esgotou (todas as cartas do tipo já apareceram), reinicia temporário
    const allIds = new Set(cardsOfType.map((c) => c.id));
    const exhausted = [...allIds].every((id) => newUsedIds.has(id));

    setUsedTempHistoricalByType({
      ...usedTempHistoricalByType,
      [historicalType]: exhausted ? [] : [...newUsedIds],
    });

    // atualiza draw atual e histórico global
    setCurrentHistoricalDraw(picked);
    setGlobalHistoricalHistory([
      ...globalHistoricalHistory,
      ...picked.map((c) => ({
        ...c,
        drawn_at: new Date().toISOString(),
      })),
    ]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sorteio de Cartas Históricas</h2>

      <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <label>
          Tipo:
          <select
            value={historicalType}
            onChange={(e) => setHistoricalType(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantidade:
          <input
            type="number"
            min="1"
            max={cardsOfType.length || 1}
            value={historicalDrawCount}
            onChange={(e) => setHistoricalDrawCount(Number(e.target.value))}
            style={{ width: "70px", marginLeft: "8px" }}
          />
        </label>

        <button onClick={drawHistoricalCards} style={{ padding: "8px 14px" }}>
          Sortear
        </button>

        <span style={{ opacity: 0.8 }}>
          Cartas disponíveis neste tipo: <strong>{cardsOfType.length}</strong>
        </span>
      </div>

      {/* Draw atual */}
      {currentHistoricalDraw.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Sorteadas agora</h3>

          {currentHistoricalDraw.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <h3 style={{ margin: 0 }}>
                  {c.nome} <span style={{ fontSize: "0.85em", opacity: 0.7 }}>({c.id})</span>
                </h3>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold" }}>Peso: {c.peso_dramatico}</div>
                  <div style={{ fontSize: "0.9em", opacity: 0.8 }}>
                    {TYPE_LABELS[c.tipo] ?? c.tipo}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "8px" }}>
                <p style={{ margin: "6px 0" }}>
                  <strong>Inspiração:</strong>{" "}
                  {(c.inspiracao ?? []).length ? (c.inspiracao ?? []).join("; ") : "—"}
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong>Efeito em cena:</strong> {c.efeito_em_cena ?? "—"}
                </p>

                <div style={{ marginTop: "8px" }}>
                  <strong>Regras:</strong>
                  <ul style={{ marginTop: "6px" }}>
                    {(c.regras ?? []).map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Histórico global */}
      {globalHistoricalHistory.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <details style={{ cursor: "pointer" }}>
            <summary style={{ fontSize: "1.17em", fontWeight: "bold", marginBottom: "10px" }}>
              Exibir Histórico Global ({globalHistoricalHistory.length})
            </summary>

            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                border: "1px solid #eee",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {globalHistoricalHistory
                  .slice()
                  .reverse()
                  .map((c, index) => (
                    <details
                      key={`${c.id}-${index}`}
                      style={{ border: "1px solid #f0f0f0", padding: "8px", borderRadius: "5px" }}
                    >
                      <summary style={{ fontWeight: "500" }}>
                        <strong>{c.nome}</strong>{" "}
                        <small style={{ opacity: 0.8 }}>
                          — {TYPE_LABELS[c.tipo] ?? c.tipo} — peso {c.peso_dramatico}
                        </small>
                      </summary>

                      <div style={{ marginTop: "10px", fontSize: "0.95em", paddingLeft: "15px" }}>
                        <p>
                          <strong>Inspiração:</strong>{" "}
                          {(c.inspiracao ?? []).length ? (c.inspiracao ?? []).join("; ") : "—"}
                        </p>
                        <p>
                          <strong>Efeito em cena:</strong> {c.efeito_em_cena ?? "—"}
                        </p>
                        <p>
                          <strong>Regras:</strong>
                        </p>
                        <ul>
                          {(c.regras ?? []).map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
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
}
