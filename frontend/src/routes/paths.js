export const PATHS = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  monitor: (id = ":id") => `/dashboard/monitors/${id}`,
};
