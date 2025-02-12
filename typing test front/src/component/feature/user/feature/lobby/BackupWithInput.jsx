import { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../../shared/header/Header'
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleTest, resetState } from '../../../../../redux/UserDataSlice';
import { dynamicToast } from '../../../../shared/Toast/DynamicToast'
import DynamicAlert from '../../../../shared/Toast/DynamicAlert'
import { Helmet } from 'react-helmet';
import Footer from '../../../../shared/footer/Footer'
import { handleMatchHistory } from '../../../../../redux/DynamicPagesDataSlice';
import DynamicTitle from '../../../../shared/helmet/DynamicTitle';
import { SOUND_CHERRY, SOUND_MAP, SOUND_KEYBOARD, SOUND_WRITER } from '../../../../shared/sound/sound';
import Button from '../../../../shared/sound/Button';
import useSound from 'use-sound';
import ShowStats from './ShowStats';
import LobbyHeader from './LobbyHeader';
const BackupWithInput = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const typingAreaRef = useRef(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([])
  const scrollLock = useRef(false)
  const letterRef = useRef([]); 

  
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const paragraphs = useSelector(state => state.UserDataSlice.paragraphs)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const homePageSEO = useSelector(state => state.UserDataSlice.homePageSEO)
  const matchHistory = useSelector(state => state.DynamicPagesDataSlice.matchHistory)

  const [time, setTime] = useState(60);
  const [dynamicThreshold, setDynamicThreshold] = useState(0)
  const [caretPosition, setCaretPosition] = useState({left: 0, top: 0})
  const [prevCaretPosition, setPrevCaretPosition] = useState({ left: 0, top: 0 });
  const [skippedWords, setSkippedWords] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [blockKey, setBlockKey] = useState({for: '', state: false})
  const [hasFocus, setHasFocus] = useState(true);
  const [storage, setStorage] = useState("")
  const [soundType, setSoundType] = useState('typewriter')
  const [soundMode, setSoundMode] = useState(false)
  const [counter, setCounter] = useState(0); // Track the number of times condition is met
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(60); // Default 30 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
  const [paraHistory, setParasHistory] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [typedLetters, setTypedLetters] = useState([]);
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
    csAccuracy: [],
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
    csAccuracy: [],
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

  const [playCherry] = useSound(SOUND_MAP[SOUND_CHERRY], { volume: 0.5 });
  const [playKeyboard] = useSound(SOUND_MAP[SOUND_KEYBOARD], { volume: 0.5 });
  const [playWriter] = useSound(SOUND_MAP[SOUND_WRITER], { volume: 0.5 });

  let key = ""; // Local variable for current characters
  let wordArray = []; // Local variable for completed words

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      const getIndex = getRandomIndex(paragraphs[timeField][difficulty]);
      return paragraphs[timeField][difficulty][getIndex]?.para

    // This logic used to get multiple paragraphs and returned by concatinating them--------------------

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

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };
  
  const getParagraph = () => {
    const paragraph = settingTheParagraphs();
    let wordsArray = paragraph?.split(" ");
  
    if (wordsArray) {
      wordsArray = shuffleArray(wordsArray);
    }
  
    // console.log(wordsArray);
    setCurrentParagraph(wordsArray);
    setParasHistory(wordsArray);
  };
  

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

  const calculateWPM = () => {

    // Calculate WPM (Words Per Minute)
    let wpm = 0;

    if (timeLimit > 0) {
      // Count the number of correctly typed words
      // const correctWords = typedLetters
      //   .reduce((wordCount, letter) => {
      //     if (letter.letterIndex === 0) wordCount++; // Count the start of each correctly typed word
      //     return wordCount;
      //   }, 0);
      const correctWords = typedLetters
        .reduce((wordCount, letter) => {
          if (letter.isCorrect) wordCount++; // Count the start of each correctly typed word
          return wordCount;
        }, 0);

        
        // Calculate words per minute (1 word = 5 characters)
        if (elapsedTime > 0) {
          wpm = ((correctWords / 5) * (60 / elapsedTime)).toFixed(2);
        }
    
      setStats((prevStats) => ({
        ...prevStats,
        wpm: [...prevStats.wpm, Math.min(wpm, elapsedTime > 5 ? wpm : 150)], // Cap WPM at 150 for quick tests
      }));
    }

  }

  const calculateAverage = () => {

    // Variables for accuracy and consistency calculation
    const totalCorrect = stats.correctChars; // Total number of correct characters typed
    const totalIncorrect = stats.incorrectChars; // Total number of incorrect characters typed
    const totalSkiped = stats.missedChars;
    const totalWords = paraHistory?.join(" ")?.replace(/ /g, "")?.length
    const totalTyped = totalCorrect + totalIncorrect + totalSkiped; // Total characters typed (correct + incorrect)
    
    // Calculate accuracy: (correctChars / totalTypedChars) * 100
    let accuracy = 100;
    if (totalTyped > 0) {
      accuracy = Math.floor((totalCorrect / totalTyped) * 100); // Accuracy as an integer
    }
    // console.log('totalTyped :',totalTyped, 'totalCorrect :',totalCorrect)
    
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

  const calculateCsAccuracy = () => {

    // Variables for accuracy and consistency calculation
    const totalCorrect = stats.correctChars; // Total number of correct characters typed
    const totalIncorrect = stats.incorrectChars; // Total number of incorrect characters typed
    const totalSkiped = stats.missedChars;
    const totalTyped = totalCorrect + totalIncorrect + totalSkiped; // Total characters typed (correct + incorrect)
    
    // Calculate accuracy: (correctChars / totalTypedChars) * 100
    let accuracy = 100;
    if (totalTyped > 0) {
      accuracy = Math.floor((totalCorrect / totalTyped) * 100); // Accuracy as an integer
    }

    // Update the stats with accuracy and consistency
    setStats((prevStats) => ({
      ...prevStats,
      csAccuracy: [...prevStats.csAccuracy, accuracy], // Store accuracy as an integer in the array
    }));


  }

  const calculateState = (inputString, isBackSpace) => {

    // Extract the last letter from the input string
    let inputLetter = inputString.charAt(inputString.length - 1); // Get the last character from the input string
    let expectedLetter
    if(isBackSpace !== 'BackSpace') {
      // Get the current expected letter from paraHistory at the correct position
      expectedLetter = paraHistory[currentWordIndex]?.[currentLetterIndex - 1];
    } else {
      expectedLetter = paraHistory[currentWordIndex]?.[currentLetterIndex - 2];
    }
    
    // console.log(`Input: ${inputLetter}, Expected: ${expectedLetter}`);
  
    // Check if the typed letter matches the expected letter
    if (expectedLetter === inputLetter) {
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
  
    
  };
  
  const calculateExtraMissed = (inputString) => {
    // Handle the case where there are extra characters typed
    const currentParaWord = paraHistory[currentWordIndex]?.split(""); // The word from paraHistory
    const extraChars = inputString?.length - currentParaWord?.length;
    if (extraChars > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        extraChars: prevStats.extraChars + extraChars,
        correctStreak: 0,
      }));
    }
    if (currentParaWord?.length > inputString?.length) {
      // Handle the case where paraHistory word is longer than the typed word (skipped chars)
      const skippedChars = currentParaWord?.length - inputString?.length;
      // console.log("Skipped Characters: ", skippedChars);
      setStats((prevStats) => ({
        ...prevStats,
        missedChars: prevStats.missedChars + skippedChars,
        correctStreak: 0,
      }));
    }
  }
  
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
  useEffect(() => {
    if (!showModal) return; 
  
    setFinalStats((prev) => {
      // Only update if time or level is missing in finalStats
      if (!prev?.time && !prev?.level) {
        return { ...prev, time, level: difficulty };
      }
      return prev; 
    });
  
    // Prepare the result object
    const result = {
      data: finalStats?.time && finalStats?.level ? finalStats : { ...finalStats, time, level: difficulty },
      date: new Date(),
    };
  
    // Store result in localStorage
    localStorage.setItem('stats', JSON.stringify(result));
  
    // Dispatch actions
    dispatch(handleMatchHistory({ state: true, time: result.data.time, level: result.data.level }));
  
    // Conditionally dispatch or navigate based on userToken
    if (localStorage.getItem('userToken')) {
      dispatch(handleTest(result));
    } else {
      navigate('/stats');
    }
  }, [showModal, finalStats, time, difficulty, dispatch, navigate]);
  
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
    const wordElement = document.getElementsByClassName('suds')
    wordElement[0].style.marginTop = '0px'
    key = []
    wordArray = []
    setElapsedTime(0);
    setTimerRunning(false);
    setCurrentLetterIndex(0)
    setSkippedWords(new Set())
    resetCaretPosition()
    setStorage("")
    setCurrentWordIndex(0)
    setCounter(0)
    setStats({
      wpm: [],
      accuracy: [],
      consistency: [],
      csAccuracy: [],
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
    getParagraph()
    typingAreaRef.current.focus();
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

  // useEffect(()=>{console.log('level',finalStats.level), console.log('time',finalStats.time)}, [finalStats])
  
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

  // Manage the Paragraph Scrolling ---------------------------------------------------------
  const adjustScroll = () => {
    if (!isMobile) {
      const isSmallDesktop = window.innerWidth <= 1300 && window.innerWidth >= 1024;
      const threshold = isSmallDesktop ? 280 : dynamicThreshold;
      handleScroll(threshold, 70);
    } else {
      handleScroll(390, 55);
    }
  };
  
  // Helper function to handle the scrolling logic with smooth transition
  const handleScroll = (threshold, offset) => {
    const currentWordRef = wordRefs.current[currentWordIndex];
    if (currentWordRef) {
      const rect = currentWordRef.getBoundingClientRect();
      // console.log(rect.top)
  
      if (rect.top > threshold && !scrollLock.current) {
        const wordElement = document.getElementsByClassName("suds");
        if (wordElement.length > 0) {
          // Lock scrolling to prevent multiple triggers
          scrollLock.current = true;
  
          // Add a smooth transition for the margin-top property
          wordElement[0].style.transition = "margin-top 0.3s ease-in-out";
  
          // Calculate the new marginTop based on the counter value
          const newMarginTop = `-${offset * counter}px`;
          wordElement[0].style.marginTop = newMarginTop;
  
          // Increment the counter for the next time
          setCounter((prevCounter) => prevCounter + 1);
  
          // Unlock scrolling after the transition duration
          setTimeout(() => {
            scrollLock.current = false;
          }, 300); // Match the transition duration
        } else {
          console.error('Element with class "suds" not found');
        }
      }
    }
  };
  // Manage the Paragraph Scrolling ---------------------------------------------------------

  // Manage Blocking the Restricted Keys ---------------------------------------------------------
  const blockRestrictedKeys = (e) => {
    // Handle ESC key press
    if (e.key === "Escape") {
      e.preventDefault();
      resetTest();
      return;
    }

    // Handle keydown event for disabling copying and pasting
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setBlockKey({ for: "Copying is disabled", state: true });
      setTimeout(() => {
        setBlockKey({ for: "", state: false });
      }, 1500);
      return;
    }
    if (e.ctrlKey && e.key === "v") {
      e.preventDefault();
      setBlockKey({ for: "Pasting is disabled", state: true });
      setTimeout(() => {
        setBlockKey({ for: "", state: false });
      }, 1500);
      return;
    }

    // if (e.key === 'Backspace' || e.key === 'Delete') {
    //   e.preventDefault(); // Prevent Backspace and Delete actions
    //   setBlockKey({ for: 'Deleting is disabled', state: true });
    //   setTimeout(() => { setBlockKey({ for: '', state: false }); }, 1500);
    // }
  
    // Handle Backspace (deletes the last letter typed)
    if (e.key === "Backspace") {
      e.preventDefault();
      handleBackSpace('desktop')
      return; // Prevent default behavior
    }

  };
  // Manage Blocking the Restricted Keys ---------------------------------------------------------

  // Manage Backspace Triggering ---------------------------------------------------------
  const handleBackSpace = (check) => {
    if(currentLetterIndex > 1) {
      const lastTypedLetter = typedLetters.filter(
        (item) =>
          item.letterIndex !== currentLetterIndex || item.wordIndex !== currentWordIndex
      )
      const {isCorrect, type} = lastTypedLetter
      // console.log(lastTypedLetter[0])
      setTypedLetters((prev) => {
        const updated = prev.filter(
          (item) =>
            item.letterIndex !== currentLetterIndex - 1 || item.wordIndex !== currentWordIndex
        );
        return updated;
      });
      const count = typedLetters[typedLetters?.length - 1]?.letterIndex
      setCurrentLetterIndex(check === 'desktop' ? count + 1 : count)
      const preStorage = storage?.split("")?.slice(0, currentLetterIndex - 1)?.join("")
      setStorage(preStorage)
      // Handle extra letters in the typed word
      const expectedWord = paraHistory[currentWordIndex]; // Original expected word
      const typedWord = currentParagraph[currentWordIndex]; // Typed word so far

      if (typedWord.length > expectedWord.length) {
        // If there are extra letters, remove the last one
        const correctedWord = typedWord.slice(0, currentLetterIndex - 1); // Remove the last extra character
        const updatedParagraph = [...currentParagraph];
        updatedParagraph[currentWordIndex] = correctedWord;
        setCurrentParagraph(updatedParagraph);
      }
    }
  }
  // Manage Backspace Triggering ---------------------------------------------------------
  
  // Manage User Inputs  ---------------------------------------------------------
  const handleKeyPress = (e) => {
    if (hasFocus) {
      const input = e.target.value; // Current input value
      const lastChar = input[input.length - 1]; // Get the last character typed

      if(isMobile) {
        if(storage?.length >= input?.length) {
          handleBackSpace('mobile')
          return
        }
      }

      if(soundMode) {
        playSound()
      }
  
      if (lastChar === " ") {
        // Handle spacebar input (word completion)
        if (key.length > 0) {
          const completedWord = key.join(""); // Form the completed word
          wordArray.push(completedWord); // Add the completed word to wordArray
          key = []; // Reset key for the new word
        }
  
        e.target.value = ""; // Clear the input field after processing the word
  
        // Process word transition and other calculations
        if (input.trim().length > 0) {
          if (
            input?.split("")?.length - 1 !== paraHistory[currentWordIndex]?.length
          ) {
            // Mark the current word as skipped
            setSkippedWords((prev) => new Set(prev).add(currentWordIndex));
          }
          setStorage("");
          calculateExtraMissed(input?.trim())
          setCurrentWordIndex((prev) => prev + 1); // Move to the next word
          setCurrentLetterIndex(0); // Reset letter index for the new word
        }
        return; // Exit function to prevent further processing
      }
  
      // updateCaretPosition(lastChar)

      // For other characters (not space)
      if (lastChar) {
        key = lastChar; // Add the character to key array
      }
  
      // Start timer if it's not already running
      if (key?.length === 1 && !timerRunning) {
        setTimerRunning(true);
      }
  
      // Handle character processing
      if (key.length >= 1) {
        const currentWord = currentParagraph[currentWordIndex];
        const historyWord = paraHistory[currentWordIndex];
        const historyWordLength = historyWord?.length;
  
        let updatedWord = currentWord;
        let isCharacterCorrect = false;
        let type = "";
  
        if (currentLetterIndex < historyWordLength) {
          const expectedChar = historyWord[currentLetterIndex];
  
          if (key === expectedChar) {
            isCharacterCorrect = true;
            updatedWord =
              currentWord?.slice(0, currentLetterIndex) +
              key +
              currentWord.slice(currentLetterIndex + 1);
          } else {
            isCharacterCorrect = false;
          }
        } else {
          const baseWord = historyWord?.slice(0, historyWordLength);
          let extraChars = currentWord?.slice(historyWordLength);
          const extraCharCount =
          currentWord.length > historyWordLength
            ? currentWord.length - historyWordLength
            : 0;

          if(extraCharCount < 10) {
            if (isCharacterCorrect) {
              extraChars = extraChars + key; // Append the correct character
            } else {
              type = "extra";
              extraChars =
                extraChars?.slice(0, currentLetterIndex - historyWordLength) + key;
            }
    
            updatedWord = baseWord + extraChars.replace(/-$/, "");
          } else return
        }
  
        // Update the word in currentParagraph
        const updatedWords = [...currentParagraph];
        updatedWords[currentWordIndex] = updatedWord;
        setCurrentParagraph(updatedWords);
        calculateAverage();
  
        // Add the letter to typedLetters only if it hasn't been typed already for this index
        if (
          typedLetters?.findIndex(
            (item) =>
              item.letterIndex === currentLetterIndex &&
              item.wordIndex === currentWordIndex
          ) === -1
        ) {
          setTypedLetters((prev) => [
            ...prev,
            {
              wordIndex: currentWordIndex,
              letterIndex: currentLetterIndex,
              isCorrect: isCharacterCorrect,
              type: type,
            },
          ]);
        }
  
        setCurrentLetterIndex((prev) => prev + 1); // Move to the next letter
      }
    }
  };
  // Manage User Inputs  ---------------------------------------------------------
  
  useEffect(()=>{
    if(timerRunning) {
      adjustScroll()
    }
  })

  useEffect(() => {
    if (timerRunning) {
      // Call calculateState only if storage is not empty
      if (storage.trim() !== '') {
        if(storage?.length < currentLetterIndex) {
          calculateState(storage, 'BackSpace');
        } else {
          calculateState(storage, 'no');
        }
      }
    }
  }, [storage]);

  useEffect(() => {
    if (timerRunning && elapsedTime > 0) {
      calculateWPM();
      calculateCsAccuracy();
    }
  }, [elapsedTime, typedLetters]);

  const updateHeight = () => {
    // Get the full height of the document
    const height = document.documentElement.scrollHeight;
    setDynamicThreshold(((height - ( 119 + 59 + 457 )) / 2) + 350)

  };

  useEffect(() => {
    // Set initial height
    updateHeight();

    // Update height on window resize
    window.addEventListener("resize", updateHeight);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // Function to calculate and update the caret position
  const catchCursor = () => {
    const currentLetter =
      letterRef?.current[currentWordIndex]?.[currentLetterIndex]; 
      // console.log(currentLetter)
    if (currentLetter) {
      const rect = currentLetter.getBoundingClientRect(); 
      const newPosition = {
        left: rect.left + window.scrollX, 
        top: rect.top + window.scrollY,
      };
      setCaretPosition(newPosition);
      setPrevCaretPosition(newPosition); // Update the previous position
    } else {
      // Fallback to the previous position if currentLetter is undefined
      setCaretPosition({...prevCaretPosition, left: prevCaretPosition?.left + 22});
    }
  };

  const resetCaretPosition = () => {
    if (letterRef?.current?.[0]?.[0]) {
      const firstRect = letterRef.current[0][0].getBoundingClientRect();
      const initialPosition = {
        left: firstRect.left + window.scrollX,
        top: firstRect.top + window.scrollY,
      };

      setCaretPosition(initialPosition);
      setPrevCaretPosition(initialPosition);
    }
  };

  useEffect(() => {
    if (!timerRunning) {
      resetCaretPosition(); 
    } else {
      catchCursor();
    }
  });

  const playSound = () => {
    switch(soundType) {
      case 'cherry':
        playCherry()
        break
      case 'keyboard':
        playKeyboard()
        break
      case 'typewriter':
        playWriter()
        break
      default:
    }
  }

  return (
    <>

      {/* {
        homePageSEO && (<DynamicTitle title={homePageSEO?.seoTitle} description={homePageSEO.seoDescription} icon={homePageSEO?.imageUrl} />)
      } */}

      <DynamicTitle />

      <Header timerRunning={timerRunning} />
      <span id='caret' style={{left: caretPosition.left, top: caretPosition.top}} className={`blinking-cursor ${!timerRunning && 'blink'}`}></span>
      <section className='lobby-area pb-3'>
        <div className="container">
          <div 
            className="row custom-align"
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyUp}
          >
            <LobbyHeader 
              ref={containerRef}
              timerRunning={timerRunning}
              handleTime={handleTime}
              timeLimit={timeLimit}
              difficulty={difficulty}
              handleDifficultyChange={handleDifficultyChange}
              isMobile={isMobile}
              elapsedTime={elapsedTime}
            />
            <div className="col-md-12 position-rel py-4">
              {/* Overlay for blur effect and user instruction */}
              {!hasFocus && (
                <div className="typing-overlay" onClick={() => {setHasFocus(true), setRootFocus(true)}}>
                  <p>Click here to continue typing!</p>
                </div>
              )}
              <div
                tabIndex={0}
                onClick={() => {typingAreaRef.current.focus(), setRootFocus(true)}} 
                onFocus={() => {setHasFocus(true), setRootFocus(true)}} 
                onBlur={() => {setHasFocus(false), setRootFocus(false)}}
                onKeyDown={(e)=>{blockRestrictedKeys(e)}}
                onKeyUp={(e)=>blockRestrictedKeys(e)}
              >
                {/* <input onKeyDown={(e)=>{blockRestrictedKeys(e)}} style={{height: 0, width: 0, overflow : "hidden"}} ref={typingAreaRef} value={storage} {window.innerWidth > 767 ? onChange={(e)=>{handleKeyPress(e), setStorage(e.target.value)}} : onInput={(e)=>{handleKeyPress(e), setStorage(e.target.value)}}} type="text" name="" id="" /> */}
                <textarea
                  ref={typingAreaRef}
                  value={storage}
                  disabled={timeUp}
                  autoCapitalize='off'
                  autoComplete='off'
                  autoCorrect='off'
                  data-gramm='false'
                  data-gramm_editor='false'
                  data-enable-grammarly="false"
                  list="autocompleteOff"
                  spellCheck="false"
                  onKeyDown={(e) => blockRestrictedKeys(e)}
                  style={isMobile ? { position: 'absolute', left: '-9999px', opacity: 0 } : { height: 0, width: 0, overflow: 'hidden', position: 'absolute', left: '-9999px', opacity: 0 }}
                  type="text"
                  name=""
                  id=""
                  onChange={(e) => { handleKeyPress(e); setStorage(e.target.value)}}
                />
                <div
                  id="game"
                  className={`typing-area ${!hasFocus ? "text-blur" : ""}`}
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
                        const updatedWord = word;

                        return (
                          <div
                            key={wordIndex}
                            className={`word ${
                              wordIndex === currentWordIndex ? "current" : ""
                            } ${skippedWords.has(wordIndex) ? "skip-underline" : ""}`}
                            ref={(el) => (wordRefs.current[wordIndex] = el)}
                          >
                            {updatedWord.split("").map((letter, letterIndex) => {
                              // Find out if this character was typed correctly or incorrectly
                              const typed = typedLetters?.find(
                                (t) => t.wordIndex === wordIndex && t.letterIndex === letterIndex
                              );
                              const isCorrect = typed?.isCorrect;
                              const isExtra = typed?.type;

                              // Define the class names for styling
                              let classNames = "letter ";
                              if (
                                wordIndex === currentWordIndex &&
                                letterIndex === currentLetterIndex
                              ) {
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
                                <span 
                                  key={letterIndex}
                                  ref={(el) => {
                                    if (!letterRef.current[wordIndex]) {
                                      letterRef.current[wordIndex] = []; // Initialize array for letters
                                    }
                                    letterRef.current[wordIndex][letterIndex] = el; // Assign ref for the letter
                                  }}
                                  className={`${classNames}`}>
                                  {/* Add cursor at the current typing position */}
                                  {/* {wordIndex === currentWordIndex &&
                                    letterIndex === currentLetterIndex && (
                                      <span 
                                        className={`blinking-cursor ${!timerRunning && 'blink'}`}
                                      >
                                      </span>
                                    )} */}
                                  {letter}
                                </span>
                              );
                            })}

                            {/* If the cursor is at the end of the word, add a blinking cursor */}
                            {/* {wordIndex === currentWordIndex &&
                              currentLetterIndex === updatedWord.length && (
                                <span className="blinking-cursor"></span>
                              )} */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className='reset'>
                {/* <Button setSoundMode={setSoundMode} soundMode={soundMode} soundType={setSoundType} typingAreaRef={typingAreaRef} setHasFocus={setHasFocus} setRootFocus={setRootFocus} /> */}
                <button className='z-10' onClick={resetTest}><i className="fa-solid fa-arrow-rotate-right text-active"></i> <span className='text-idle'>Start Over</span></button>
              </div>
            </div>
            <ShowStats stats={stats} />
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


