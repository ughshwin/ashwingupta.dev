// Search crawlers and user-directed retrieval clients; training opt-ins are separate.
export const CRAWLERS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'Googlebot', 'bingbot'];

export function allowsPath(robots, agent, pathname) {
  const groups = [];
  let group;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === 'user-agent') {
      if (!value) continue;
      if (!group || group.startedRules) groups.push(group = {agents: [], rules: [], startedRules: false});
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(key)) {
      group.startedRules = true;
      if (value) group.rules.push({allow: key === 'allow', value});
    }
  }
  const name = agent.toLowerCase();
  const score = g => Math.max(-1, ...g.agents.map(a => a === '*' ? 0 : name.includes(a) ? a.length : -1));
  const best = Math.max(-1, ...groups.map(score));
  if (best < 0) return true;
  const matches = groups.filter(g => score(g) === best).flatMap(g => g.rules).filter(r => {
    const terminal = r.value.endsWith('$');
    const pattern = (terminal ? r.value.slice(0, -1) : r.value).split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    return new RegExp('^' + pattern + (terminal ? '$' : '')).test(pathname);
  }).sort((a,b) => b.value.replace(/[*$]/g,'').length - a.value.replace(/[*$]/g,'').length || Number(b.allow)-Number(a.allow));
  return matches[0]?.allow ?? true;
}
