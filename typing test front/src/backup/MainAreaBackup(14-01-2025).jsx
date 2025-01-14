<div
                  id="game"
                  // ref={typingAreaRef}
                  className={`typing-area ${!hasFocus ? "text-blur" : ""}`}
                >
                  <div  
                    className={`paragraph-container suds ${!hasFocus ? "text-blur" : ""}`}
                    onClick={() => {setHasFocus(true), setRootFocus(true)}}
                  >
                    <div id="words">
                      {currentParagraph?.map((word, wordIndex) => {
                        // Get the original word from paraHistory or fallback to empty string if not found

                        // Check if there's any extra characters added
                        const updatedWord = word;
                        
                        return (
                          <div
                            key={wordIndex}
                            className={`word ${wordIndex === currentWordIndex ? "current" : ""} ${skippedWords.has(wordIndex) ? "skip-underline" : ""}`}
                            ref={(el) => (wordRefs.current[wordIndex] = el)} 
                          >
                            {updatedWord.split("").map((letter, letterIndex) => {
                              // Find out if this character was typed correctly or incorrectly
                              const typed = typedLetters && typedLetters?.find(
                                (t) => t.wordIndex === wordIndex && t.letterIndex === letterIndex
                              );
                              const isCorrect = typed?.isCorrect;
                              const isExtra = typed?.type

                              // Define the class names for styling
                              let classNames = "letter ";
                              if (wordIndex === currentWordIndex && letterIndex === currentLetterIndex) {
                                classNames += "current";
                              }
                              if (isCorrect === true) {
                                classNames += " correct";
                              } else if (isCorrect === false) {
                                if(isExtra === '') {
                                  classNames += " incorrect";
                                } else if(isExtra === 'extra') {
                                  classNames += " extra";
                                }
                              }

                              return (
                                <>
                                <span key={letterIndex} className={classNames}>
                                  {letter}
                                </span>
                                </>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>