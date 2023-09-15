const { flatRoutes } = require("remix-flat-routes");
const path = require("node:path");

const stage = process.env.STAGE || "dev";
const pathPrefix = `/${stage}`;

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  publicPath: `${pathPrefix}/_static/build/`,
  assetsBuildDirectory: `public${pathPrefix}/build/`,
  postcss: true,
  ...(process.env.NODE_ENV === "development" ? null : {
    server: "server.ts",
    serverBuildPath: "server/index.js",
    // serverModuleFormat: "esm",
  }),
  tailwind: true,
  routes: (defineRoutes) => {
    const mountedRoutes = flatRoutes("routes", defineRoutes, { basePath: pathPrefix });
    const customRoutes = defineRoutes((route) => {
      if (process.env.NODE_ENV === "production") return {};

      console.log("⚠️  Test routes enabled.");

      const appDir = path.join(process.cwd(), "app");

      route(
        "__tests/create-user",
        path.relative(appDir, "cypress/support/test-routes/create-user.ts"),
      );
    });

    return {
      ...mountedRoutes,
      ...customRoutes,
    }
  },
};
