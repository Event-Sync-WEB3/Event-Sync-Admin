import simpleRestProvider from "ra-data-simple-rest";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const httpClient = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = new Headers((options.headers as HeadersInit) || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...options, headers });
};

// Helper: find event slug by id
const getEventSlug = async (id: any): Promise<string> => {
  const listRes = await httpClient(`${API_URL}/api/events?page=1&limit=100`);
  const listJson = await listRes.json();
  const items = Array.isArray(listJson) ? listJson : listJson.data || [];
  const item = items.find((i: any) => i.id === id);
  return item?.slug || id;
};

export const dataProvider = {
  ...simpleRestProvider(API_URL + "/api", httpClient),

  // ─── getList ──────────────────────────────────────────────────
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const response = await httpClient(
      `${API_URL}/api/${resource}?page=${page}&limit=${perPage}`
    );
    const total = response.headers.get("X-Total-Count") || "0";
    const json = await response.json();
    const data = Array.isArray(json) ? json : json.data || [];
    return { data, total: parseInt(total, 10) };
  },

  // ─── getOne ───────────────────────────────────────────────────
  getOne: async (resource: string, params: any) => {
    if (resource === "events") {
      const slug = await getEventSlug(params.id);
      const res = await httpClient(`${API_URL}/api/events/${slug}`);
      const json = await res.json();
      const item = json.data || json;
      return { data: { ...item, id: item.id || params.id } };
    }
    const res = await httpClient(`${API_URL}/api/${resource}/${params.id}`);
    const json = await res.json();
    const item = json.data || json;
    return { data: { ...item, id: item.id || params.id } };
  },

  // ─── getMany ──────────────────────────────────────────────────
  getMany: async (resource: string, params: any) => {
    const results = await Promise.all(
      params.ids.map(async (id: any) => {
        const res = await httpClient(`${API_URL}/api/${resource}/${id}`);
        const json = await res.json();
        const item = json.data || json;
        return { ...item, id: item.id || id };
      })
    );
    return { data: results };
  },

  // ─── create ───────────────────────────────────────────────────
  create: async (resource: string, params: any) => {
    // Full event creation (with rooms, speakers, sessions)
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
    let updateId = params.id;
    if (resource === "events") {
      updateId = await getEventSlug(params.id);
    }
    const res = await httpClient(`${API_URL}/api/${resource}/${updateId}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const json = await res.json();
    const item = json.data || json;
    return { data: { ...item, id: item.id || params.id } };
  },

  // ─── delete ───────────────────────────────────────────────────
  delete: async (resource: string, params: any) => {
    let deleteId = params.id;
    if (resource === "events") {
      deleteId = await getEventSlug(params.id);
    }
    await httpClient(`${API_URL}/api/${resource}/${deleteId}`, {
      method: "DELETE",
    });
    return { data: params.previousData };
  },

  // ─── deleteMany ───────────────────────────────────────────────
  deleteMany: async (resource: string, params: any) => {
    await Promise.all(
      params.ids.map((id: any) =>
        httpClient(`${API_URL}/api/${resource}/${id}`, { method: "DELETE" })
      )
    );
    return { data: params.ids };
  },
};
