/* ------------------------------------------------------------------ */
/* js/local-plans.js – lokale Speicherhülle für mehrere benannte Pläne  */
/* (localStorage). Reine Kodier-/Validierungs-/Transform-Logik, kein   */
/* React, kein DOM-/localStorage-Zugriff hier (der bleibt in app.jsx,   */
/* analog zu js/share-link.js, das window.history/Clipboard ebenfalls   */
/* nicht selbst anfasst). Kein Modulsystem (siehe CLAUDE.md, Abschnitt  */
/* „Architektur/Module") – öffentliche Oberfläche:                      */
/* window.FREILOTSE.localPlans.                                         */
/*                                                                       */
/* Ein gespeicherter Plan enthält als "payload" exakt das Objekt, das    */
/* buildSharePayload()/validateSharePayload() (js/share-link.js) auch    */
/* für den Share-Link verwenden ({version, state}) – dieses Modul prüft  */
/* nur die Speicher-HÜLLE (ist das überhaupt plan-förmig), nicht den     */
/* Inhalt; die inhaltliche Validierung (Enums, Bundesland-Gültigkeit     */
/* usw.) übernimmt weiterhin validateSharePayload() beim Laden.          */
/*                                                                       */
/* STORAGE_KEY versioniert nur die Form dieser Speicher-Hülle            */
/* ({plans, activePlanId}) und ist absichtlich unabhängig von            */
/* SHARE_VERSION (der Payload-Hülle je Plan).                            */
/* ------------------------------------------------------------------ */
(function () {
  "use strict";

  const STORAGE_KEY = "freilotse.localPlans.v1";
  const MAX_PLANS = 20;

  function makeId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function makePlan(name, payload) {
    const now = Date.now();
    return { id: makeId(), name, createdAt: now, updatedAt: now, payload };
  }

  function findPlan(store, id) {
    return store.plans.find((p) => p.id === id);
  }

  // Prüft nur die Speicher-HÜLLE, nicht den Inhalt von payload.state –
  // das übernimmt validateSharePayload() beim tatsächlichen Laden eines
  // Plans. Wirft nie; verwirft ausschließlich nicht plan-förmige Einträge
  // und kappt die Anzahl bei MAX_PLANS.
  function isPlanShaped(p) {
    return (
      p && typeof p === "object" &&
      typeof p.id === "string" && p.id.length > 0 &&
      typeof p.name === "string" &&
      Number.isFinite(p.createdAt) && Number.isFinite(p.updatedAt) &&
      p.payload && typeof p.payload === "object" && typeof p.payload.state === "object"
    );
  }

  function parseStore(raw) {
    if (raw == null) return { plans: [], activePlanId: null, corrupted: false };
    let obj;
    try { obj = JSON.parse(raw); } catch (e) { return { plans: [], activePlanId: null, corrupted: true }; }
    if (!obj || typeof obj !== "object" || !Array.isArray(obj.plans)) {
      return { plans: [], activePlanId: null, corrupted: true };
    }
    const cleanedPlans = obj.plans.filter(isPlanShaped);
    const corrupted = cleanedPlans.length !== obj.plans.length;
    const capped = cleanedPlans.slice(0, MAX_PLANS);
    const activePlanId = typeof obj.activePlanId === "string" &&
      capped.some((p) => p.id === obj.activePlanId) ? obj.activePlanId : null;
    return { plans: capped, activePlanId, corrupted: corrupted || capped.length !== cleanedPlans.length };
  }

  function serializeStore(store) {
    return JSON.stringify({ plans: store.plans, activePlanId: store.activePlanId });
  }

  function addPlan(store, plan) {
    return { ...store, plans: [...store.plans, plan] };
  }

  function updatePlanPayload(store, id, payload) {
    return {
      ...store,
      plans: store.plans.map((p) => (p.id === id ? { ...p, payload, updatedAt: Date.now() } : p)),
    };
  }

  function renamePlan(store, id, name) {
    return {
      ...store,
      plans: store.plans.map((p) => (p.id === id ? { ...p, name, updatedAt: Date.now() } : p)),
    };
  }

  function removePlan(store, id) {
    return {
      ...store,
      plans: store.plans.filter((p) => p.id !== id),
      activePlanId: store.activePlanId === id ? null : store.activePlanId,
    };
  }

  function setActivePlanId(store, id) {
    return { ...store, activePlanId: id };
  }

  window.FREILOTSE = window.FREILOTSE || {};
  window.FREILOTSE.localPlans = {
    STORAGE_KEY, MAX_PLANS,
    makeId, makePlan, findPlan,
    parseStore, serializeStore,
    addPlan, updatePlanPayload, renamePlan, removePlan, setActivePlanId,
  };
})();
