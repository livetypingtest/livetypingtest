import React, { useEffect, useRef, useState } from "react";

const TypingArea = ({ lines }) => {
  const [userInput, setUserInput] = useState("");
  const [hasFocus, setHasFocus] = useState(false);
  const [currentLines, setCurrentLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0); // Tracks the current active line index
  const typingAreaRef = useRef(null);
  const paragraphWrapperRef = useRef(null);

  // Update the visible lines dynamically
  useEffect(() => {
    const start = Math.max(0, currentLineIndex - 5); // Show up to 5 lines before the active line
    const end = Math.min(lines?.length, currentLineIndex + 1); // Include the active line
    setCurrentLines(lines?.slice(start, start + 6)); // Ensure only 6 lines in view
  }, [currentLineIndex, lines]);

  // Handle user input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    const cursorPosition = value.length; // Current input cursor position
    let totalCharCount = 0;

    // Calculate the current line index based on the cursor position
    for (let i = 0; i < lines?.length; i++) {
      totalCharCount += lines[i].length + 1; // Account for newline characters
      if (cursorPosition <= totalCharCount) {
        setCurrentLineIndex(i);
        break;
      }
    }
  };

  // Prevent the cursor from moving to incorrect positions
  const handleCursorSelection = (e) => {
    const inputElement = e.target;
    const currentCursorPosition = inputElement.selectionStart;

    // Prevent cursor from moving before the last valid character
    if (currentCursorPosition < userInput.length) {
      inputElement.setSelectionRange(userInput.length, userInput.length);
    }
  };

  return (
    <div className="col-md-12">
      {/* Overlay for blur effect */}
      {!hasFocus && (
        <div
          className="typing-overlay"
          onClick={() => {
            setHasFocus(true);
            typingAreaRef.current.focus();
          }}
        >
          <p>Click here to continue typing!</p>
        </div>
      )}
      <div
        className={`typing-area ${!hasFocus ? "text-blur" : ""}`}
        tabIndex={0} // Make the div focusable
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        ref={paragraphWrapperRef}
      >
        {/* Display the visible lines */}
        <div className="paragraph-container">
          {currentLines?.map((line, lineIndex) => (
            <div key={lineIndex} className="line">
              {line.split("").map((char, charIndex) => {
                console.log(char)
                const absoluteCharIndex =
                  lines.slice(0, currentLineIndex).join("").length + charIndex;
                return (
                  <span
                    key={charIndex}
                    className={`${
                      userInput[absoluteCharIndex] === undefined
                        ? "text-light"
                        : userInput[absoluteCharIndex] === char
                        ? "text-active"
                        : "text-wrong"
                    } ${
                      hasFocus &&
                      absoluteCharIndex === userInput.length
                        ? "underline"
                        : ""
                    }`}
                  >
                    {`char ${"hello"}`}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {/* Textarea for input */}
        <textarea
          ref={typingAreaRef}
          value={userInput}
          rows={6}
          onChange={handleInputChange}
          onSelect={handleCursorSelection}
          className="main-input-cs"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>
      {/* Reset Button */}
      <div className="reset">
        <button
          className="z-10"
          onClick={() => {
            setUserInput("");
            setCurrentLineIndex(0);
          }}
        >
          <i className="fa-solid fa-arrow-rotate-right text-active"></i>{" "}
          <span className="text-idle">Start Over</span>
        </button>
      </div>
    </div>
  );
};

export default TypingArea;
