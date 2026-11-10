import bmsce from '../../assets/BMSlogo.webp?url';
import coforge from '../../assets/coforgeLogo.webp?url';
import augment from '../../assets/augmentAILogo.webp?url';
import guinness from '../../assets/GuinnessLogo.webp?url';
import hsbc from '../../assets/HSBCLogo.webp?url';
import kaggle from '../../assets/KaggleLogo.webp?url';
import gida from '../../assets/gidaLogo.webp?url';
import hdfc from '../../assets/HDFClogo.webp?url';
import prismforce from '../../assets/prismforceLogo.webp?url';
import resume from '../../assets/Ashwin_Gupta_AI_Systems_Engineer.docx?url';

// Asset resolution belongs to the renderer; content stores stable asset keys.
const assets: Record<string, string> = { bmsce, coforge, 'augment-ai': augment, guinness, hsbc, kaggle, gida, hdfc, prismforce, resume };
export function portfolioAsset(key: string): string {
  if (key.startsWith('/')) return key;
  if (!(key in assets)) throw new Error(`Unknown portfolio asset: ${key}`);
  return assets[key];
}
