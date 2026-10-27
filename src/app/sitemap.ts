import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://cureai.health";
  const routes = ["", "/find-doctor", "/ai-health-assistant", "/video-consult", "/services/health-checkups", "/services/tests-diagnostics", "/services/medicine-delivery", "/services/health-insurance", "/privacy", "/terms", "/medical-disclaimer", "/data-deletion", "/contact"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
