const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const httpClient = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = new Headers((options.headers as HeadersInit) || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...options, headers });
};

export const dataProvider = {
  // ─── getList ──────────────────────────────────────────────────
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const filter = params.filter || {};
    const filterStr = Object.entries(filter)
      .filter(([, v]) => v !== "" && v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");
    const url = `${API_URL}/api/${resource}?page=${page}&limit=${perPage}${filterStr ? `&${filterStr}` : ""}`;
    const response = await httpClient(url);
    const total = response.headers.get("X-Total-Count") || "0";
    const json = await response.json();
    const data = Array.isArray(json) ? json : json.data || [];
    return { data, total: parseInt(total, 10) };
  },

  // ─── getOne ───────────────────────────────────────────────────
  getOne: async (resource: string, params: any) => {
    const url = resource === "events"
      ? `${API_URL}/api/events/id/${params.id}`
      : `${API_URL}/api/${resource}/${params.id}`;
    const res = await httpClient(url);
    const json = await res.json();
    const item = json.data || json;
    return { data: { ...item, id: item.id || params.id } };
  },

  // ─── getMany ──────────────────────────────────────────────────
  getMany: async (resource: string, params: any) => {
    const results = await Promise.all(
      params.ids.map(async (id: any) => {
        const url = resource === "events"
          ? `${API_URL}/api/events/id/${id}`
          : `${API_URL}/api/${resource}/${id}`;
        const res = await httpClient(url);
        const json = await res.json();
        const item = json.data || json;
        return { ...item, id: item.id || id };
      })
    );
    return { data: results };
  },

  // ─── getManyReference ─────────────────────────────────────────
  getManyReference: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const response = await httpClient(
      `${API_URL}/api/${resource}?${params.target}=${params.id}&page=${page}&limit=${perPage}`
    );
    const total = response.headers.get("X-Total-Count") || "0";
    const json = await response.json();
    const data = Array.isArray(json) ? json : json.data || [];
    return { data, total: parseInt(total, 10) };
  },

  // ─── create ───────────────────────────────────────────────────
  create: async (resource: string, params: any) => {
    // Création complète (événement + salles + intervenants + sessions)
    if (
      resource === "events" &&
      (params.data.rooms || params.data.speakers || params.data.sessions)
    ) {
      const res = await httpClient(`${API_URL}/api/events/full`, {
        method: "POST",
        body: JSON.stringify(params.data),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      const json = await res.json();
      return { data: { ...json, id: json.id } };
    }

    const res = await httpClient(`${API_URL}/api/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const json = await res.json();
    return { data: { ...params.data, id: json.id || json.data?.id } };
  },

  // ─── update ───────────────────────────────────────────────────
  update: async (resource: string, params: any) => {
    const url = resource === "events"
      ? `${API_URL}/api/events/id/${params.id}`
      : `${API_URL}/api/${resource}/${params.id}`;
    const res = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const json = await res.json();
    const item = json.data || json;
    return { data: { ...item, id: item.id || params.id } };
  },

  // ─── updateMany ───────────────────────────────────────────────
  updateMany: async (resource: string, params: any) => {
    await Promise.all(
      params.ids.map((id: any) =>
        httpClient(`${API_URL}/api/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
          headers: new Headers({ "Content-Type": "application/json" }),
        })
      )
    );
    return { data: params.ids };
  },

  // ─── delete ───────────────────────────────────────────────────
  delete: async (resource: string, params: any) => {
    const url = resource === "events"
      ? `${API_URL}/api/events/id/${params.id}`
      : `${API_URL}/api/${resource}/${params.id}`;
    await httpClient(url, { method: "DELETE" });
    return { data: params.previousData };
  },

  // ─── deleteMany ───────────────────────────────────────────────
  deleteMany: async (resource: string, params: any) => {
    await Promise.all(
      params.ids.map((id: any) => {
        const url = resource === "events"
          ? `${API_URL}/api/events/id/${id}`
          : `${API_URL}/api/${resource}/${id}`;
        return httpClient(url, { method: "DELETE" });
      })
    );
    return { data: params.ids };
  },
};
