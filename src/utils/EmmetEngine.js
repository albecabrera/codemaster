
/**
 * Emmet Engine - Advanced Abbreviation Parser
 * Handles HTML and CSS expansion logic with support for nesting, grouping, and attributes.
 */

/* --- CONSTANTS & DICTIONARIES --- */

// HTML Tags that are self-closing
const SELF_CLOSING_TAGS = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
  'link', 'meta', 'param', 'source', 'track', 'wbr'
];

// Common CSS Property Shortcuts
const CSS_SHORTCUTS = {
  // Positioning
  'pos': 'position', 'pos:s': 'position:static', 'pos:a': 'position:absolute', 'pos:r': 'position:relative', 'pos:f': 'position:fixed',
  't': 'top', 't:a': 'top:auto', 'r': 'right', 'b': 'bottom', 'l': 'left', 'z': 'z-index',
  
  // Display & Box Model
  'd': 'display', 'd:b': 'display:block', 'd:n': 'display:none', 'd:f': 'display:flex', 'd:g': 'display:grid', 'd:ib': 'display:inline-block',
  'vis': 'visibility', 'vis:h': 'visibility:hidden', 'vis:v': 'visibility:visible',
  'fl': 'float', 'fl:l': 'float:left', 'fl:r': 'float:right', 'fl:n': 'float:none',
  'cl': 'clear', 'cl:b': 'clear:both',
  
  // Flexbox
  'f': 'flex', 'fx': 'flex', 'fd': 'flex-direction', 'fd:r': 'flex-direction:row', 'fd:c': 'flex-direction:column',
  'fw': 'flex-wrap', 'fw:w': 'flex-wrap:wrap', 'fw:nw': 'flex-wrap:nowrap',
  'jc': 'justify-content', 'jc:c': 'justify-content:center', 'jc:sb': 'justify-content:space-between', 'jc:sa': 'justify-content:space-around', 'jc:fe': 'justify-content:flex-end', 'jc:fs': 'justify-content:flex-start',
  'ai': 'align-items', 'ai:c': 'align-items:center', 'ai:fs': 'align-items:flex-start', 'ai:fe': 'align-items:flex-end', 'ai:s': 'align-items:stretch',
  'ac': 'align-content',
  
  // Margins & Padding
  'm': 'margin', 'mt': 'margin-top', 'mr': 'margin-right', 'mb': 'margin-bottom', 'ml': 'margin-left',
  'p': 'padding', 'pt': 'padding-top', 'pr': 'padding-right', 'pb': 'padding-bottom', 'pl': 'padding-left',
  
  // Sizing
  'w': 'width', 'h': 'height', 'maw': 'max-width', 'mah': 'max-height', 'miw': 'min-width', 'mih': 'min-height',
  
  // Typography
  'c': 'color', 'op': 'opacity',
  'ff': 'font-family', 'fs': 'font-style', 'fw': 'font-weight', 'fz': 'font-size',
  'va': 'vertical-align', 'ta': 'text-align', 'ta:c': 'text-align:center', 'ta:l': 'text-align:left', 'ta:r': 'text-align:right',
  'td': 'text-decoration', 'td:n': 'text-decoration:none', 'td:u': 'text-decoration:underline',
  'tt': 'text-transform', 'tt:u': 'text-transform:uppercase', 'tt:l': 'text-transform:lowercase', 'tt:c': 'text-transform:capitalize',
  'lh': 'line-height', 'ls': 'letter-spacing',
  
  // Background & Border
  'bg': 'background', 'bgc': 'background-color', 'bgi': 'background-image',
  'bd': 'border', 'bd+': 'border:1px solid #000', 'bd:n': 'border:none',
  'bdc': 'border-color', 'bds': 'border-style', 'bdw': 'border-width',
  'br': 'border-radius', 'bs': 'box-shadow',
  
  // Misc
  'cur': 'cursor', 'cur:p': 'cursor:pointer', 'cur:d': 'cursor:default',
  'ov': 'overflow', 'ov:h': 'overflow:hidden', 'ov:s': 'overflow:scroll', 'ov:a': 'overflow:auto',
  'tr': 'transition', 'tf': 'transform', 'an': 'animation'
};

// HTML Default Attributes
const HTML_DEFAULTS = {
  'a': { href: '#' },
  'img': { src: '', alt: '' },
  'link': { rel: 'stylesheet', href: '' },
  'script': { src: '' },
  'input': { type: 'text' },
  'button': { type: 'button' },
  'form': { action: '', method: 'POST' }
};

/* --- PARSING FUNCTIONS --- */

/**
 * Main expansion function
 * @param {string} abbr - The abbreviation to expand
 * @param {string} type - 'html' or 'css'
 * @returns {string} Expanded code
 */
export const expandEmmet = (abbr, type = 'html') => {
  if (!abbr) return '';
  
  try {
    if (type === 'css') {
      return expandCSS(abbr);
    } else {
      return expandHTML(abbr);
    }
  } catch (error) {
    console.warn("Emmet expansion failed:", error);
    return abbr; // Fallback to original text on failure
  }
};

/* --- CSS LOGIC --- */

const expandCSS = (abbr) => {
  const cleanAbbr = abbr.trim();
  
  // 1. Check exact shortcut match
  if (CSS_SHORTCUTS[cleanAbbr]) {
    const val = CSS_SHORTCUTS[cleanAbbr];
    return val.includes(':') ? `${val};` : `${val}: ;`;
  }
  
  // 2. Fuzzy match (property + value)
  // Splits like "m10" -> "m", "10" or "bd1px" -> "bd", "1px"
  const match = cleanAbbr.match(/^([a-z-]+)(.*)$/i);
  if (!match) return `${cleanAbbr}: ;`;

  const propPart = match[1];
  let valPart = match[2];
  
  let prop = CSS_SHORTCUTS[propPart];
  if (!prop) {
    // Try to guess property if unknown but looks like one (e.g. "align-self" from "as"?)
    // For now, return as custom property if not found
    prop = propPart;
  }
  
  // Handling value units
  if (valPart) {
    // If explicit value starts with colon, remove it (unlikely in abbr but possible)
    if (valPart.startsWith(':')) valPart = valPart.substring(1);
    
    // Check if numeric
    if (/^-?\d*\.?\d+$/.test(valPart)) {
      // Add 'px' unless it's a unitless property
      const unitless = ['opacity', 'z-index', 'font-weight', 'line-height', 'flex', 'flex-grow', 'flex-shrink', 'order'];
      if (!unitless.includes(prop)) {
        valPart += 'px';
      }
    } else if (valPart.endsWith('p')) {
        valPart = valPart.replace(/p$/, '%');
    } else if (valPart.endsWith('r')) {
        valPart = valPart.replace(/r$/, 'rem');
    } else if (valPart.endsWith('e')) {
        valPart = valPart.replace(/e$/, 'em');
    } else if (/^[0-9a-fA-F]{3,6}$/.test(valPart)) {
         // Hex color without hash
         valPart = `#${valPart}`;
    }
    
    return `${prop}: ${valPart};`;
  }
  
  return `${prop}: ;`;
};

/* --- HTML LOGIC --- */

const expandHTML = (abbr) => {
  // 1. Tokenize (splitting by operators +, >)
  // This is a simplified recursive descent parser
  
  // Handle multiplication first at top level? No, precedence is usually:
  // grouping () -> multiplication * -> sibling + -> child >
  // But standard Emmet parses left to right with operator precedence.
  // Implementation strategy: 
  // 1. Handle grouping (find matching parens) - SKIP for simplicity in this version, assume flattened for now or basic support.
  // 2. Split by '+' (siblings)
  // 3. For each sibling, split by '>' (children)
  // 4. For each node, parse attributes, classes, id, multiplication
  
  const roots = parseSiblings(abbr);
  return roots.map(renderNode).join('\n');
};

const parseSiblings = (str) => {
  // Naive split by '+' that respects grouping parens would be better,
  // but for now simple split.
  // "div+p" -> ["div", "p"]
  return splitSafe(str, '+').map(parseHierarchy);
};

const parseHierarchy = (str) => {
  // "ul>li*3" -> Parent: ul, Children: li*3
  const parts = splitSafe(str, '>');
  const rootToken = parts[0];
  const rootNode = parseToken(rootToken);
  
  if (parts.length > 1) {
    // Recursively parse children
    // The rest of the string is the children definition
    const childrenStr = parts.slice(1).join('>');
    rootNode.children = parseSiblings(childrenStr).map(child => {
       // If child is a hierarchy itself, parseHierarchy returns a single root with children
       // But parseSiblings returns an array of siblings.
       // We need to be careful here. splitSafe('>', ...) splits only top level.
       return child; // This is actually already a node structure from recursive call
    });
    
    // Wait, parseSiblings calls parseHierarchy. 
    // If childrenStr is "li*3", parseSiblings returns [Node(li*3)].
    
    // Correct logic:
    // parts[1] might be "li*3+span".
    // We need to parse that as siblings and attach to rootNode.
    rootNode.children = parseSiblings(childrenStr);
  }
  
  return rootNode;
};

const parseToken = (token) => {
  // Handle multiplication "li*3"
  const multMatch = token.match(/\*(\d+)$/);
  let count = 1;
  let cleanToken = token;
  
  if (multMatch) {
    count = parseInt(multMatch[1]);
    cleanToken = token.substring(0, token.lastIndexOf('*'));
  }
  
  // Parse ID, Class, Attributes, Text
  const node = {
    tagName: 'div', // default
    id: null,
    classes: [],
    attributes: {},
    text: null,
    selfClosing: false,
    count: count,
    children: [] // populated later
  };
  
  let scanner = cleanToken;
  
  // Extract Text {text}
  const textMatch = scanner.match(/\{([^}]+)\}/);
  if (textMatch) {
    node.text = textMatch[1];
    scanner = scanner.replace(textMatch[0], '');
  }
  
  // Extract Attributes [attr=val]
  const attrMatch = scanner.match(/\[([^\]]+)\]/);
  if (attrMatch) {
    const attrStr = attrMatch[1];
    // split by space or comma, simplified
    attrStr.split(/(?:\s|,)+/).forEach(pair => {
      const [k, v] = pair.split('=');
      node.attributes[k] = v ? v.replace(/['"]/g, '') : '';
    });
    scanner = scanner.replace(attrMatch[0], '');
  }
  
  // Extract ID #id
  const idMatch = scanner.match(/#([a-zA-Z0-9\-_]+)/);
  if (idMatch) {
    node.id = idMatch[1];
    scanner = scanner.replace(idMatch[0], '');
  }
  
  // Extract Classes .class
  const classMatches = scanner.match(/\.([a-zA-Z0-9\-_]+)/g);
  if (classMatches) {
    node.classes = classMatches.map(c => c.substring(1));
    classMatches.forEach(m => {
      scanner = scanner.replace(m, '');
    });
  }
  
  // Remaining string is tag name
  if (scanner.length > 0) {
    node.tagName = scanner;
  }
  
  // Apply defaults
  if (HTML_DEFAULTS[node.tagName]) {
    node.attributes = { ...HTML_DEFAULTS[node.tagName], ...node.attributes };
  }
  if (SELF_CLOSING_TAGS.includes(node.tagName)) {
    node.selfClosing = true;
  }
  
  return node;
};

const renderNode = (node) => {
  let output = '';
  
  for (let i = 0; i < node.count; i++) {
    const num = i + 1;
    let attrs = '';
    
    // ID
    if (node.id) attrs += ` id="${node.id.replace('$', num)}"`;
    
    // Classes
    if (node.classes.length > 0) {
      attrs += ` class="${node.classes.join(' ').replace(/\$/g, num)}"`;
    }
    
    // Attributes
    Object.entries(node.attributes).forEach(([k, v]) => {
      attrs += ` ${k}="${String(v).replace(/\$/g, num)}"`;
    });
    
    // Open Tag
    if (node.selfClosing && node.children.length === 0 && !node.text) {
      output += `<${node.tagName}${attrs} />`;
    } else {
      let content = '';
      if (node.text) content += node.text.replace(/\$/g, num);
      
      // Render Children
      if (node.children && node.children.length > 0) {
        content += '\n  ' + node.children.map(child => {
            // Indent children
            return renderNode(child).replace(/\n/g, '\n  ');
        }).join('\n  ') + '\n';
      }
      
      output += `<${node.tagName}${attrs}>${content}</${node.tagName}>`;
    }
    
    if (i < node.count - 1) output += '\n';
  }
  
  return output;
};

// Helper: Split string by separator, ignoring brackets/braces
const splitSafe = (str, separator) => {
  const result = [];
  let current = '';
  let depth = 0; // parens ()
  let brackets = 0; // []
  let braces = 0; // {}
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === '[') brackets++;
    else if (char === ']') brackets--;
    else if (char === '{') braces++;
    else if (char === '}') braces--;
    
    if (char === separator && depth === 0 && brackets === 0 && braces === 0) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

/**
 * Get auto-complete suggestions
 */
export const getEmmetSuggestions = (input, type = 'html') => {
  if (!input) return [];
  const lowerInput = input.toLowerCase();
  
  if (type === 'css') {
    return Object.entries(CSS_SHORTCUTS)
      .filter(([key, val]) => key.startsWith(lowerInput) || val.includes(lowerInput))
      .slice(0, 10)
      .map(([key, val]) => ({
        label: key,
        value: val,
        type: 'css',
        preview: `${key} → ${val}`
      }));
  } else {
    // Very basic HTML suggestions
    const tags = ['div', 'span', 'p', 'a', 'ul', 'li', 'h1', 'img', 'form', 'input', 'button', 'section', 'article', 'nav', 'header', 'footer'];
    
    const exactMatches = tags.filter(t => t.startsWith(lowerInput))
      .map(t => ({
        label: t,
        value: `<${t}></${t}>`,
        type: 'tag',
        preview: `<${t}>...</${t}>`
      }));
      
    // Snippet suggestion if it looks like Emmet syntax
    if (/[.#>+*]/.test(input)) {
        try {
            const expansion = expandEmmet(input, 'html');
            exactMatches.unshift({
                label: input,
                value: expansion,
                type: 'snippet',
                preview: expansion.replace(/\n/g, '↵')
            });
        } catch (e) {
            // ignore invalid parsing during typing
        }
    }
    
    return exactMatches.slice(0, 8);
  }
};

export const validateEmmet = (abbr) => {
    // Basic check if string contains valid emmet characters
    return /^[a-zA-Z0-9.#>+*${}\[\]=:!-]+$/.test(abbr);
};
