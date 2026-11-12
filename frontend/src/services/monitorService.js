import { request } from "./httpClient";

// The list endpoint currently returns monitors under `message`; accept either key.
const toArray = (res) =>
  Array.isArray(res?.data) ? res.data : Array.isArray(res?.message) ? res.message : [];

const toPayload = ({ name, url, interval }) => ({ name, url, interval: Number(interval) });

// Maps to src/routes/monitor.routes.js on the API (mounted at /api/monitors).
export const monitorService = {
  async list() {
    return toArray(await request("/monitors"));
  },

  async create(input) {
    return (await request("/monitors", { method: "POST", body: toPayload(input) })).data;
  },

  async update(id, input) {
    return (await request(`/monitors/${id}`, { method: "PUT", body: toPayload(input) })).data;
  },

  async remove(id) {
    return (await request(`/monitors/${id}`, { method: "DELETE" })).data;
  },

  /** Runs a check immediately and stores the result. */
  async checkNow({ id, url }) {
    return (await request("/monitors/check", { method: "POST", body: { monitorId: id, url } })).data;
  },

  async checks(id, { page = 1, limit = 20, status } = {}) {
    const res = await request(`/monitors/${id}/checks`, { query: { page, limit, status } });
    return {
      checks: res.checks ?? [],
      total: res.total ?? 0,
      totalPages: Math.max(1, res.totalPages ?? 1),
    };
  },
};
