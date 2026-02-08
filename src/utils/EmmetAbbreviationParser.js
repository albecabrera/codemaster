
/**
 * Emmet Abbreviation Parser Utility
 * Handles parsing of HTML and CSS Emmet abbreviations
 */

// Common CSS Properties Dictionary for Fuzzy Matching
const CSS_PROPS = {
  'm': 'margin', 'mt': 'margin-top', 'mr': 'margin-right', 'mb': 'margin-bottom', 'ml': 'margin-left',
  'p': 'padding', 'pt': 'padding-top', 'pr': 'padding-right', 'pb': 'padding-bottom', 'pl': 'padding-left',
  'w': 'width', 'h': 'height', 'maw': 'max-width', 'mah': 'max-height', 'miw': 'min-width', 'mih': 'min-height',
  'd': 'display', 'df': 'display: flex', 'db': 'display: block', 'dib': 'display: inline-block', 'dn': 'display: none',
  'pos': 'position', 'por': 'position: relative', 'poa': 'position: absolute', 'pof': 'position: fixed',
  'bg': 'background', 'bgc': 'background-color', 'c': 'color',
  'f': 'font', 'fz': 'font-size', 'fw': 'font-weight', 'ff': 'font-family',
  'ta': 'text-align', 'tac': 'text-align: center', 'tal': 'text-align: left', 'tar': 'text-align: right',
  'td': 'text-decoration', 'tdn': 'text-decoration: none',
  'bd': 'border', 'bdr': 'border-radius',
  'jc': 'justify-content', 'jcc': 'justify-content: center', 'jcsb': 'justify-content: space-between',
  'ai': 'align-items', 'aic': 'align-items: center',
  'fd': 'flex-direction', 'fdc': 'flex-direction: column', 'fdr': 'flex-direction: row',
  'z': 'z-index', 'op': 'opacity', 'ov': 'overflow', 'ovh': 'overflow: hidden',
  'cur': 'cursor', 'curp': 'cursor: pointer'
};

// HTML Tag Mappings for implied attributes
const HTML_TAGS = {
  'a': { attrs: { href: '#' } },
  'img': { attrs: { src: '', alt: '' }, selfClosing: true },
  'link': { attrs: { rel: 'stylesheet', href: '' }, selfClosing: true },
  'input': { attrs: { type: 'text' }, selfClosing: true },
  'script': { attrs: { src: '' } },
  'br': { selfClosing: true },
  'hr': { selfClosing: true },
  'meta': { selfClosing: true },
};

export const parseHtmlEmmet = (abbr) => {
  if (!abbr) return '';

  try {
    // Basic parser for structural Emmet
    // Supports: >, +, *, ., #, {}, []
    
    // Step 1: Handle grouping () - (simplified: remove outer parens if simple wrapper)
    // Complex grouping logic is skipped for this lightweight implementation
    let cleanAbbr = abbr.trim();
    
    // Step 2: Parse Siblings (+)
    // Note: This logic assumes simple operator precedence. Real Emmet is more complex.
    // We split by + only at the top level (not inside attributes or braces)
    const siblings = splitSafe(cleanAbbr, '+');
    if (siblings.length > 1) {
      return siblings.map(s => parseHtmlEmmet(s)).join('\n');
    }

    // Step 3: Parse Children (>)
    const hierarchy = splitSafe(cleanAbbr, '>');
    if (hierarchy.length > 1) {
      const parent = parseNode(hierarchy[0]);
      const childrenHtml = parseHtmlEmmet(hierarchy.slice(1).join('>'));
      return renderNode(parent, childrenHtml);
    }

    // Step 4: Parse Multiplication (*)
    const parts = splitSafe(cleanAbbr, '*');
    if (parts.length > 1) {
      const count = parseInt(parts[1], 10);
      const nodeStr = parts[0];
      let result = '';
      for (let i = 0; i < count; i++) {
        // Handle $ numbering
        const numberedNodeStr = nodeStr.replace(/\$/g, (i + 1).toString());
        result += parseHtmlEmmet(numberedNodeStr) + '\n';
      }
      return result.trim();
    }

    // Step 5: Single Node Parsing
    const node = parseNode(cleanAbbr);
    return renderNode(node, '');

  } catch (e) {
    console.error('Emmet Parse Error:', e);
    return abbr; // Fallback
  }
};

const parseNode = (token) => {
  const node = {
    tag: 'div', // Default tag
    classes: [],
    id: null,
    attributes: {},
    text: '',
    selfClosing: false
  };

  // Extract Text {}
  let processedToken = token;
  const textMatch = processedToken.match(/\{([^}]+)\}/);
  if (textMatch) {
    node.text = textMatch[1];
    processedToken = processedToken.replace(textMatch[0], '');
  }

  // Extract Attributes []
  const attrMatch = processedToken.match(/\[([^\]]+)\]/);
  if (attrMatch) {
    const attrs = attrMatch[1].split(' ');
    attrs.forEach(attr => {
      const [key, val] = attr.split('=');
      node.attributes[key] = val ? val.replace(/['"]/g, '') : '';
    });
    processedToken = processedToken.replace(attrMatch[0], '');
  }

  // Extract ID
  const idMatch = processedToken.match(/#([a-zA-Z0-9\-_]+)/);
  if (idMatch) {
    node.id = idMatch[1];
    processedToken = processedToken.replace(idMatch[0], '');
  }

  // Extract Classes
  const classMatches = processedToken.match(/\.([a-zA-Z0-9\-_]+)/g);
  if (classMatches) {
    node.classes = classMatches.map(c => c.substring(1));
    classMatches.forEach(m => {
      processedToken = processedToken.replace(m, '');
    });
  }

  // Remaining part is the tag
  if (processedToken.length > 0) {
    node.tag = processedToken;
  }

  // Apply default attributes for known tags
  if (HTML_TAGS[node.tag]) {
    node.attributes = { ...HTML_TAGS[node.tag].attrs, ...node.attributes };
    node.selfClosing = HTML_TAGS[node.tag].selfClosing || false;
  }

  return node;
};

const renderNode = (node, children) => {
  let attrs = '';
  
  if (node.id) attrs += ` id="${node.id}"`;
  if (node.classes.length > 0) attrs += ` class="${node.classes.join(' ')}"`;
  
  Object.entries(node.attributes).forEach(([key, val]) => {
    attrs += ` ${key}="${val}"`;
  });

  if (node.selfClosing && !children && !node.text) {
    return `<${node.tag}${attrs} />`;
  }

  return `<${node.tag}${attrs}>${node.text}${children}</${node.tag}>`;
};

export const parseCssEmmet = (abbr) => {
  if (!abbr) return '';
  const cleanAbbr = abbr.trim();

  // Check direct matches first
  if (CSS_PROPS[cleanAbbr]) {
    // If it's a value-included prop (e.g. df -> display: flex)
    if (CSS_PROPS[cleanAbbr].includes(':')) {
      return `${CSS_PROPS[cleanAbbr]};`;
    }
    return `${CSS_PROPS[cleanAbbr]}: ;`; // Needs value
  }

  // Handle value separation (e.g., m10 -> margin: 10px, c#f00 -> color: #f00)
  // Split letters from numbers/symbols
  const match = cleanAbbr.match(/^([a-z-]+)(.*)$/i);
  if (match) {
    const propKey = match[1];
    let value = match[2];

    if (CSS_PROPS[propKey]) {
      const propName = CSS_PROPS[propKey];
      
      // Determine unit
      if (value) {
        if (/^\d+$/.test(value)) {
           // If mostly numeric, assume px unless it's unitless property
           if (!['opacity', 'z-index', 'font-weight', 'line-height'].includes(propName)) {
             value += 'px';
           }
        } else if (value.startsWith('p')) {
            value = value.substring(1) + '%';
        } else if (value.startsWith('e')) {
            value = value.substring(1) + 'em';
        } else if (value.startsWith('r')) {
            value = value.substring(1) + 'rem';
        } else if (value.startsWith('#')) {
            // Hex color, keep as is
        }
      }

      if (value) {
        return `${propName}: ${value};`;
      }
    }
  }

  // Fallback: Return as property if it looks like one
  return `${cleanAbbr}: ;`;
};

// Helper to split string by separator but ignore if inside brackets/braces/parens
const splitSafe = (str, separator) => {
  const result = [];
  let current = '';
  let brackets = 0;
  let braces = 0;
  let parens = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (char === '[') brackets++;
    else if (char === ']') brackets--;
    else if (char === '{') braces++;
    else if (char === '}') braces--;
    else if (char === '(') parens++;
    else if (char === ')') parens--;

    if (char === separator && brackets === 0 && braces === 0 && parens === 0) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

export const validateEmmet = (abbr, type = 'html') => {
  if (!abbr) return false;
  // Simple validation heuristics
  if (type === 'html') {
    return /^[a-z0-9.#>[\]{}+*$=!]+$/i.test(abbr);
  } else {
    return /^[a-z0-9#%-]+$/i.test(abbr);
  }
};

export const getEmmetSuggestions = (input, type = 'html') => {
  if (!input) return [];
  const suggestions = [];

  if (type === 'html') {
    // Very basic suggestions based on tags
    const commonTags = ['div', 'span', 'p', 'a', 'ul', 'li', 'h1', 'img', 'form', 'input', 'button'];
    if (commonTags.includes(input)) {
        suggestions.push({ abbr: input, expansion: `<${input}></${input}>`, type: 'tag' });
    } else if (input.includes('.')) {
        const parsed = parseHtmlEmmet(input);
        suggestions.push({ abbr: input, expansion: parsed, type: 'snippet' });
    }
  } else {
    // CSS suggestions
    Object.keys(CSS_PROPS).forEach(key => {
      if (key.startsWith(input)) {
        suggestions.push({ 
          abbr: key, 
          expansion: CSS_PROPS[key].includes(':') ? CSS_PROPS[key] : `${CSS_PROPS[key]}:`, 
          type: 'property' 
        });
      }
    });
    
    // Dynamic value suggestions
    if (validateEmmet(input, 'css')) {
       const parsed = parseCssEmmet(input);
       if (parsed && parsed !== `${input}: ;`) {
         suggestions.unshift({ abbr: input, expansion: parsed, type: 'value' });
       }
    }
  }

  return suggestions.slice(0, 5);
};
