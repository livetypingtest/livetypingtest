import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { easyWords, generateParagraph, hardWords, mediumWords } from './ParagraphGenerater';


const TypingTest = () => {
  const [userInput, setUserInput] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [currentLines, setCurrentLines] = useState([]);
  const [startLineIndex, setStartLineIndex] = useState(0);
  const typingAreaRef = useRef(null);

    // Function to generate paragraph based on duration and difficulty
    const generateTypingTestParagraph = () => {
      const wordsPerMinute = 70; // Average typing speed (can be adjusted)
      const totalWords = wordsPerMinute * (300 / 60); // Total words to match the duration
  
      let wordArray;
      wordArray = hardWords.concat(mediumWords).concat(easyWords); // Mix all words
  
      const newParagraph = generateParagraph(wordArray, totalWords);
      return newParagraph
    };
    let paragraph
    useEffect(()=>{ paragraph = generateTypingTestParagraph()}, [])

  const wordsPerLine = 60; // Max words per line
  const rows = 6; // Number of lines visible at once

  // Split the paragraph into lines of about 60 words per line
  const splitParagraphIntoLines = (paragraph) => {
    const words = paragraph?.split(" ");
    const lines = [];
    let currentLine = [];

    words?.forEach((word) => {
      currentLine.push(word);
      if (currentLine.length === wordsPerLine) {
        lines.push(currentLine.join(" "));
        currentLine = [];
      }
    });

    if (currentLine.length) {
      lines.push(currentLine.join(" "));
    }

    return lines;
  };

  useEffect(() => {
    const lines = splitParagraphIntoLines(paragraph);
    setCurrentLines(lines.slice(startLineIndex, startLineIndex + rows));
  }, [paragraph, startLineIndex]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    const totalTypedChars = input.length;
    const currentLineIndex = Math.floor(totalTypedChars / (wordsPerLine * 5)); // Rough estimate for line tracking

    // When the user reaches the 5th line, load the next set of lines
    if (currentLineIndex >= rows - 1) {
      setStartLineIndex((prevIndex) => prevIndex + rows);
    }
  };

  return (
    <div className="col-md-12">


      <div
        className={`typing-area ${!hasFocus ? "text-blur" : ""}`}
        tabIndex={0}
        onClick={() => { typingAreaRef.current.focus(); setHasFocus(true); }}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        ref={typingAreaRef}
      >
        <div className={`paragraph-container ${!hasFocus ? "text-blur" : ""}`}>
          {currentLines.map((line, lineIndex) => (
            <div key={lineIndex} className="line">
              {line.split("").map((char, charIndex) => {
                const absoluteCharIndex = lineIndex * wordsPerLine + charIndex;
                return (
                  <span
                    key={charIndex}
                    className={`${
                      userInput[absoluteCharIndex] === undefined
                        ? "text-light"
                        : userInput[absoluteCharIndex] === char
                        ? "text-active"
                        : "text-wrong"
                    } ${hasFocus && absoluteCharIndex === userInput?.length ? "underline" : ""}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}

          {hasFocus && userInput?.length < currentLines.join("").length && (
            <span
              style={{
                borderLeft: "2px solid white",
                animation: "blink 1s infinite",
                marginLeft: "2px",
                display: "inline-block",
              }}
            />
          )}

          <textarea
            // ref={typingAreaRef}
            value={userInput}
            onChange={handleInputChange}
            rows={rows}
            onClick={() => setHasFocus(true)}
            className="main-input-cs"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      </div>

      <div className="reset">
        <button className="z-10" onClick={() => setUserInput('')}>
          <i className="fa-solid fa-arrow-rotate-right text-active"></i>
          <span className="text-idle">Start Over</span>
        </button>
      </div>
    </div>
  );
};

export default TypingTest;