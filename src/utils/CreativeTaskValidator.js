
export const parseTaskComment = (code, language) => {
  const lines = code.split('\n');
  let comments = [];
  
  if (language === 'HTML') {
    const match = code.match(/<!--([\s\S]*?)-->/);
    if (match) return match[1].trim();
  } else {
    // For JS, Java, CSS (// or /* */) and Python (#)
    const commentChar = language === 'Python' ? '#' : '//';
    for (let line of lines) {
      if (line.trim().startsWith(commentChar)) {
        comments.push(line.trim().substring(commentChar.length).trim());
      } else if (line.trim().length > 0) {
        // Stop at first line of code
        break;
      }
    }
  }
  return comments.join(' ');
};

export const validateTask = (code, language) => {
  if (!code || code.trim().length === 0) {
    return { valid: false, message: 'Code is empty' };
  }

  // Basic heuristic validation
  const length = code.length;
  if (length < 20) {
    return { valid: false, message: 'Solution seems too short' };
  }

  return { valid: true, message: 'Solution looks good!' };
};

export const awardPoints = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 10;
    case 'Intermediate': return 25;
    case 'Expert': return 50;
    default: return 10;
  }
};
