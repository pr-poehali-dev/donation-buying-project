const URLS = {
  auth: "https://functions.poehali.dev/4a7e1188-b42d-4e3d-9fa6-17e5dae7bd56",
  admin: "https://functions.poehali.dev/66c6a96b-87c3-4a18-a89a-99c826666e2c",
};

function getToken(): string | null {
  return localStorage.getItem("dz_token");
}

async function callAuth(action: string, data: Record<string, unknown> = {}) {
  const token = getToken();
  const res = await fetch(URLS.auth, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, ...data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Ошибка");
  return json;
}

async function callAdmin(action: string, data: Record<string, unknown> = {}) {
  const token = getToken();
  const res = await fetch(URLS.admin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, ...data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Ошибка");
  return json;
}

export const api = {
  register: (username: string, email: string, password: string) =>
    callAuth("register", { username, email, password }),

  login: (email: string, password: string) =>
    callAuth("login", { email, password }),

  me: () => callAuth("me"),

  logout: () => callAuth("logout"),

  getPackages: () => callAdmin("get_packages"),

  updatePackage: (id: number, name: string) =>
    callAdmin("update_package", { id, name }),

  getPromos: () => callAdmin("get_promos"),

  createPromo: (code: string, discount_percent: number, usage_limit?: number) =>
    callAdmin("create_promo", { code, discount_percent, usage_limit }),

  updatePromo: (id: number, data: { active?: boolean; discount_percent?: number }) =>
    callAdmin("update_promo", { id, ...data }),

  getUsers: () => callAdmin("get_users"),

  setRank: (user_id: number, rank: string) =>
    callAdmin("set_rank", { user_id, rank }),

  checkPromo: (code: string) =>
    callAdmin("check_promo", { code }),
};
