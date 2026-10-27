import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/find-doctor", "/doctor/", "/doctors/", "/privacy", "/terms", "/medical-disclaimer", "/contact"],
      disallow: ["/patient-dashboard", "/doctor-dashboard", "/reception-dashboard", "/clinic-dashboard", "/admin"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://cureai.health"}/sitemap.xml`,
  };
}
