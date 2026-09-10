import profileImage from "../assets/profilePicture.webp?url";

export const SITE_URL = "https://www.ashwingupta.dev/";
export const PERSON_ID = SITE_URL + "#ashwin-gupta";
export const WEBSITE_ID = SITE_URL + "#website";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  "name": "Ashwin Gupta",
  "url": SITE_URL,
  "image": new URL(profileImage, SITE_URL).href,
  "jobTitle": "AI Systems Engineer",
  "worksFor": { "@type": "Organization", "name": "SkanAI" },
  "alumniOf": [
    { "@type": "EducationalOrganization", "name": "BMS College of Engineering" }
  ],
  "knowsAbout": [
    "AI Systems Engineering",
    "Real-Time AI",
    "AI Infrastructure",
    "AI Observability",
    "Inference Routing",
    "Concurrency Architecture",
    "Physics-Informed Machine Learning",
    "Retrieval-Augmented Generation",
    "LLM Inference",
    "Distributed Systems",
    "AsyncIO Concurrency",
    "Vector Search",
    "Editorial Design",
    "Systems Design"
  ],
  "sameAs": [
    "https://github.com/ughshwin",
    "https://www.linkedin.com/in/ashwingupta3012/",
    "https://www.kaggle.com/ashwingupta3012"
  ],
  "email": "ashwingupta3012@gmail.com",
  "description": "AI Systems Engineer building the architecture around the model - inference routing, concurrency systems, and physics-informed ML - at the intersection of engineering rigour and design thinking.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bangalore",
    "addressCountry": "IN"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Ashwin Gupta - AI Systems Engineer",
  url: SITE_URL,
  inLanguage: "en",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
};

type ContentOptions = {
  type: "CreativeWork" | "SoftwareSourceCode" | "ScholarlyArticle" | "Article";
  name: string;
  url: string;
  description: string;
  codeRepository?: string;
  citation?: string;
  datePublished?: string;
  associatedMedia?: { "@type": "MediaObject"; contentUrl: string; encodingFormat: string; name: string };
};

// Publication dates are supplied explicitly, with provenance in article-publication.json.
export function contentSchemas({ type, name, url, description, ...details }: ContentOptions) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url + "#webpage",
      url, name, description,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": url + "#content" },
      breadcrumb: { "@id": url + "#breadcrumb" },
    },
    {
      "@context": "https://schema.org",
      "@type": type,
      "@id": url + "#content",
      name, url, description,
      ...(type === "Article" || type === "ScholarlyArticle" ? { headline: name } : {}),
      inLanguage: "en",
      author: { "@id": PERSON_ID },
      creator: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      mainEntityOfPage: { "@id": url + "#webpage" },
      ...details,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    },
  ];
}

export const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": SITE_URL + "#webpage",
  url: SITE_URL,
  name: "Ashwin Gupta - AI Systems Engineer",
  inLanguage: "en",
  mainEntity: { "@id": PERSON_ID },
  isPartOf: { "@id": WEBSITE_ID },
};
