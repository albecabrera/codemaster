
/**
 * Simple Syntax Highlighter
 * Uses Regex to identify tokens and wrap them in span tags with inline styles or classes.
 */

// Colors for Light/Dark themes
const THEME_COLORS = {
  light: {
    tag: '#22863a', // Green
    attr: '#6f42c1', // Purple
    string: '#032f62', // Dark Blue
    comment: '#6a737d', // Gray
    keyword: '#d73a49', // Red
    property: '#005cc5', // Blue
    value: '#032f62', // Dark Blue
    selector: '#6f42c1', // Purple
    number: '#005cc5', // Blue
    default: '#24292e' // Black-ish
  },
  dark: {
    tag: '#7ee787', // Light Green
    attr: '#d2a8ff', // Light Purple
    string: '#a5d6ff', // Light Blue
    comment: '#8b949e', // Gray
    keyword: '#ff7b72', // Red
    property: '#79c0ff', // Blue
    value: '#a5d6ff', // Light Blue
    selector: '#d2a8ff', // Purple
    number: '#79c0ff', // Blue
    default: '#c9d1d9' // White-ish
  }
};

export const getThemeColors = (theme = 'light') => THEME_COLORS[theme];

export const highlightHTML = (code, theme = 'light') => {
  if (!code) return '';
  const colors = THEME_COLORS[theme];
  
  // Escape HTML entities first to prevent rendering actual tags
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Regex Replacements
  // Note: Order matters. Comments first.
  
  // 1. Comments: <!-- ... -->
  escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, `<span style="color:${colors.comment}">$1</span>`);

  // 2. Tag Names: &lt;div, &lt;/div&gt;
  // We need to be careful not to match inside comments (but comments are already wrapped in span)
  // Matching opening tags <tagName
  escaped = escaped.replace(/(&lt;)(\/?)(\w+)(?![^<]*&gt;)/g, (match, lt, slash, tagName) => {
      return `${lt}${slash}<span style="color:${colors.tag}">${tagName}</span>`;
  });
  
  // 3. Attributes: attr=
  // This is tricky with regex on already modified string. 
  // Simplified: Match word followed by = inside tag context roughly
  escaped = escaped.replace(/(\s+)([a-zA-Z0-9-]+)(=)/g, `$1<span style="color:${colors.attr}">$2</span>$3`);
  
  // 4. Strings: "value"
  escaped = escaped.replace(/(".*?")/g, `<span style="color:${colors.string}">$1</span>`);
  
  return escaped;
};

export const highlightCSS = (code, theme = 'light') => {
  if (!code) return '';
  const colors = THEME_COLORS[theme];
  
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 1. Comments /* ... */
  escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, `<span style="color:${colors.comment}">$1</span>`);

  // 2. Selectors (start of line or after })
  // Very rough approximation: anything before { is a selector
  escaped = escaped.replace(/([^{]+)({)/g, (match, selector, brace) => {
      return `<span style="color:${colors.selector}">${selector}</span>${brace}`;
  });

  // 3. Properties (inside {})
  // key: value;
  escaped = escaped.replace(/([a-zA-Z-]+)(:)/g, `<span style="color:${colors.property}">$1</span>$2`);
  
  // 4. Values (after : and before ;)
  // This might overlap if not careful, but simplified approach:
  // We won't color values explicitly with regex here because it's hard to distinguish context without a parser.
  // Instead, let's just color numbers and hex codes.
  
  // Numbers + units
  escaped = escaped.replace(/(\d+(?:px|em|rem|%|vh|vw|s|ms)?)/g, `<span style="color:${colors.number}">$1</span>`);
  
  // Hex Colors
  escaped = escaped.replace(/(#[0-9a-fA-F]{3,6})/g, `<span style="color:${colors.number}">$1</span>`);

  return escaped;
};
