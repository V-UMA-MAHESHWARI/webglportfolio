import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Replace this domain with your final public URL before pushing to production
  const domain = "https://umamaheshwari.dev";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/", // Example of disallowed route
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
