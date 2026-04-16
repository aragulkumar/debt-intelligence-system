import axios from "axios";

// We call this from components that have access to Clerk's useAuth
// The token is injected via setAuthToken before each request
let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (_authToken) {
    config.headers.Authorization = `Bearer ${_authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// ─── Debts ───────────────────────────────────────────────────────────────────
export const debtsApi = {
  getAll: () => api.get("/debts").then((r) => r.data),
  getSummary: () => api.get("/debts/summary").then((r) => r.data),
  getOne: (id: string) => api.get(`/debts/${id}`).then((r) => r.data),
  create: (body: unknown) => api.post("/debts", body).then((r) => r.data),
  update: (id: string, body: unknown) =>
    api.patch(`/debts/${id}`, body).then((r) => r.data),
  remove: (id: string) => api.delete(`/debts/${id}`).then((r) => r.data),
};

// ─── Repayment ───────────────────────────────────────────────────────────────
export const repaymentApi = {
  calculate: (body: unknown) =>
    api.post("/repayment/calculate", body).then((r) => r.data),
  simulate: (body: unknown) =>
    api.post("/repayment/simulate", body).then((r) => r.data),
};

// ─── Health Score ─────────────────────────────────────────────────────────────
export const healthApi = {
  getScore: () => api.get("/health-score").then((r) => r.data),
  getHistory: () => api.get("/health-score/history").then((r) => r.data),
  getSuggestions: () => api.get("/health-score/suggestions").then((r) => r.data),
};

// ─── Settings ────────────────────────────────────────────────────────────────
export const settingsApi = {
  getDangerZone: () => api.get("/settings/danger-zone").then((r) => r.data),
  updateDangerZone: (body: unknown) =>
    api.patch("/settings/danger-zone", body).then((r) => r.data),
};

// ─── Rules ───────────────────────────────────────────────────────────────────
export const rulesApi = {
  getAll: () => api.get("/rules").then((r) => r.data),
  create: (body: unknown) => api.post("/rules", body).then((r) => r.data),
  remove: (id: string) => api.delete(`/rules/${id}`).then((r) => r.data),
};

// ─── AI Coach ────────────────────────────────────────────────────────────────
export const coachApi = {
  chat: (body: unknown) => api.post("/ai/chat", body).then((r) => r.data),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminApi = {
  getRiskHeatmap: () => api.get("/admin/risk-heatmap").then((r) => r.data),
  getBnplAnalytics: () => api.get("/admin/bnpl-analytics").then((r) => r.data),
  getRepaymentSuccess: () =>
    api.get("/admin/repayment-success").then((r) => r.data),
};

export default api;
