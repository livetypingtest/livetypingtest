// Word lists for different difficulty levels
const easyWords = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for",
    "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his",
    "by", "from", "they", "we", "say", "her", "she", "or", "my", "one", "all",
    "would", "there", "their", "what", "so", "up", "out", "if", "who", "get",
    "me", "when", "make", "can", "no", "like", "him", "just", "how", "know",
    "take", "into",
  ];
  
  const mediumWords = [
    "important", "different", "example", "problem", "information", "follow",
    "remember", "reason", "change", "large", "small", "interesting", "continue",
    "usually", "explain", "possible", "result", "understand", "question",
    "decision", "consider", "compare", "development", "appear", "provide",
    "experience", "believe", "relationship", "society", "necessary",
    "technology",
  ];
  
  const hardWords = [
    "phenomenon", "consequence", "philosophy", "significant", "alternative",
    "ambiguous", "extraordinary", "sophisticated", "infrastructure",
    "psychological", "metamorphosis", "unprecedented", "unilateral",
    "cumulative", "hypothetical", "autonomous", "epistemology", "imperative",
    "corroborate", "dichotomy", "subsequent", "circumstantial", "constellation",
    "relinquish", "simultaneous", "conundrum", "ubiquitous",
  ];
  
  // Function to pick random words from a word array
  function pickRandomWords(wordArray, count) {
    const words = [];
    for (let i = 0; i < count; i++) {
      const word = wordArray[Math.floor(Math.random() * wordArray.length)];
      words.push(word);
    }
    return words;
  }
  
  // Function to generate a sentence
  function generateSentence(wordArray, wordCount) {
    let sentence = pickRandomWords(wordArray, wordCount);
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    return sentence.join(" ") + ".";
  }
  
  // Function to generate a paragraph based on word count
  function generateParagraph(wordArray, totalWords) {
    let paragraph = [];
    let wordsRemaining = totalWords;
  
    while (wordsRemaining > 0) {
      const wordCount = Math.min(
        Math.floor(Math.random() * 10) + 5,
        wordsRemaining
      ); // Sentences between 5 and 15 words
      const sentence = generateSentence(wordArray, wordCount);
      paragraph.push(sentence);
      wordsRemaining -= wordCount;
    }
    return paragraph.join(" ");
  }

    export { generateParagraph, easyWords, mediumWords, hardWords }