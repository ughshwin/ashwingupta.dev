import { contactCopy } from '../content/portfolio/contact';
import { chromeCopy, formatChrome } from '../content/portfolio/chrome';
import { getKaggleFreshness } from '../content/portfolio/impact';
import { formatAchievementMetrics } from '../content/portfolio/achievements';
import { profile } from '../content/portfolio/profile';
import { documentPaths, sectionIds } from './edition-routes';
import { subscribeKaggleStats, getKaggleSnapshot, KAGGLE_RECORDED_COUNTS, formatKaggleCount } from './kaggle-stats';
import { fmtElapsed, fmtCoord } from './portfolio/readouts';

// Functional enhancements only. All portfolio text is already in the document.
const body = document.body;
const logical = body.dataset.logicalPath || '/';
let activeFeedback: HTMLElement | undefined;
let feedbackTimer: ReturnType<typeof setTimeout>;
function announce(message: string, target: HTMLElement) {
  if (activeFeedback) activeFeedback.hidden = true;
  const entry = target.closest<HTMLElement>('.rv-rail-socials') || target.querySelector<HTMLElement>(':scope > div > div') || target;
  let feedback = entry.querySelector<HTMLElement>(':scope > .rv-copy-feedback');
  if (!feedback) {
    feedback = document.createElement('span');
    feedback.className = 'rv-copy-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    entry.append(feedback);
  }
  activeFeedback = feedback;
  const banner = feedback;
  banner.textContent = message; banner.hidden = false;
  clearTimeout(feedbackTimer); feedbackTimer = setTimeout(() => { banner.hidden = true; }, 2400);
}
document.addEventListener('click', async event => {
  const target = (event.target as Element).closest<HTMLElement>('a,button');
  if (!target) return;
  if (target instanceof HTMLAnchorElement && target.hash && target.pathname === location.pathname) {
    const heading = document.getElementById(decodeURIComponent(target.hash.slice(1)));
    const panel = heading?.closest<HTMLElement>('.cs-tab-panel,.th-tab-panel');
    if (panel && !panel.classList.contains('active')) document.querySelector<HTMLElement>(`button[data-tab="${panel.dataset.panel}"]`)?.click();
  }
  if (target.matches('[data-review-copy],a[href^="mailto:"]')) {
    event.preventDefault();
    const email = target.getAttribute('href')?.replace('mailto:','') || profile.email;
    try { await navigator.clipboard.writeText(email); announce(contactCopy.feedback.email_copied, target); }
    catch { announce(contactCopy.feedback.email_copy_failed, target); }
  }
});

// Real section URLs render the same page and locate the source section.
if (sectionIds.includes(logical.slice(1)) && !location.hash) {
  document.fonts.ready.then(() => document.getElementById(logical.slice(1))?.scrollIntoView());
}

// Keep the original switching/rendering handlers. Add keyboard and ARIA state
// around them; never replace Mermaid initialization or the two panel bodies.
document.querySelectorAll<HTMLElement>('.cs-tab-toggle,.th-tab-toggle').forEach((group,groupIndex) => {
  group.setAttribute('role','tablist');
  group.setAttribute('aria-label',group.classList.contains('cs-tab-toggle') ? chromeCopy.runtime.caseTabsLabel : chromeCopy.runtime.researchTabsLabel);
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('button')];
  const update = () => buttons.forEach((button,index) => {
    const active = button.classList.contains('active');
    const panel = document.querySelector<HTMLElement>(`[data-panel="${button.dataset.tab}"]`)!;
    button.id ||= `review-tab-${groupIndex}-${index}`;
    panel.id ||= `review-panel-${groupIndex}-${index}`;
    button.setAttribute('role','tab'); button.setAttribute('aria-selected',String(active));
    button.setAttribute('aria-controls',panel.id); button.tabIndex = active ? 0 : -1;
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',button.id);
  });
  buttons.forEach((button,index) => {
    button.addEventListener('click',update);
    button.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:buttons.length-1))%buttons.length;
      buttons[next].click(); buttons[next].focus();
    });
  }); update();
});
const requestedTab = new URLSearchParams(location.search).get('tab');
if (requestedTab) [...document.querySelectorAll<HTMLButtonElement>('.cs-tab-btn,.th-tab-btn')].find(button=>button.dataset.tab===requestedTab)?.click();
if (location.hash) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  const panel = target?.closest<HTMLElement>('.cs-tab-panel,.th-tab-panel');
  if (panel && !panel.classList.contains('active')) { document.querySelector<HTMLElement>(`button[data-tab="${panel.dataset.panel}"]`)?.click(); document.fonts.ready.then(()=>target?.scrollIntoView()); }
}

const railLinks = [...document.querySelectorAll<HTMLAnchorElement>('.rv-rail a[href^="#"]')];
const headings = railLinks.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean) as HTMLElement[];
if (headings.length) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) railLinks.forEach(a => {
      if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
    });
  }, { rootMargin:'-5% 0px -70% 0px' });
  headings.forEach(h => observer.observe(h));
}

// Reuse the original dataset store, formatting, fallback and freshness semantics.
const kaggleHighlights = [...document.querySelectorAll<HTMLElement>('.rv-highlights .rv-serif')]
  .filter(element => element.textContent?.trim() === formatAchievementMetrics(KAGGLE_RECORDED_COUNTS));
function renderKaggle() {
  const { stats, status } = getKaggleSnapshot();
  const counts = stats || KAGGLE_RECORDED_COUNTS;
  document.querySelectorAll<HTMLElement>('[data-kaggle-stat]').forEach(row => {
    const key = row.dataset.kaggleStat as 'downloads' | 'views';
    const value = formatKaggleCount(counts[key]);
    const readout = row.querySelector<HTMLElement>('[data-kaggle-value]');
    if (readout) readout.textContent = value;
    const freshness = row.querySelector<HTMLElement>('[data-kaggle-freshness]');
    if (freshness) {
      const presentation = getKaggleFreshness({ stats, status });
      freshness.textContent = presentation.label;
      freshness.title = presentation.detail;
    }
  });
  kaggleHighlights.forEach(element => { element.textContent = formatAchievementMetrics(counts); });
}
if (document.querySelector('[data-kaggle-stat]')) { subscribeKaggleStats(renderKaggle); renderKaggle(); }

const utilities = document.querySelector('.rv-utilities')!;
const readouts = document.createElement('div'); readouts.className = 'rv-readouts';
readouts.innerHTML = '<span data-session></span><span data-explored></span><span data-coords></span>';
readouts.querySelector('[data-coords]')!.textContent = formatChrome(chromeCopy.runtime.coordinatesTemplate, {x:fmtCoord(0),y:fmtCoord(0)});
utilities.append(readouts);
let started = Date.now();
let depths: Record<string,number> = {};
try { const stored = sessionStorage.getItem('__portfolio_session_start'); if (stored) started = Number(stored); else sessionStorage.setItem('__portfolio_session_start',String(started)); depths = JSON.parse(localStorage.getItem('__portfolio_explored_v2') || '{}'); } catch {}
function updateReadouts() {
  const elapsed = Math.max(0,Math.floor((Date.now()-started)/1000));
  readouts.querySelector('[data-session]')!.textContent = fmtElapsed(elapsed);
  const max = document.documentElement.scrollHeight-innerHeight;
  const path = documentPaths.includes(logical) ? logical : '/';
  depths[path] = Math.max(depths[path] || 0,max > 0 ? Math.min(1,scrollY/max) : 1);
  const explored = Math.min(100,documentPaths.reduce((s,p)=>s+Math.min(depths[p] || 0,1),0)/documentPaths.length*100);
  readouts.querySelector('[data-explored]')!.textContent = formatChrome(chromeCopy.runtime.exploredTemplate, {percent: Math.round(explored)});
}
setInterval(updateReadouts,1000); updateReadouts();
window.addEventListener('pagehide',()=>{ try { localStorage.setItem('__portfolio_explored_v2',JSON.stringify(depths)); } catch {} });
let mouseFrame = 0;
window.addEventListener('mousemove',event=>{ if (mouseFrame) return; mouseFrame=requestAnimationFrame(()=>{ mouseFrame=0; const x=(event.clientX-innerWidth/2)/(innerWidth/2),y=-(event.clientY-innerHeight/2)/(innerHeight/2); readouts.querySelector('[data-coords]')!.textContent=formatChrome(chromeCopy.runtime.coordinatesTemplate,{x:fmtCoord(x),y:fmtCoord(y)}); }); },{passive:true});

// Print both existing tabs without changing their normal interactive state.
let printStates: Array<[HTMLElement,string]> = [];
window.addEventListener('beforeprint',()=> {
  printStates = [...document.querySelectorAll<HTMLElement>('.cs-tab-panel,.th-tab-panel')].map(panel=>[panel,panel.className]);
  document.querySelectorAll<HTMLElement>('.cs-tab-btn,.th-tab-btn').forEach(button=>button.click());
  printStates.forEach(([panel])=>panel.classList.add('active'));
});
window.addEventListener('afterprint',()=> { printStates.forEach(([panel,state])=>{panel.className=state;}); const active = document.querySelector<HTMLElement>('.cs-tab-panel.active,.th-tab-panel.active'); if (active) document.querySelector<HTMLElement>(`button[data-tab="${active.dataset.panel}"]`)?.click(); });
