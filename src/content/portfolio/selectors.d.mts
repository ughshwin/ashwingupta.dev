type DatedEntry = { start: string; end: string | null };
type ExperienceFacts<T> = T & {period: string; startYear: string; endYear: string | null};
export function formatContentDate(value: string, precision?: string): string;
export function localDate(value: string): Date;
export function experiencePeriod(entry: DatedEntry, precision?: string, separator?: string): string;
export function selectCurrentEmployment<T extends DatedEntry & {track: string}>(entries: T[]): T;
export function redirectRoutes(entries: Record<string, {redirect?: boolean; href: string}>): Record<string, string>;
export function profileIdentity<T extends {name: string}>(profile: T): T & {firstName: string; lastName: string; initials: string};
type ArticleSource = {slug: string; title: string; datePublished: string; excerpt: string; description?: string; descriptionTemplate?: string};
export function selectArticles<T extends Record<string, ArticleSource>>(records: T, profile: {name: string}): {
  [Id in keyof T]: T[Id] & {date: string; href: string; pageTitle: string; description: string};
};
export function buildContentFacts<
  P extends {name: string; siteUrl: string; previousEmploymentId?: string},
  E extends DatedEntry & {id: string; track: string},
  J, A = Record<string, unknown>, K = Record<string, unknown>, U = Record<string, unknown>, C = Record<string, unknown>, D = Record<string, unknown>
>(data: {profile: P; experience: E[]; projects: J; articles?: A; kaggle?: K; publications?: U; chrome?: C; editorial?: D}): {
  profile: P & {firstName: string; lastName: string; initials: string}; origin: string; projects: J;
  articles: A & Record<string, {date: string; href: string; pageTitle: string; description: string}>; experience: Record<string, ExperienceFacts<E>>; currentEmployment: ExperienceFacts<E>; previousEmployment?: ExperienceFacts<E>;
  kaggle: K; publications: U; chrome: C; editorial: D;
};
