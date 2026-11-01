import { chromeCopy } from '../content/portfolio/chrome';
import { profile, schemaEmployment, alumni } from '../content/portfolio/profile';
import { currentEmployment } from '../content/portfolio/experience';
import publications from '../content/portfolio/publications.json';
import { projectById } from '../content/portfolio/catalog';
const paper = publications.ncisct2022;
import profileImage from "../assets/profilePicture.webp?url";

export const SITE_URL = profile.siteUrl;
export const PERSON_ID = SITE_URL + chromeCopy.schema.personFragment;
export const WEBSITE_ID = SITE_URL + "#website";
export const PAPER_URL = projectById(paper.projectId).href;
export const PAPER_ID = PAPER_URL + "#article";

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  "name": profile.name,
  "url": SITE_URL,
  "image": new URL(profileImage, SITE_URL).href,
  "jobTitle": currentEmployment.role,
  "worksFor": { "@type": "Organization", "name": currentEmployment.company },
  "memberOf": schemaEmployment.map(entry => ({ "@type": "EmployeeRole", roleName: entry.role, startDate: entry.start, ...(entry.end ? {endDate: entry.end} : {}), memberOf: {"@type":"Organization",name:entry.company} })),
  "alumniOf": alumni.map(entry => ({"@type":"EducationalOrganization",name:entry.company})),
  "knowsAbout": profile.knowsAbout,
  "sameAs": Object.values(profile.socials),
  "email": profile.email,
  "description": profile.description,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": profile.location.city,
    "addressCountry": profile.location.countryCode
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: chromeCopy.schema.profileName,
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

// Publication dates are supplied explicitly, with provenance in content/portfolio/articles.json.
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
        { "@type": "ListItem", position: 1, name: chromeCopy.schema.homeLabel, item: SITE_URL },
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
  name: chromeCopy.schema.profileName,
  inLanguage: "en",
  mainEntity: { "@id": PERSON_ID },
  isPartOf: { "@id": WEBSITE_ID },
  citation: { "@id": PAPER_ID },
};

// Publisher-indexed title, authors, issue and month; no invented publication day or DOI.
export const paperSchema = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "@id": PAPER_ID,
  name: paper.title,
  headline: paper.title,
  url: PAPER_URL,
  datePublished: paper.datePublished,
  inLanguage: "en",
  author: [{ "@id": PERSON_ID }, ...paper.coauthors.map(name => ({"@type":"Person",name}))],
  isPartOf: {
    "@type": "PublicationIssue",
    name: paper.issue,
    isPartOf: {
      "@type": "PublicationVolume",
      volumeNumber: paper.volume,
      isPartOf: {
        "@type": "Periodical",
        name: paper.journal,
        issn: paper.issn
      }
    }
  },
  encoding: { "@type": "MediaObject", contentUrl: PAPER_URL, encodingFormat: "application/pdf" }
};
