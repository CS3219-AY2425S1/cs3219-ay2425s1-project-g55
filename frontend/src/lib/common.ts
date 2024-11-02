export const BACKEND_URL_BASE = "http://localhost:8080";
export const BACKEND_WS_BASE = "ws://localhost:8080";

export const BACKEND_URL_AUTH = `${BACKEND_URL_BASE}/api/auth`;
export const BACKEND_URL_USERS = `${BACKEND_URL_BASE}/api/users`;
export const BACKEND_URL_QUESTIONS = `${BACKEND_URL_BASE}/api/questions`;
export const BACKEND_URL_HISTORY = `${BACKEND_URL_BASE}/api/history`;

// export const BACKEND_URL_ROOM = `${BACKEND_URL_BASE}/api/rooms`;
// export const BACKEND_WEBSOCKET_ROOM = `${BACKEND_WS_BASE}/ws/rooms`;
export const BACKEND_URL_ROOM = "http://localhost:8083/api/rooms";
export const BACKEND_WEBSOCKET_ROOM = "ws://localhost:8083/ws/rooms";

export const BACKEND_URL_MATCHING = `${BACKEND_URL_BASE}/api/matching`;
export const BACKEND_WEBSOCKET_MATCHING = `${BACKEND_WS_BASE}/ws/matching`;
