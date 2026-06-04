const SESSION_KEY = "sirat_sid";
const VISITOR_KEY = "sirat_visitor";
const QUEUE_KEY = "sirat_event_queue";
const SESSION_START_KEY = "sirat_session_start";

const API_BASE = (() => {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return import.meta.env.VITE_API_BASE_URL || "";
    }
  } catch {}
  return "";
})();

const newSessionId = () => {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  const r2 = Math.random().toString(36).slice(2, 10);
  return `v_${t}_${r}${r2}`;
};

const safeStorage = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
  session: {
    get(k) {
      try {
        return sessionStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        sessionStorage.setItem(k, v);
      } catch {}
    },
    del(k) {
      try {
        sessionStorage.removeItem(k);
      } catch {}
    },
  },
};

const send = (path, body, useBeacon = false) => {
  let cleanBase = API_BASE.replace(/\/$/, ""); // Remove trailing slash
  if (!cleanBase) {
    cleanBase = "http://localhost:5000/api";
  }
  // Ensure the URL ends with /api/track
  const baseEndpoint = cleanBase.endsWith("/api") ? `${cleanBase}/track` : `${cleanBase}/api/track`;
  const url = `${baseEndpoint}${path}`;

  if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([JSON.stringify(body || {})], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return Promise.resolve(true);
    } catch {}
  }

  if (typeof fetch === "undefined") return Promise.resolve(false);

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
    keepalive: true,
    credentials: "omit",
  }).catch(() => null);
};

const flushQueue = async () => {
  const raw = safeStorage.session.get(QUEUE_KEY);
  if (!raw) return;
  let events = [];
  try {
    events = JSON.parse(raw);
  } catch {
    safeStorage.session.del(QUEUE_KEY);
    return;
  }
  if (!Array.isArray(events) || events.length === 0) {
    safeStorage.session.del(QUEUE_KEY);
    return;
  }
  const sessionId = state.sessionId;
  if (!sessionId) return;

  const res = await send("/batch", { sessionId, events: events.slice(0, 50) });
  if (res && res.ok) {
    safeStorage.session.del(QUEUE_KEY);
  }
};

const enqueue = (event) => {
  try {
    const raw = safeStorage.session.get(QUEUE_KEY);
    let queue = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(queue)) queue = [];
    queue.push(event);
    if (queue.length > 30) queue = queue.slice(-30);
    safeStorage.session.set(QUEUE_KEY, JSON.stringify(queue));
  } catch {}
};

const state = {
  sessionId: null,
  visitor: null,
  ready: false,
  startTime: Date.now(),
  userId: null,
  isLoggedIn: false,
};

const init = async () => {
  if (state.ready) return state;
  state.ready = true;

  let sid = safeStorage.get(SESSION_KEY);
  let visitorJson = safeStorage.get(VISITOR_KEY);

  if (!sid) {
    sid = newSessionId();
    safeStorage.set(SESSION_KEY, sid);
  }
  if (visitorJson) {
    try {
      state.visitor = JSON.parse(visitorJson);
    } catch {
      state.visitor = null;
    }
  }
  state.sessionId = sid;

  const stored = safeStorage.session.get(SESSION_START_KEY);
  if (stored) {
    state.startTime = parseInt(stored, 10) || Date.now();
  } else {
    state.startTime = Date.now();
    safeStorage.session.set(SESSION_START_KEY, String(state.startTime));
  }

  const screen = typeof window !== "undefined" && window.screen
    ? `${window.screen.width}x${window.screen.height}`
    : "";

  try {
    const res = await send("/session", {
      sessionId: sid,
      landingPage: typeof window !== "undefined" ? window.location.pathname + window.location.search : "/",
      screenResolution: screen,
      language: typeof navigator !== "undefined" ? (navigator.language || navigator.userLanguage || "") : "",
    });
    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      if (json && json.data) {
        state.visitor = json.data;
        safeStorage.set(VISITOR_KEY, JSON.stringify(json.data));
        if (json.data.sessionId) {
          state.sessionId = json.data.sessionId;
          safeStorage.set(SESSION_KEY, json.data.sessionId);
        }
      }
    }
  } catch {}

  flushQueue();

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      const durationMs = Date.now() - state.startTime;
      send("/event", {
        type: "session_end",
        sessionId: state.sessionId,
        durationMs,
      }, true);
    });

    window.addEventListener("online", () => {
      flushQueue();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && state.sessionId) {
        send("/event", {
          type: "session_start",
          sessionId: state.sessionId,
        });
      }
    });
  }

  return state;
};

const identify = (user) => {
  if (user && user.id) {
    state.userId = user.id;
    state.isLoggedIn = true;
  } else if (user === null) {
    state.userId = null;
    state.isLoggedIn = false;
  }
};

const pageview = (path, title) => {
  if (!state.sessionId) {
    enqueue({ type: "pageview", path, page: title, timestamp: Date.now() });
    return;
  }
  send("/pageview", {
    sessionId: state.sessionId,
    path: path || (typeof window !== "undefined" ? window.location.pathname : "/"),
    title: title || (typeof document !== "undefined" ? document.title : ""),
  });
};

const event = (type, payload = {}) => {
  if (!type) return;
  const enriched = {
    type,
    sessionId: state.sessionId,
    page: typeof document !== "undefined" ? document.title : "",
    path: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
    ...payload,
  };
  if (!state.sessionId) {
    enqueue(enriched);
    return;
  }
  send("/event", enriched);
};

const track = {
  init,
  identify,
  pageview,
  event,
  flushQueue,
  getSessionId: () => state.sessionId,
  getVisitor: () => state.visitor,
  isReady: () => state.ready,
};

export default track;
