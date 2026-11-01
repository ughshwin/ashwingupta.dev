import source from './copy/Contact.json';
import { resolveCopy } from './copy';
import { portfolioAsset } from '../../lib/portfolio/assets';

export const contactCopy = resolveCopy(source);
export type ContactLinkId = 'resume' | 'email' | 'github' | 'linkedin' | 'kaggle' | 'location';
type ContactLinkSource = {
  id: string;
  label: string;
  value: string;
  href?: string;
  asset?: string;
  download?: string;
  valueFormat?: string;
};

const ids: ReadonlySet<string> = new Set<ContactLinkId>(['resume', 'email', 'github', 'linkedin', 'kaggle', 'location']);

export const contactLinks = contactCopy.links.map((link: ContactLinkSource) => {
  if (!ids.has(link.id)) throw new Error(`Unknown contact link: ${link.id}`);
  if (link.valueFormat && link.valueFormat !== 'url') throw new Error(`Unknown contact value format: ${link.valueFormat}`);
  const href = link.asset ? portfolioAsset(link.asset) : link.href;
  if (!href) throw new Error(`Missing contact destination: ${link.id}`);
  return {
    id: link.id as ContactLinkId,
    label: link.label,
    value: link.valueFormat === 'url'
      ? link.value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : link.value,
    href,
    download: link.download,
  };
});
