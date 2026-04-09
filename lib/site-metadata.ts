import type { Metadata } from "next";

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  openGraph?: {
    title?: string;
    description?: string;
  };
};

export function buildPageMetadata({
  title,
  description,
  path,
  openGraph,
}: BuildPageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      siteName: "Dean Lennard",
      type: "website",
      url: path,
      title: openGraph?.title ?? title,
      description: openGraph?.description ?? description,
    },
  };
}
