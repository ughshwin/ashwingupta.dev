const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/** Preserve authored month/day precision without UTC timezone shifts. */
export function formatContentDate(value, precision = 'authored') {
  const [year, month, day] = value.split('-').map(Number);
  return `${precision !== 'month' && day ? day + ' ' : ''}${months[month - 1]} ${year}`;
}
export function localDate(value) {
  const [year, month, day = 1] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}
export function experiencePeriod(entry, precision = 'authored', separator = ' – ') {
  return `${formatContentDate(entry.start, precision)}${separator}${entry.end === null ? 'Present' : formatContentDate(entry.end, precision)}`;
}
export function selectCurrentEmployment(entries) {
  const current = entries.filter(e => e.track === 'professional' && e.end === null).sort((a,b) => b.start.localeCompare(a.start))[0];
  if (!current) throw new Error('Portfolio requires a current professional role.');
  return current;
}
export function redirectRoutes(entries) {
  return Object.fromEntries(Object.entries(entries).filter(([,entry]) => entry.redirect).map(([id,entry]) => [id,entry.href]));
}

/** Shared reference context for server rendering, browser views and build tools. */
export function buildContentFacts({profile, experience, projects, articles = {}, kaggle = {}, publications = {}, chrome = {}, editorial = {}}) {
  const experienceById = Object.fromEntries(experience.map(entry => [entry.id, {
    ...entry, period:experiencePeriod(entry), startYear:entry.start.slice(0,4), endYear:entry.end?.slice(0,4) ?? null,
  }]));
  const currentId = selectCurrentEmployment(experience).id;
  return {
    profile: profileIdentity(profile),
    origin: new URL(profile.siteUrl).origin,
    projects,
    articles: selectArticles(articles, profile),
    experience: experienceById,
    currentEmployment: experienceById[currentId],
    previousEmployment: experienceById[profile.previousEmploymentId],
    kaggle,
    publications,
    chrome,
    editorial,
  };
}

export function profileIdentity(profile) {
  const [firstName, ...remaining] = profile.name.trim().split(/\s+/);
  return {...profile, firstName, lastName: remaining.join(' '), initials:[firstName,...remaining].map(part=>part[0]).join('')};
}

/** Article dates and titles are projections of the authored publication facts. */
export function selectArticles(records, profile) {
  return Object.fromEntries(Object.entries(records).map(([id, article]) => [id, {
    ...article,
    date: new Intl.DateTimeFormat('en-US', {month:'long',year:'numeric',timeZone:'UTC'})
      .format(new Date(article.datePublished + 'T00:00:00Z')),
    href: '/articles/' + article.slug,
    pageTitle: `${article.title} - ${profile.name}`,
    description: article.descriptionTemplate ?? article.description ?? article.excerpt,
  }]));
}
