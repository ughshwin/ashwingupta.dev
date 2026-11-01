import variants from './review-svg-assets.json';
import { portfolioAsset } from './portfolio/assets';

const logos: Record<string, string> = {
  ...variants,
  [portfolioAsset('hsbc')]: '/review-assets/logos/hsbc-black.svg',
  [portfolioAsset('kaggle')]: '/review-assets/logos/kaggle-black.png',
  '/logos/hsbc.svg': '/review-assets/logos/hsbc-black.svg',
  '/logos/sipp.png': '/review-assets/logos/sipp-black.png',
};
export const staticAsset = (url: string) => logos[url] ?? url;

/** Author prose uses bold markers, never executable HTML. */
export function inlineCopy(text: string) {
  const escape = (value: string) => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
  return text.split(/\*\*(.+?)\*\*/g).map((part,index)=>index % 2 ? `<strong>${escape(part)}</strong>` : escape(part)).join('');
}
