import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/*/admin",
    },
    // TODO: aggiornare con il dominio definitivo una volta acquistato
    host: "https://nightkids-web.vercel.app",
  };
}
