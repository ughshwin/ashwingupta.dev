import { resolveCopy } from './copy';
import about from './copy/About.json';
import experience from './copy/ExperienceTimeline.json';
import impact from './copy/Impact.json';
import featured from './copy/Featured.json';
import projects from './copy/Projects.json';
import recommendations from './copy/Recommendations.json';
import skills from './copy/Skills.json';
import contact from './copy/Contact.json';

export const homeContents = resolveCopy([
  {id:'about',title:about.headline},
  {id:'experience',title:experience.the_trajectory},
  {id:'impact',title:impact.proof_not_promises},
  {id:'featured',title:featured.what_the_arc_produced},
  {id:'projects',title:projects.systems_that_had_to_hold},
  {id:'recommendations',title:recommendations.in_their_words},
  {id:'stack',title:skills.heading},
  {id:'contact',title:contact.hard_problems_welcome},
]);
