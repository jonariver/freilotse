/* ------------------------------------------------------------------ */
/* js/puzzle-stats.js – lokale Speicherhülle für die Statistik des      */
/* "Brückentage-Rätsels des Tages" (Streak, gespielte Rätsel, Verlauf). */
/* Reine Kodier-/Validierungs-/Transform-Logik, kein React, kein        */
/* localStorage-Zugriff hier (bleibt in jsx/puzzle-page.jsx, analog zu  */
/* js/local-plans.js). Kein Modulsystem (siehe CLAUDE.md, Abschnitt     */
/* „Architektur/Module") – öffentliche Oberfläche:                      */
/* window.FREILOTSE.puzzleStats.                                        */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";

  const STORAGE_KEY = "freilotse.puzzleStats.v1";
  const MAX_HISTORY = 30;

  function defaultStats() {
    return { lastPlayedDateKey: null, currentStreak: 0, maxStreak: 0, gamesPlayed: 0, history: [] };
  }

  function isHistoryEntryShaped(e) {
    return (
      e && typeof e === "object" &&
      typeof e.dateKey === "string" && Number.isFinite(e.puzzleNumber) &&
      Number.isFinite(e.score) && Number.isFinite(e.optimal) && typeof e.emojiGrid === "string"
    );
  }

  function isStatsShaped(obj) {
    return (
      obj && typeof obj === "object" &&
      (obj.lastPlayedDateKey === null || typeof obj.lastPlayedDateKey === "string") &&
      Number.isFinite(obj.currentStreak) && Number.isFinite(obj.maxStreak) &&
      Number.isFinite(obj.gamesPlayed) && Array.isArray(obj.history)
    );
  }

  // Wirft nie; verwirft nicht plan-förmige Verlaufseinträge, kappt bei MAX_HISTORY.
  function parseStats(raw) {
    if (raw == null) return { stats: defaultStats(), corrupted: false };
    let obj;
    try { obj = JSON.parse(raw); } catch (e) { return { stats: defaultStats(), corrupted: true }; }
    if (!isStatsShaped(obj)) return { stats: defaultStats(), corrupted: true };
    const cleanedHistory = obj.history.filter(isHistoryEntryShaped).slice(-MAX_HISTORY);
    const corrupted = cleanedHistory.length !== obj.history.length;
    return { stats: { ...obj, history: cleanedHistory }, corrupted };
  }

  function serializeStats(stats) {
    return JSON.stringify(stats);
  }

  // Reine Y-M-D-Arithmetik (UTC-Komponenten), unabhängig von Zeitzone/Uhrzeit.
  function yesterdayKey(dateKey) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d) - 86400000);
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
  }

  function hasPlayedToday(stats, dateKey) {
    return stats.lastPlayedDateKey === dateKey;
  }

  function getTodayResult(stats, dateKey) {
    return stats.history.find((h) => h.dateKey === dateKey) || null;
  }

  // entry: { dateKey, puzzleNumber, score, optimal, emojiGrid }. Rein, gibt
  // neue stats zurück. Idempotent: ein zweiter Aufruf für denselben Tag
  // ändert nichts (verhindert doppeltes Streak-Hochzählen bei Doppel-Klick).
  function recordResult(stats, entry) {
    if (hasPlayedToday(stats, entry.dateKey)) return stats;
    const continued = stats.lastPlayedDateKey === yesterdayKey(entry.dateKey);
    const currentStreak = continued ? stats.currentStreak + 1 : 1;
    const history = [...stats.history, entry].slice(-MAX_HISTORY);
    return {
      lastPlayedDateKey: entry.dateKey,
      currentStreak,
      maxStreak: Math.max(stats.maxStreak, currentStreak),
      gamesPlayed: stats.gamesPlayed + 1,
      history,
    };
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.puzzleStats = {
    STORAGE_KEY, MAX_HISTORY,
    defaultStats, parseStats, serializeStats,
    yesterdayKey, hasPlayedToday, getTodayResult, recordResult,
  };
})();
