// Paint-only variants: paths, viewBoxes, masks and geometry are preserved.
export function darkenWhiteSvg(svg) {
  return svg.replace(/#ffffff\b|#fff\b|\bwhite\b/gi, '#1d293b')
    .replace(/rgba?\(\s*255\s*,\s*255\s*,\s*255\s*(,\s*[^)]+)?\)/gi,
      (_, alpha) => alpha ? `rgba(29,41,59${alpha})` : 'rgb(29,41,59)');
}
