// ============================================================
// QuizVerse AI — Gemini AI Service (Resilient with Offline Fallbacks)
// ============================================================
const { getGeminiModel } = require('../config/gemini');

// ── Offline High-Quality Questions Database (Premium Fail-Safe) ──
const OFFLINE_QUESTIONS = {
  programming: [
    {
      question: "Which data structure operates on a Last-In-First-Out (LIFO) basis?",
      options: { A: "Queue", B: "Stack", C: "Linked List", D: "Array" },
      correctAnswer: "B",
      explanation: "A Stack is a LIFO structure where the last element inserted is the first to be removed. Queues operate on a First-In-First-Out (FIFO) basis.",
      topic: "Data Structures",
      difficulty: "easy"
    },
    {
      question: "What is the worst-case time complexity of searching in a Skewed Binary Search Tree (BST)?",
      options: { A: "O(1)", B: "O(log N)", C: "O(N)", D: "O(N log N)" },
      correctAnswer: "C",
      explanation: "In a skewed BST, all nodes have only one child, effectively turning it into a linked list. Therefore, searching takes O(N) time in the worst case.",
      topic: "Data Structures",
      difficulty: "medium"
    },
    {
      question: "Which of the following sorting algorithms has the best worst-case time complexity?",
      options: { A: "Bubble Sort", B: "Selection Sort", C: "Merge Sort", D: "Quick Sort" },
      correctAnswer: "C",
      explanation: "Merge Sort guarantees O(N log N) time complexity in the worst, average, and best cases, whereas Quick Sort can degrade to O(N^2) in skewed cases.",
      topic: "Algorithms",
      difficulty: "medium"
    },
    {
      question: "Which programming paradigm focuses on 'what to solve' rather than 'how to solve'?",
      options: { A: "Imperative", B: "Procedural", C: "Declarative", D: "Object-Oriented" },
      correctAnswer: "C",
      explanation: "Declarative programming focuses on expressing logic and results (what to solve) rather than explicit step-by-step instructions (how to solve), e.g., SQL or React.",
      topic: "Programming Paradigms",
      difficulty: "hard"
    },
    {
      question: "What is the purpose of a garbage collector in programming languages like Java or JavaScript?",
      options: { A: "To delete unused source files", B: "To automatically reclaim unreferenced memory", C: "To optimize compilation speed", D: "To detect runtime syntax errors" },
      correctAnswer: "B",
      explanation: "Garbage collectors automatically identify and reclaim memory occupied by objects that are no longer referenced or reachable by the program, preventing memory leaks.",
      topic: "Memory Management",
      difficulty: "easy"
    }
  ],
  dbms: [
    {
      question: "Which SQL clause is used to filter results *after* they have been aggregated using a GROUP BY clause?",
      options: { A: "WHERE", B: "HAVING", C: "FILTER", D: "CONSTRAINT" },
      correctAnswer: "B",
      explanation: "The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions. HAVING filters grouped rows.",
      topic: "SQL Queries",
      difficulty: "medium"
    },
    {
      question: "What does the 'A' in ACID properties of a transaction stand for?",
      options: { A: "Availability", B: "Atomicity", C: "Authority", D: "Aggregation" },
      correctAnswer: "B",
      explanation: "Atomicity ensures that a transaction is treated as a single, indivisible unit of work: either all operations succeed, or the entire transaction is rolled back.",
      topic: "Transactions",
      difficulty: "easy"
    },
    {
      question: "Which normal form deals with removing multi-valued dependencies?",
      options: { A: "1NF", B: "2NF", C: "3NF", D: "4NF" },
      correctAnswer: "D",
      explanation: "Fourth Normal Form (4NF) specifically addresses and eliminates multi-valued dependencies, ensuring no independent 1-to-many relationships exist in a single table.",
      topic: "Normalization",
      difficulty: "hard"
    }
  ],
  'ai-ml': [
    {
      question: "What is the primary objective of Supervised Learning?",
      options: { A: "To discover hidden patterns in unlabeled data", B: "To map input features to known labeled targets", C: "To learn optimal behaviors through rewards", D: "To compress dataset dimensions" },
      correctAnswer: "B",
      explanation: "Supervised Learning involves training a model on a labeled dataset, where the goal is to learn a mapping function from input variables to target outputs.",
      topic: "Machine Learning",
      difficulty: "easy"
    },
    {
      question: "Which activation function is most commonly used in the hidden layers of Deep Neural Networks to solve the vanishing gradient problem?",
      options: { A: "Sigmoid", B: "Tanh", C: "ReLU (Rectified Linear Unit)", D: "Softmax" },
      correctAnswer: "C",
      explanation: "ReLU has a constant gradient of 1 for all positive inputs, which prevents the gradient from shrinking/vanishing during backpropagation in deep networks.",
      topic: "Deep Learning",
      difficulty: "medium"
    },
    {
      question: "In Machine Learning, what is 'Overfitting'?",
      options: { A: "When a model performs poorly on both training and test data", B: "When a model learns training data noise too well, failing on unseen data", C: "When a model takes too long to compile", D: "When a model is too small to fit the memory" },
      correctAnswer: "B",
      explanation: "Overfitting occurs when a model learns the details, fluctuations, and noise of the training data to the extent that it negatively impacts performance on new, unseen data.",
      topic: "Model Evaluation",
      difficulty: "easy"
    }
  ],
  'web-development': [
    {
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: { A: "There is no difference", B: "== compares value only; === compares both value and type", C: "=== is only used for strings", D: "== is faster than ===" },
      correctAnswer: "B",
      explanation: "JavaScript '==' performs type coercion (converting operands to a common type) before comparison. '===' performs strict equality without coercion.",
      topic: "JavaScript",
      difficulty: "easy"
    },
    {
      question: "In CSS, what is the 'Box Model'?",
      options: { A: "A layout format for rendering grids", B: "A box that wraps every HTML element, containing margins, borders, padding, and content", C: "A design system based on flex container structures", D: "A JavaScript library for responsive positioning" },
      correctAnswer: "B",
      explanation: "The CSS box model is a container that wraps around every HTML element. It consists of: the actual content, padding, border, and margin.",
      topic: "CSS Basics",
      difficulty: "easy"
    },
    {
      question: "What is the purpose of React Router's <Outlet /> component?",
      options: { A: "To render static global headers and footers", B: "To serve as a placeholder that renders child route elements", C: "To perform heavy background data prefetching", D: "To wrap high-security authenticated user dashboards" },
      correctAnswer: "B",
      explanation: "The <Outlet /> component should be used in parent route layouts to render their active nested child routes, allowing layout sharing.",
      topic: "React",
      difficulty: "medium"
    }
  ],
  default: [
    {
      question: "Which of the following is considered a core pillar of computer science problem-solving?",
      options: { A: "Memorization", B: "Decomposition and Abstraction", C: "Manual compilation", D: "Rebooting the hardware" },
      correctAnswer: "B",
      explanation: "Decomposition (breaking down problems into smaller parts) and Abstraction (hiding details to focus on critical concepts) are fundamental problem-solving techniques.",
      topic: "Problem Solving",
      difficulty: "easy"
    },
    {
      question: "In networking, what is the primary role of the Domain Name System (DNS)?",
      options: { A: "To encrypt network packets", B: "To translate human-readable domain names into machine-readable IP addresses", C: "To boost internet routing speeds", D: "To authorize secure user logins" },
      correctAnswer: "B",
      explanation: "DNS serves as the phonebook of the internet, translating domain names (like google.com) into numerical IP addresses so browsers can load internet resources.",
      topic: "Networking",
      difficulty: "easy"
    },
    {
      question: "What is the primary distinction between a compiler and an interpreter?",
      options: { A: "Compilers are only used for low-level assembly languages", B: "Compilers translate the entire source code into machine code at once; interpreters translate line-by-line during runtime", C: "Interpreters are always faster than compilers", D: "Compilers do not require syntax validation" },
      correctAnswer: "B",
      explanation: "Compilers generate an executable binary file of the entire program beforehand, while interpreters execute the code directly line-by-line at runtime.",
      topic: "Programming Languages",
      difficulty: "medium"
    }
  ]
};

// Helper to fetch high-quality fallback questions matching the category
const getOfflineFallbackQuestions = (category, difficulty, topic, count) => {
  const normCat = String(category || '').toLowerCase().trim();
  let pool = OFFLINE_QUESTIONS[normCat] || OFFLINE_QUESTIONS['web-development'];
  
  if (normCat.includes('prog') || normCat.includes('code')) {
    pool = OFFLINE_QUESTIONS.programming;
  } else if (normCat.includes('db') || normCat.includes('sql') || normCat.includes('data')) {
    pool = OFFLINE_QUESTIONS.dbms;
  } else if (normCat.includes('ai') || normCat.includes('ml') || normCat.includes('learn')) {
    pool = OFFLINE_QUESTIONS['ai-ml'];
  } else if (normCat.includes('web') || normCat.includes('js') || normCat.includes('react') || normCat.includes('css')) {
    pool = OFFLINE_QUESTIONS['web-development'];
  } else {
    // Combine default and web-dev to have a rich default pool
    pool = [...OFFLINE_QUESTIONS.default, ...OFFLINE_QUESTIONS['web-development']];
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  
  // Slice to count, repeating questions if needed to reach count
  const results = [];
  for (let i = 0; i < count; i++) {
    const q = shuffled[i % shuffled.length];
    results.push({
      text: q.question,
      options: [q.options.A, q.options.B, q.options.C, q.options.D],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic || topic || category,
      difficulty: q.difficulty || difficulty,
      orderIndex: i,
      points: difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5,
    });
  }
  return results;
};

/**
 * Generate 10 MCQ questions using Gemini AI (with robust multi-model fallback and offline backup)
 */
const generateQuizQuestions = async (category, difficulty, topic, count = 10) => {
  const prompt = `
You are an expert quiz generator for a competitive exam platform called QuizVerse AI.

Generate exactly ${count} multiple-choice questions (MCQs) for the following:
- Category: ${category}
- Topic: ${topic || category}
- Difficulty: ${difficulty}

Requirements:
1. Each question must have exactly 4 options labeled A, B, C, D
2. Only one option is correct
3. Include a clear, educational explanation
4. Questions should be challenging, unique, and conceptually valuable
5. Difficulty "${difficulty}" means: easy=basic concepts, medium=application, hard=advanced/tricky

Return ONLY a valid JSON array (no markdown, no extra text) in this EXACT format:
[
  {
    "question": "The question text here?",
    "options": {
      "A": "First option",
      "B": "Second option",
      "C": "Third option",
      "D": "Fourth option"
    },
    "correctAnswer": "A",
    "explanation": "Detailed explanation of why A is correct and why others are wrong.",
    "topic": "Specific sub-topic",
    "difficulty": "${difficulty}"
  }
]

Generate ${count} questions now:`;

  let responseText = '';
  // Try gemini-3.5-flash first, then fallback to other fast stable models
  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash'];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting quiz generation with model: ${modelName}...`);
      const model = getGeminiModel(modelName);
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
      if (responseText && responseText.trim()) {
        console.log(`✅ Quiz generated successfully using ${modelName}`);
        break;
      }
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} failed: ${err.message}`);
      lastError = err;
    }
  }

  // Fail-Safe: Offline fallback questions
  if (!responseText) {
    console.error('❌ All Gemini API requests failed. Triggering offline fallback generator...');
    return getOfflineFallbackQuestions(category, difficulty, topic, count);
  }

  try {
    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid JSON response format from Gemini');

    const questions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Gemini returned empty questions array');
    }

    // Validate and normalize each question
    return questions.map((q, index) => ({
      text: q.question || q.text,
      options: Array.isArray(q.options)
        ? q.options
        : [q.options.A, q.options.B, q.options.C, q.options.D],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'No explanation provided.',
      topic: q.topic || topic || category,
      difficulty: q.difficulty || difficulty,
      orderIndex: index,
      points: difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5,
    }));
  } catch (err) {
    console.error('Gemini JSON parsing failed, falling back to offline questions:', err.message);
    return getOfflineFallbackQuestions(category, difficulty, topic, count);
  }
};

/**
 * Generate personalized AI feedback for a quiz attempt (with multi-model fallback and offline backup)
 */
const generateAIFeedback = async (attemptData) => {
  const { score, accuracy, correctAnswers, totalQuestions, weakTopics, strongTopics, category, difficulty } = attemptData;

  const prompt = `
You are an AI tutor for QuizVerse AI, a competitive exam platform.

A student just completed a quiz. Analyze their performance and provide personalized feedback.

Performance Data:
- Category: ${category}
- Difficulty: ${difficulty}
- Score: ${score} points
- Accuracy: ${accuracy}%
- Correct Answers: ${correctAnswers}/${totalQuestions}
- Weak Topics: ${weakTopics.join(', ') || 'None identified'}
- Strong Topics: ${strongTopics.join(', ') || 'None identified'}

Provide a personalized, encouraging, and actionable JSON response in this EXACT format:
{
  "overallFeedback": "2-3 sentence overall assessment of performance",
  "strengths": ["strength1", "strength2", "strength3"],
  "areasToImprove": ["area1", "area2", "area3"],
  "studyPlan": [
    {"topic": "topic name", "priority": "high/medium/low", "resources": "study suggestion"},
    {"topic": "topic name", "priority": "high/medium/low", "resources": "study suggestion"}
  ],
  "motivationalMessage": "Short encouraging message",
  "estimatedRank": "Top X% estimate based on score",
  "nextSteps": ["step1", "step2", "step3"]
}

Return ONLY the JSON object, no markdown:`;

  let responseText = '';
  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash'];

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting AI feedback generation with model: ${modelName}...`);
      const model = getGeminiModel(modelName);
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
      if (responseText && responseText.trim()) {
        console.log(`✅ Feedback generated successfully using ${modelName}`);
        break;
      }
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} feedback failed: ${err.message}`);
    }
  }

  // Fail-Safe: Offline fallback feedback
  if (!responseText) {
    console.warn('❌ Gemini feedback generation offline. Returning local high-quality feedback.');
    return {
      overallFeedback: `You scored ${accuracy}% on this ${difficulty} ${category} quiz. ${accuracy >= 70 ? 'Great performance! You displayed solid conceptual clarity.' : 'A good effort! Focus on reviewing weaker topics to boost your scores next time.'}`,
      strengths: strongTopics.length ? strongTopics : ['Participating actively', 'Test completion'],
      areasToImprove: weakTopics.length ? weakTopics : ['Consistent study reviews', 'Question pacing'],
      studyPlan: (weakTopics || []).map(topic => ({
        topic,
        priority: 'high',
        resources: `Revise fundamental rules and perform targeted exercises on ${topic}.`
      })),
      motivationalMessage: 'Every quiz brings you closer to your learning goals. Keep up the great work!',
      estimatedRank: accuracy >= 90 ? 'Top 5%' : accuracy >= 75 ? 'Top 15%' : accuracy >= 50 ? 'Top 40%' : 'Top 70%',
      nextSteps: ['Go over incorrect answers and explanations', 'Review study sheets for weak topics', 'Start another practice quiz soon'],
    };
  }

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid feedback JSON from Gemini');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Feedback parsing failed, returning fail-safe feedback:', err.message);
    return {
      overallFeedback: `You scored ${accuracy}% on this ${difficulty} ${category} quiz.`,
      strengths: strongTopics.length ? strongTopics : ['Active participation'],
      areasToImprove: weakTopics.length ? weakTopics : ['Topic review'],
      studyPlan: [],
      motivationalMessage: 'Every quiz is a step towards mastery. Keep going!',
      estimatedRank: accuracy >= 80 ? 'Top 20%' : 'Top 50%',
      nextSteps: ['Review incorrect answers', 'Study weak topics', 'Practice more questions'],
    };
  }
};

/**
 * Generate category-specific topic suggestions (with fail-safe)
 */
const generateTopicSuggestions = async (category) => {
  const prompt = `List 10 specific, popular exam topics for "${category}" category.
Return ONLY a JSON array of strings: ["topic1", "topic2", ...]`;

  let text = '';
  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash'];

  for (const modelName of modelsToTry) {
    try {
      const model = getGeminiModel(modelName);
      const result = await model.generateContent(prompt);
      text = result.response.text();
      if (text && text.trim()) break;
    } catch {
      // Continue to next model
    }
  }

  if (!text) {
    // Return high-quality static defaults depending on the category
    const norm = String(category || '').toLowerCase();
    if (norm.includes('prog')) return ['Variables', 'Control Flow', 'Functions', 'Arrays & Lists', 'Object Oriented Programming', 'Pointers', 'Recursion', 'Time Complexity', 'Sorting Algorithms', 'Data Structures'];
    if (norm.includes('db')) return ['Entity-Relationship Model', 'Relational Schemas', 'Normalization (1NF, 2NF, 3NF, BCNF)', 'SQL Queries', 'Joins and Subqueries', 'Transactions & ACID', 'Indexing & Hashing', 'NoSQL Databases', 'Concurrency Control', 'Data Warehousing'];
    if (norm.includes('web')) return ['HTML & Semantic Markup', 'CSS Box Model & Flexbox', 'JavaScript DOM Manipulation', 'Async JS (Promises/Async-Await)', 'React Components & Hooks', 'State Management', 'RESTful APIs', 'Client-side Routing', 'Web Security (CORS/XSS)', 'Performance Optimization'];
    return ['Basic Concepts', 'Intermediate Concepts', 'Advanced Applications', 'Practical Case Studies', 'Core Theoretical Pillars', 'Important Algorithms', 'Key Definitions', 'Industry Best Practices', 'Common Pitfalls', 'Future Trends'];
  }

  try {
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
};

module.exports = { generateQuizQuestions, generateAIFeedback, generateTopicSuggestions };
