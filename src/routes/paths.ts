export const rootPaths = {
  defaultRoot: "",
  authRoot: "/auth",
  errorRoot: "/error",
  homeRoot: "/home",
  root: "/dp",
};

export default {
  // Auth paths
  sign_in: `${rootPaths.authRoot}/sign-in`,
  sign_up: `${rootPaths.authRoot}/sign-up`,
  forgot_password: `${rootPaths.authRoot}/forgot-password`,
  github_callback: `${rootPaths.authRoot}/github/callback`,

  // Main paths
  main: `${rootPaths.root}/dev-planner`,
  history: `${rootPaths.root}/dev-planner/history`,
  user_profile: `${rootPaths.root}/dev-planner/profile`,

  // Home paths
  landing_page: `${rootPaths.homeRoot}/landing-page`,

  // Error paths
  404: `${rootPaths.errorRoot}/404`,
  unauthorized: `/unauthorized`,
  forbidden: `/forbidden`,
  banned: `/banned`,
};
