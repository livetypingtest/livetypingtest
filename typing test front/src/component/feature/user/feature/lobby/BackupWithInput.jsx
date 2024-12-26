import { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../../shared/header/Header'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleTest, resetState } from '../../../../../redux/UserDataSlice';
import { dynamicToast } from '../../../../shared/Toast/DynamicToast'
import { easyWords, generateParagraph, hardWords, mediumWords } from './ParagraphGenerater';
import DynamicAlert from '../../../../shared/Toast/DynamicAlert'
import { Helmet } from 'react-helmet';
import Footer from '../../../../shared/footer/Footer'
import { handleMatchHistory } from '../../../../../redux/DynamicPagesDataSlice';
import DynamicTitle from '../../../../shared/helmet/DynamicTitle';


const BackupWithInput = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const typingAreaRef = useRef(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([])
  // const isCapsLockOn = useRef(false);
  
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const paragraphs = useSelector(state => state.UserDataSlice.paragraphs)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const homePageSEO = useSelector(state => state.UserDataSlice.homePageSEO)
  const matchHistory = useSelector(state => state.DynamicPagesDataSlice.matchHistory)

  const [time, setTime] = useState(60);
  const [userInput, setUserInput] = useState("");
  const [blockKey, setBlockKey] = useState({for: '', state: false})
  const [hasFocus, setHasFocus] = useState(false);
  const [storage, setStorage] = useState("")
  const [counter, setCounter] = useState(0); // Track the number of times condition is met
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(60); // Default 30 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [paraHistory, setParasHistory] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [typedLetters, setTypedLetters] = useState([]);
  // const [skipLetters, setSkipLetters] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState();
  const [timeUp, setTimeUp] = useState(false)
  const [rootFocus, setRootFocus] = useState(false)
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showAlert, setShowAlert] = useState(false)
  const [showModal, setShowModal] = useState(false); // Control modal display
  const [alertDetail, setAlertDetail] = useState({
    title : '',
    message : '',
    type : '',
    navigateTo : '',
    confirmBtn : false
  })
  const [stats, setStats] = useState({
    wpm: [],
    accuracy: [],
    consistency: [],
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    isCompleted : false,
    timeOfCompletion : 0,
    missedChars : 0,
    correctStreak: 0,
    time: 0,
    level : ''
  });
  const [finalStats, setFinalStats] = useState({
    wpm: [],
    accuracy: [],
    consistency: [],
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    isCompleted : false,
    timeOfCompletion : 0,
    missedChars : 0,
    time: 0,
    level : ''
  })



  // Function to get a random index based on array length
  function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }

  const settingTheParagraphs = () => {
    const changeTime = {
      60: 'Min1',
      180: 'Min3',
      300: 'Min5',
    };
    const timeField = changeTime[time];

    // Check if a paragraph exists for the given time and difficulty
    if (timeField && paragraphs?.[timeField]?.[difficulty]?.length > 0) {
      const selectedParagraphs = [];
      const availableParagraphs = paragraphs[timeField][difficulty];
      const totalParagraphs = availableParagraphs.length;

      // Ensure we pick at least 3 random paragraphs (or all if less than 3 exist)
      const pickCount = Math.min(3, totalParagraphs);
      const usedIndexes = new Set();

      for (let i = 0; i < pickCount; i++) {
        let randomIndex;

        // Ensure a unique random index each time
        do {
          randomIndex = getRandomIndex(availableParagraphs);
        } while (usedIndexes.has(randomIndex));

        usedIndexes.add(randomIndex);
        selectedParagraphs.push(availableParagraphs[randomIndex]?.para || '');
      }

      // Concatenate the selected paragraphs with a space
      return selectedParagraphs.join(' ');
    }

    // Return a default value if no paragraphs are found
    return '';
  };

  const getParagraph = () => {
    const paragraph = settingTheParagraphs()
    // console.log(paragraph?.split(" "))
    setCurrentParagraph(paragraph?.split(" "))
    setParasHistory(paragraph?.split(" "))
  }

  useEffect(() => {
    getParagraph()
  }, [paragraphs, time, difficulty, matchHistory]); // Dependencies: `paragraphs`, `time`, and `difficulty`


  // Focus input on load--------------------------------------------------------------------------
  useEffect(() => {
    if(hasFocus) {
      if(typingAreaRef.current){
        typingAreaRef.current.focus();
        typingAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [hasFocus]);
  // Focus input on load--------------------------------------------------------------------------

  //convert the timeer in proper format---------------------------------------------------------------
  const convertSecondsToFormattedTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60); // Get the number of minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds

    // Format the seconds to always be two digits
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Return the formatted time
    return `${minutes}:${formattedSeconds}`;
  };
  //convert the timeer in proper format---------------------------------------------------------------

  // Update elapsed time and stop timer if time limit is reached------------------------------------
  useEffect(() => {
    if (timerRunning && hasFocus) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => {
          const newElapsedTime = prev + 1;
          if (newElapsedTime >= timeLimit) {
            setTimerRunning(false);
            setTimeUp(true);
            setShowModal(true);
          }
          return newElapsedTime;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
  
    // Clear the interval if the focus is lost
    return () => {
      clearInterval();
    };
  }, [timerRunning, hasFocus, timeLimit]);
  
  // Update elapsed time and stop timer if time limit is reached------------------------------------

  // Handle paragraph difficulty change----------------------------------------------------------
  const handleDifficultyChange = (e) => {
    const newDifficulty = e;
    // console.log(newDifficulty)
    setDifficulty(newDifficulty);
    rootFocus && typingAreaRef.current.focus();
  };
  // Handle paragraph difficulty change----------------------------------------------------------

  // Calculate and update statistics-------------------------------------------------------------------

  const calculateAverage = () => {
    // Calculate WPM (Words Per Minute)
    let wpm = 0;

    if (timeLimit > 0) {
      // Count the number of correctly typed words
      const correctWords = typedLetters
        .reduce((wordCount, letter) => {
          if (letter.letterIndex === 0) wordCount++; // Count the start of each correctly typed word
          return wordCount;
        }, 0);

        
        // Calculate words per minute (1 word = 5 characters)
        if (elapsedTime > 0) {
          wpm = ((correctWords / elapsedTime) * 60).toFixed(2);
        }
    
      setStats((prevStats) => ({
        ...prevStats,
        wpm: [...prevStats.wpm, Math.min(wpm, elapsedTime > 5 ? wpm : 150)], // Cap WPM at 150 for quick tests
      }));
    }

    // Variables for accuracy and consistency calculation
    const totalCorrect = stats.correctChars; // Total number of correct characters typed
    const totalIncorrect = stats.incorrectChars; // Total number of incorrect characters typed
    const totalSkiped = stats.missedChars;
    const totalWords = paraHistory?.join(" ")?.replace(/ /g, "")?.length
    const totalTyped = totalCorrect + totalIncorrect + totalSkiped; // Total characters typed (correct + incorrect)
    
    // Calculate accuracy: (correctChars / totalTypedChars) * 100
    let accuracy = 0;
    if (totalTyped > 0) {
      accuracy = Math.floor((totalCorrect / totalTyped) * 100); // Accuracy as an integer
    }
    
    // Calculate consistency based on correct typing streaks
    let consistency = 0;
    if (totalTyped > 0) {
      // Logic for consistency: Measure the ratio of correct characters over time
      const correctStreakWeight = stats.correctStreak || 1; // A multiplier for consistent streaks
      const streakEffect = correctStreakWeight / totalTyped;
      
      // console.log(totalCorrect, totalTyped, streakEffect, ((totalCorrect / totalTyped) + streakEffect) * 100)
      consistency = parseFloat(((totalCorrect / totalWords) * 100).toFixed(2)); // Consistency as a float
    }

    // Update the stats with accuracy and consistency
    setStats((prevStats) => ({
      ...prevStats,
      accuracy: [...prevStats.accuracy, accuracy], // Store accuracy as an integer in the array
      consistency: [...prevStats.consistency, consistency], // Store consistency as a float in the array
    }));

  }

  const calculateState = (input, last) => {
    const userWord = input?.split("")?.concat(last)?.join("")?.trim(); // The word typed by the user
    const currentParaWord = paraHistory[currentWordIndex]?.split(""); // The word from paraHistory
    const userWordArray = userWord?.split(""); // The word typed by the user, split into an array
  
  
  
    // Check if user has typed till the word's expected length
    if (currentParaWord?.length <= userWordArray?.length) {
      // Iterate through userWord to check correctness
      userWordArray.forEach((letter, letterIndex) => {
        if (currentParaWord[letterIndex] === letter) {
          // Correctly typed letter
          setStats((prevStats) => ({
            ...prevStats,
            correctChars: prevStats.correctChars + 1,
            correctStreak: (prevStats.correctStreak || 0) + 1,
          }));
        } else {
          // Incorrectly typed letter
          setStats((prevStats) => ({
            ...prevStats,
            incorrectChars: prevStats.incorrectChars + 1,
            correctStreak: 0,
          }));
        }
      });
  
      // Handle the case where there are extra characters typed
      const extraChars = userWordArray?.length - currentParaWord?.length;
      if (extraChars > 0) {
        setStats((prevStats) => ({
          ...prevStats,
          extraChars: prevStats.extraChars + extraChars,
          correctStreak: 0,
        }));
      }
    } else if (currentParaWord?.length > userWordArray?.length) {
      // Handle the case where paraHistory word is longer than the typed word (skipped chars)
      const skippedChars = currentParaWord?.length - userWordArray?.length;
      // console.log("Skipped Characters: ", skippedChars);
      setStats((prevStats) => ({
        ...prevStats,
        missedChars: prevStats.missedChars + skippedChars,
        correctStreak: 0,
      }));
  
      // Track typed characters for correctness
      userWordArray.forEach((letter, letterIndex) => {
        if (currentParaWord[letterIndex] === letter) {
          setStats((prevStats) => ({
            ...prevStats,
            correctChars: prevStats.correctChars + 1,
            correctStreak: (prevStats.correctStreak || 0) + 1,
          }));
        } else {
          setStats((prevStats) => ({
            ...prevStats,
            incorrectChars: prevStats.incorrectChars + 1,
            correctStreak: 0,
          }));
        }
      });
    }
  };
  
  // Calculate and update statistics-------------------------------------------------------------------


  // updation of finalStats-------------------------------------------------------------------
  useEffect(()=>{
    setFinalStats(stats)
  },[stats])
  // updation of finalStats-------------------------------------------------------------------
  
  // updation Difficulty in stats-------------------------------------------------------------------
  useEffect(()=>{
    setStats((prevStats) => ({
      ...prevStats,   // Spread the previous stats object
      level: difficulty,  // Update the 'level' property
      time: timeLimit,
      timeOfCompletion: timeLimit        // Update the 'time' property
    }));
  }, [difficulty, timeLimit])
  // updation Difficulty in stats-------------------------------------------------------------------
  
  // After test Done-------------------------------------------------------------------
  useEffect(()=>{
    if(showModal) {
      const result = {
        data : finalStats,
        date : new Date()
      }
      // console.log(result)
      localStorage.setItem('stats', JSON.stringify(result))
      dispatch(handleMatchHistory({state: true, time : result.data.time, level : result.data.level}))
      if(localStorage.getItem('userToken')) {
          dispatch(handleTest(result))
      } else {
          navigate(`/stats`)
      }
    }
  },[showModal])
  // After test Done-------------------------------------------------------------------
  
  // Action after the test fullfilled-------------------------------------------------------------------
  useEffect(()=>{
    if(isFullfilled){
      if(fullFillMsg?.message === "test complete"){
        if(localStorage.getItem('userToken')) {
          navigate('/stats')
          dispatch(resetState())
        }
      }
    }
  }, [isFullfilled, fullFillMsg])
  // Action after the test fullfilled-------------------------------------------------------------------

  // Reset the typing test-----------------------------------------------------------------------------
  const resetTest = () => {
    typingAreaRef.current.focus();
    const wordElement = document.getElementsByClassName('suds')
    wordElement[0].style.marginTop = '0px'
    setUserInput('');
    setElapsedTime(0);
    setTimerRunning(false);
    setCurrentLetterIndex(0)
    setCurrentWordIndex(0)
    setStats({
      wpm: [],
      accuracy: [],
      consistency: [],
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      missedChars : 0,
      isCompleted : false,
      timeOfCompletion : 0,
      time: 0,
      level : ''
    });
    setTypedLetters([])
    // setSkipLetters([])
    getParagraph()
  };
  // Reset the typing test-----------------------------------------------------------------------------
  
  // set the selected time in stats-----------------------------------------------------------------------------
  const handleTime = (value) => {
    setTime(value)
    // setStats((prevStats) => ({
    //   ...prevStats,   // Spread the previous stats object
    //   time: value     // Update the 'time' property
    // }));    
    setTimeLimit(Number(value))
    rootFocus && typingAreaRef.current.focus();
  }
  // set the selected time in stats-----------------------------------------------------------------------------

  // Click outside handler to set focus off when clicking outside typing area------------------------
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setHasFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Click outside handler to set focus off when clicking outside typing area------------------------

  useEffect(()=>{
    if(localStorage.getItem('isSignout')) {
      dynamicToast({ message: 'Logged out Successfully!', timer: 3000, icon: 'info' })
      setTimeout(()=>{
        localStorage.removeItem('isSignout')
      }, 3500)
    }
  }, [])

  useEffect(()=>{
    if(localStorage.getItem('accountDelete')) {
      dynamicToast({ message: 'Account Deleted Successfully', timer: 3000, icon: 'info' })
      setTimeout(()=>{
        localStorage.removeItem('accountDelete')
      }, 3500)
    }
  }, [])

  // handle successfully login toasts-------------------------------------------------------------------
  useEffect(()=>{
    if(localStorage.getItem('isSignin')) {
      dynamicToast({ message: 'Logged in Successfully!', timer: 3000, icon: 'success' });
      setTimeout(()=>{
        localStorage.removeItem('isSignin')
      }, 3500)
    }
  },[])
  // handle successfully login toasts-------------------------------------------------------------------

  // Chencking is the user Blocked -----------------------------------------------------------------
  useEffect(() => {
    if(localStorage.getItem('isBlocked')) {
      setShowAlert(true)
      setAlertDetail({
        title : 'Account Blocked!',
        type : 'error',
        message : `Your Account has been Blocked! Contact to Admin`,
        navigateTo : '',
        confirmBtn : true
      })
      setTimeout(()=>{
        localStorage.removeItem('isBlocked')
        setShowAlert(false)
      }, 1000)
    }
}, [])

  const handleAlertClose = () => {
    setShowAlert(false); // Set showAlert to false
  };
  // Chencking is the user Blocked -----------------------------------------------------------------
  
  // Getting match history from local storage -----------------------------------------------------------------
  useEffect(() => {
    if(matchHistory.state) {
        // Set difficulty and time based on matchHistory
      setDifficulty(matchHistory?.level || 'easy');
      setTime(matchHistory?.time || 60);
      setTimeLimit(matchHistory?.time || 60);
      const paragraph = settingTheParagraphs()
      setCurrentParagraph(paragraph?.split(" "))
      setParasHistory(paragraph?.split(" "))
    }
  }, [matchHistory])
  // Getting match history from local storage -----------------------------------------------------------------
  
  // Putting eye on caps lock -----------------------------------------------------------------
  const handleKeyUp = (event) => {
    // Check if Caps Lock is on and update the ref
    const capsLockStatus = event.getModifierState("CapsLock");
    setIsCapsLockOn(capsLockStatus);
  };
  // Putting eye on caps lock -----------------------------------------------------------------

  const adjustScroll = () => {
    if(window.innerWidth >= 767) {
      const currentWordRef = wordRefs.current[currentWordIndex];
      if (currentWordRef) {
        const rect = currentWordRef.getBoundingClientRect();
        // console.log(rect.top > 300);
      
        if (rect.top > 350) {
          const wordElement = document.getElementsByClassName('suds');
          if (wordElement.length > 0) {
            // Calculate the new marginTop based on the counter value
            const newMarginTop = `-${70 * (counter)}px`;
            wordElement[0].style.marginTop = newMarginTop;
            // console.log(`New marginTop: ${newMarginTop}`);
      
            // Increment the counter for the next time
            setCounter((prevCounter) => prevCounter + 1);
          } else {
            console.error('Element with class "suds" not found');
          }
        }
      }
    } else {
      const currentWordRef = wordRefs.current[currentWordIndex];
      if (currentWordRef) {
        const rect = currentWordRef.getBoundingClientRect();
        // console.log(rect.top );
        // return
        if (rect.top > 390) {
          const wordElement = document.getElementsByClassName('suds');
          if (wordElement.length > 0) {
            // Calculate the new marginTop based on the counter value
            // const newMarginTop = `-${40 * (counter)}px`;
            const newMarginTop = `-${Math.min(40 * counter, 300)}px`; 
            wordElement[0].style.marginTop = newMarginTop;
      
            // Increment the counter for the next time
            setCounter((prevCounter) => prevCounter + 1);
          } else {
            console.error('Element with class "suds" not found');
          }
        }
      }
    }
  }

  const blockRestrictedKeys = (e) => {
    // Handle keydown event
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault(); // Prevent the default copy action
      setBlockKey({ for: 'Copying is disabled', state: true });
      setTimeout(() => { setBlockKey({ for: '', state: false }); }, 1500);
    }
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault(); // Prevent the default paste action
      setBlockKey({ for: 'Pasting is disabled', state: true });
      setTimeout(() => { setBlockKey({ for: '', state: false }); }, 1500);
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault(); // Prevent Backspace and Delete actions
      setBlockKey({ for: 'Deleting is disabled', state: true });
      setTimeout(() => { setBlockKey({ for: '', state: false }); }, 1500);
    }
  }

  let key = ""; // Local variable for current characters
  let wordArray = []; // Local variable for completed words
  let skipLetters = []

  const handleKeyPress = (e) => {
    if(hasFocus) {
      
      const input = e.target.value; // Current input value
      const lastChar = input[input.length - 1]; // Get the last character typed
      let type = ''

    if (lastChar === " ") {
      // If space is pressed
      if (key.length > 0) {
        const completedWord = key.join(""); // Form the completed word
        wordArray.push(completedWord); // Add the completed word to wordArray
        key = []; // Reset key for the new word
      }
      e.target.value = ""; // Clear the input field after processing the word
    } else if (lastChar) {
      // For any other character
      key = lastChar; // Add the character to key
    }
 
      // Start timer if it's not already running
      if (key.length === 1 && !timerRunning) {
        setTimerRunning(true);
      }


    
      if (input?.split("")[currentLetterIndex] === " ") {
        e.preventDefault()
        if (input.trim().length === 0) {
          return;
        }  
        
        if (currentWordIndex > 0) {
          // Mark the previous word as "skipped"
          skipLetters = [...skipLetters,{
            wordIndex: currentWordIndex - 1,
            type: "skipped",
          }];
        }

        setStorage("")
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentLetterIndex(0);
        calculateState(userInput, key)
        setUserInput("")
        return;
      } 

console.log("skipLetters",skipLetters)

      skipLetters?.forEach((value, index) => {
        value?.type === 'skipped' && console.log(value)
        if (currentWordIndex > 0) {
          if(currentLetterIndex === 0) {
            if(value.type === 'skipped') {
              const previousWord = wordRefs.current[currentWordIndex - 1];
              if (previousWord) {
                previousWord.classList.add("skip-underline");
              }
            }
          }
        }
      })

    
      if (key.length >= 1) {
        const currentWord = currentParagraph[currentWordIndex];
        const historyWord = paraHistory[currentWordIndex];
        const historyWordLength = historyWord?.length;
    
        let updatedWord = currentWord;
        let isCharacterCorrect = false;
    
        if (currentLetterIndex < historyWordLength) {
          const expectedChar = historyWord[currentLetterIndex];
    
          if (key === expectedChar) {
            isCharacterCorrect = true;
            updatedWord = currentWord?.slice(0, currentLetterIndex) + key + currentWord.slice(currentLetterIndex + 1);
          } else {
            isCharacterCorrect = false;
          }
        } else {
          const baseWord = historyWord?.slice(0, historyWordLength);
          let extraChars = currentWord?.slice(historyWordLength);
    
          if (isCharacterCorrect) {
            extraChars = extraChars + key;  // Append the correct character
          } else {
            type = 'extra'
            extraChars = extraChars?.slice(0, currentLetterIndex - historyWordLength) + key;
          }
    
          updatedWord = baseWord + extraChars.replace(/-$/, "");
        }
    
        // Update the word in currentParagraph
        const updatedWords = [...currentParagraph];
        updatedWords[currentWordIndex] = updatedWord;
        setCurrentParagraph(updatedWords);
        setUserInput(userInput + key)
        calculateAverage()
    
        
        setTypedLetters((prev) => [
          ...prev,
          { wordIndex: currentWordIndex, letterIndex: currentLetterIndex, isCorrect: isCharacterCorrect, type: type },
        ]);
    
        setCurrentLetterIndex((prev) => prev + 1);
      }
    }
  };

  useEffect(()=>{
    if(timerRunning) {
      adjustScroll()
    }
  })

  // useEffect(()=>{console.log(typedLetters)}, [typedLetters])

  return (
    <>

      {
        homePageSEO && (<DynamicTitle title={homePageSEO?.seoTitle} description={homePageSEO.seoDescription} icon={homePageSEO?.imageUrl} />)
      }

      <Header />
      <section className='lobby-area pb-3'>
        <div className="container">
          <div 
            className="row custom-align"
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyUp}
          >
            <div ref={containerRef} className="cutom-lobby-head">
              <div className='lobby-menu'>
                <ul style={{ visibility: timerRunning ? 'hidden' : 'visible' }}>
                  <li>Time :</li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleTime(60); }}
                      className={timeLimit === 60 ? 'active' : ''}
                    >
                      01 Min
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleTime(180); }}
                      className={timeLimit === 180 ? 'active' : ''}
                    >
                      03 Min
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleTime(300); }}
                      className={timeLimit === 300 ? 'active' : ''}
                    >
                      05 Min
                    </button>
                  </li>
                </ul>
              </div>
              <div className="lobby-menu text-center">
                <h4 className={`${timerRunning ? 'text-active' : 'text-idle'}`}>
                  {timeLimit - elapsedTime > 0 ? convertSecondsToFormattedTime(timeLimit - elapsedTime) : 0}
                </h4>
              </div>
              <div className='lobby-menu'>
                <ul style={{ visibility: timerRunning ? 'hidden' : 'visible' }}>
                  <li>Level :</li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleDifficultyChange('easy'); }}
                      className={difficulty === 'easy' ? 'active' : ''}
                    >
                      Easy
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleDifficultyChange('medium'); }}
                      className={difficulty === 'medium' ? 'active' : ''}
                    >
                      Medium
                    </button>
                  </li>
                  <li>
                    <button
                      onMouseDown={(e) => { e.preventDefault(); handleDifficultyChange('hard'); }}
                      className={difficulty === 'hard' ? 'active' : ''}
                    >
                      Hard
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 py-4">
              {/* Overlay for blur effect and user instruction */}
              {!hasFocus && (
                <div className="typing-overlay" onClick={() => {setHasFocus(true), setRootFocus(true)}}>
                  <p>Click here to continue typing!</p>
                </div>
              )}
  <input
    style={{ height: 0, width: 0, overflow: "hidden" }}
    ref={typingAreaRef}
    value={storage}
    onChange={(e) => {
      handleKeyPress(e);
      setStorage(e.target.value);
    }}
    type="text"
  />
              <div
  id="game"
  tabIndex={0}
  className={`typing-area ${!hasFocus ? "text-blur" : ""}`}
  onClick={() => {
    typingAreaRef.current.focus();
    setRootFocus(true);
  }}
  onFocus={() => {
    setHasFocus(true);
    setRootFocus(true);
  }}
  onBlur={() => {
    setHasFocus(false);
    setRootFocus(false);
  }}
  onKeyDown={(e) => {
    blockRestrictedKeys(e);
  }}
>
  <div
    className={`paragraph-container suds ${!hasFocus ? "text-blur" : ""}`}
    onClick={() => {
      setHasFocus(true);
      setRootFocus(true);
    }}
  >
    <div id="words">
      {currentParagraph?.map((word, wordIndex) => {
        return (
          <div
            key={wordIndex}
            className={`word ${wordIndex === currentWordIndex ? "current" : ""}`}
            ref={(el) => (wordRefs.current[wordIndex] = el)}
          >
            {word.split("").map((letter, letterIndex) => {
              // Find out if this character was typed correctly or incorrectly
              const typed = typedLetters?.find(
                (t) => t.wordIndex === wordIndex && t.letterIndex === letterIndex
              );
              const isCorrect = typed?.isCorrect;
              const isExtra = typed?.type;

              // Define the class names for styling
              let classNames = "letter ";
              if (wordIndex === currentWordIndex && letterIndex === currentLetterIndex) {
                classNames += "current";
              }
              if (isCorrect === true) {
                classNames += " correct";
              } else if (isCorrect === false) {
                if (isExtra === "") {
                  classNames += " incorrect";
                } else if (isExtra === "extra") {
                  classNames += " extra";
                }
              }

              return (
                <span key={letterIndex} className={classNames}>
                  {letter}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  </div>
</div>
              <div className='reset'><button className='z-10' onClick={()=>{resetTest(), typingAreaRef.current.focus();}}><i className="fa-solid fa-arrow-rotate-right text-active"></i> <span className='text-idle'>Start Over</span></button></div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-7">
                <div className="status">
                  <div>
                    <h4>WPM</h4>
                    <h1>{stats.wpm[stats?.wpm?.length - 1] || 0}</h1>
                  </div>
                  <div>
                    <h4>Accuracy</h4>
                    <h1>{stats.accuracy[stats?.accuracy?.length - 1] || 0}<span>%</span></h1>
                  </div>
                  <div>
                    <h4>Consistency</h4>
                    <h1>{stats.consistency[stats?.consistency?.length - 1] || 0}<span>%</span></h1>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-5 custom-footer-lobby">
                <div className='width-80'>
                  <div className="footer">
                    <ul>
                      <li><NavLink to={checkUserToken ? '/user/contact' : '/contact'}>Contact Us &nbsp; |</NavLink></li>
                      <li><NavLink to={checkUserToken ? '/user/about' : '/about'}>About &nbsp; |</NavLink></li>
                      <li><NavLink to={checkUserToken ? '/user/privacy' : '/privacy'}>Privacy Policy &nbsp; |</NavLink></li>
                      <li><NavLink to={checkUserToken ? '/user/term-condition' : '/term-condition'}>Terms & Condition</NavLink></li>
                    </ul>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
                
      <Footer />
      
      {
        timeUp && (
          <div className="blur-overlay">
          <div className="overlay-message">
            <h1>{stats.isCompleted ? 'Test Completed' : 'Test Over'}.....!</h1>
            <div class="loading">
          <svg class="orange">
            <g fill="none">
              <rect x="2" y="2" width="50" height="50" />
            </g>
          </svg>
          <svg class="grey">
            <g fill="none">
              <rect x="5" y="5" width="44" height="44" stroke="#ccc" stroke-width="2"/>
            </g>
          </svg>
          </div>
          </div>
        </div>
        )
      }

      
      {
        hasFocus && rootFocus && isCapsLockOn && (
          <div className="caps-alert">
            <h5 className='m-0'>CAPS LOCK</h5>
            <i class="fa-light fa-lock"></i>
          </div>
        )
      }

      {
        blockKey?.state && (
          <div className="caps-alert">
            <h5 className='m-0'>{blockKey?.for}</h5>
            <i class="fa-light fa-lock"></i>
          </div>
        )
      }

        <DynamicAlert
          type={alertDetail.type}
          title={alertDetail.title}
          message={alertDetail.message}
          trigger={showAlert} // This will trigger the alert
          navigateTo={alertDetail.navigateTo}
          confirmBtn={alertDetail.confirmBtn}
          onClose={handleAlertClose} // Pass the onClose handler
        />
    </>
  )
}

export default BackupWithInput


