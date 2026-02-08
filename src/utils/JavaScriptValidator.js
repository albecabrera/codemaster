
export const validateOutput = (actualLogs, expectedOutput, difficulty) => {
  // Normalize expected output to string
  const expectedString = String(expectedOutput).trim();
  
  // Extract content from logs
  const actualContent = actualLogs
    .filter(log => log.type === 'info' || log.type === 'result')
    .map(log => log.content)
    .join('\n')
    .trim();

  // Basic exact match
  if (actualContent === expectedString) {
    return {
      isValid: true,
      score: getPointsForDifficulty(difficulty),
      message: 'perfect_match'
    };
  }

  // Partial match for arrays/objects (simple check)
  if (expectedString.startsWith('[') || expectedString.startsWith('{')) {
    try {
        const normalizedActual = actualContent.replace(/\s/g, '');
        const normalizedExpected = expectedString.replace(/\s/g, '');
        if (normalizedActual === normalizedExpected) {
             return {
                isValid: true,
                score: getPointsForDifficulty(difficulty),
                message: 'perfect_match'
            };
        }
    } catch(e) {
        // ignore
    }
  }

  // Check if expected output is contained within actual output (flexible)
  if (actualContent.includes(expectedString)) {
    return {
      isValid: true,
      score: getPointsForDifficulty(difficulty),
      message: 'partial_match'
    };
  }

  return {
    isValid: false,
    score: 0,
    message: 'mismatch',
    details: {
        expected: expectedString,
        actual: actualContent
    }
  };
};

const getPointsForDifficulty = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return 50;
    case 'intermediate': return 100;
    case 'advanced': return 150;
    case 'expert': return 200;
    default: return 10;
  }
};
