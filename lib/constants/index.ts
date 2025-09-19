export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  EXPLORE: "/explore",
  EVOLUTION: "/evolution",
  MARKET: "/market",
  VAULTS: "/vaults",
  AUCTIONS: "/auctions",
  PORTFOLIO: "/portfolio",
  CREATOR: (id: string) => `/creator/${id}`,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  CREATORS: {
    LIST: "/api/creators",
    DETAIL: (id: string) => `/api/creators/${id}`,
    SUBSCRIBE: (id: string) => `/api/creators/${id}/subscribe`,
  },
  MARKET: {
    STOCKS: "/api/market/stocks",
    TRADE: "/api/market/trade",
    PORTFOLIO: "/api/market/portfolio",
  },
} as const;
