import { getPublicSiteUrl } from "@/lib/public-site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

const siteUrl = getPublicSiteUrl();

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Dean Lennard",
  url: siteUrl,
  email: "dean@deanlennard.com",
  jobTitle: "Freelance Full-Stack Developer & Technical Delivery Specialist",
  worksFor: {
    "@id": `${siteUrl}/#organization`,
  },
  sameAs: ["https://www.linkedin.com/in/deanlennard/"],
  knowsAbout: [
    "Next.js development",
    "Full-stack web application development",
    "Technical SEO",
    "Core Web Vitals",
    "Technical delivery",
    "Project delivery",
    "MongoDB",
    "Node.js",
    "Performance optimisation",
  ],
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Outbreak LTD",
  url: siteUrl,
  email: "dean@deanlennard.com",
  legalName: "Outbreak LTD",
  address: {
    "@type": "PostalAddress",
    streetAddress: "241 Tixall Road",
    addressLocality: "Stafford",
    postalCode: "ST16 3XS",
    addressCountry: "GB",
  },
  sameAs: ["https://www.linkedin.com/in/deanlennard/"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Dean Lennard",
  url: siteUrl,
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
  about: {
    "@id": `${siteUrl}/#person`,
  },
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}

export function buildServiceSchema(input: {
  name: string;
  path: string;
  description: string;
  serviceType: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${new URL(input.path, siteUrl).toString()}#service`,
    name: input.name,
    url: new URL(input.path, siteUrl).toString(),
    description: input.description,
    serviceType: input.serviceType,
    areaServed: input.areaServed ?? "United Kingdom",
    provider: {
      "@id": `${siteUrl}/#person`,
    },
  };
}

export function buildCollectionPageSchema(input: {
  name: string;
  path: string;
  description: string;
  items: Array<{ name: string; path: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    url: new URL(input.path, siteUrl).toString(),
    description: input.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: new URL(item.path, siteUrl).toString(),
      })),
    },
    author: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function buildFaqSchema(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildSoftwareApplicationSchema(input: {
  name: string;
  path: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    url: new URL(input.path, siteUrl).toString(),
    description: input.description,
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem ?? "Web",
    author: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}
