import type { MetadataRoute } from "next";

const BASE_URL = "https://www.deanlennard.com";
const LAST_MODIFIED = new Date();

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  {
    path: "/nextjs-developer-uk",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/web-application-development-uk",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/technical-seo-services-uk",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/technical-delivery-consultant",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/unity-developer-uk",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/startup-full-stack-developer",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/improve-existing-website",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/freelance-developer-for-agencies",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/web-developer-staffordshire",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/web-designer-stafford",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/web-designer-stoke-on-trent",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/web-designer-cannock",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
