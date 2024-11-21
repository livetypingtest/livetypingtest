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


const Lobby = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const typingAreaRef = useRef(null);
  const containerRef = useRef(null);
  const paragraphRef = useRef(null);
  const paragraphWrapperRef = useRef(null);
  // const isCapsLockOn = useRef(false);
  
  const isFullfilled = useSelector(state => state.UserDataSlice.isFullfilled)
  const paragraphs = useSelector(state => state.UserDataSlice.paragraphs)
  const fullFillMsg = useSelector(state => state.UserDataSlice.fullFillMsg)
  const isError = useSelector(state => state.UserDataSlice.isError)
  const isProcessing = useSelector(state => state.UserDataSlice.isProcessing)
  const homePageSEO = useSelector(state => state.UserDataSlice.homePageSEO)

  const [time, setTime] = useState(60);
  const [userInput, setUserInput] = useState("");
  const [blockKey, setBlockKey] = useState({for: '', state: false})
  const [hasFocus, setHasFocus] = useState(false);
  const [prevInput, setPrevInput] = useState(false);
  const [prevInputWords, setPrevInputWords] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(60); // Default 30 seconds
  const [elapsedTime, setElapsedTime] = useState(0);
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
    // missedChars : 0,
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
    // missedChars : 0,
    time: 0,
    level : ''
  })


  // Function to get a random index based on array length
  function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }

  // Function to generate paragraph based on duration and difficulty
  const generateTypingTestParagraph = () => {
    const wordsPerMinute = 70; // Average typing speed (can be adjusted)
    const totalWords = wordsPerMinute * (timeLimit / 60); // Total words to match the duration

    let wordArray;
    if (difficulty === "easy") {
        wordArray = easyWords;
    } else if (difficulty === "medium") {
        wordArray = mediumWords.concat(easyWords); // Mix easy and medium words
    } else if (difficulty === "hard") {
        wordArray = hardWords.concat(mediumWords).concat(easyWords); // Mix all words
    }

    const newParagraph = generateParagraph(wordArray, totalWords);
    return newParagraph
  };

  const settingTheParagraphs = () => {
    const changeTime = {
      60: 'Min1',
      180: 'Min3',
      300: 'Min5',
  };
  const timeField = changeTime[time];

  // Check if a paragraph exists for the given time and difficulty
  if (timeField && paragraphs?.[timeField]?.[difficulty]?.length > 0) {
      // Pick a random paragraph from existing ones
      const getIndex = getRandomIndex(paragraphs[timeField][difficulty]);
      setCurrentParagraph(paragraphs[timeField][difficulty][getIndex]?.para);
      // console.log(paragraphs[timeField][difficulty][getIndex]?.para)
  } else {
      // If no paragraph exists, generate a new one
      setCurrentParagraph(generateTypingTestParagraph())
  }
  }

  useEffect(() => {
    settingTheParagraphs()
  }, [paragraphs, time, difficulty]); // Dependencies: `paragraphs`, `time`, and `difficulty`


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
    if (timerRunning) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => {
          const newElapsedTime = prev + 1;
          if (newElapsedTime >= timeLimit) {
            setTimerRunning(false);
            setTimeUp(true)
            setShowModal(true)
          }
          return newElapsedTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning, timeLimit]);
  // Update elapsed time and stop timer if time limit is reached------------------------------------

  // Handle paragraph difficulty change----------------------------------------------------------
  const handleDifficultyChange = (e) => {
    const newDifficulty = e;
    // console.log(newDifficulty)
    setDifficulty(newDifficulty);
    rootFocus && typingAreaRef.current.focus();
  };
  // Handle paragraph difficulty change----------------------------------------------------------

  // Handle input change----------------------------------------------------------------------
  const handleInputChange = (e) => {
    const input = e.target.value;

    // Start timer if it's not already running
    if (input.length === 1 && !timerRunning) {
      setTimerRunning(true);
    }

    setUserInput(input);
    calculateStats(input);

     // Auto-scroll logic
     const wrapper = paragraphWrapperRef.current;
     const lineHeight = parseInt(getComputedStyle(wrapper).lineHeight, 10); // Get the line height
     const currentLine = Math.floor(value.length / wrapper.offsetWidth); // Estimate the current line
     wrapper.scrollTop = currentLine * lineHeight; // Scroll to the current line
  };
  // Handle input change----------------------------------------------------------------------

  // Calculate and update statistics-------------------------------------------------------------------
  const calculateStats = (input) => {
    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let isCompleted = false;
    let timeOfCompletion = 0;
  
    // Split the input and current paragraph into words
    const inputWords = input.trim().split(" ");
    const currentWordIndex = inputWords.length - 1; // Index of the current word
    const currentWord = inputWords[currentWordIndex] || ""; // Current word being typed
    const paragraphWords = currentParagraph.split(" ");
    const validWord = paragraphWords[currentWordIndex] || ""; // Correct word in the paragraph

    // Restrict backspace to within the current word
    if (inputWords.length < prevInputWords.length) {
      setUserInput(prevInput); // Revert the input to the previous state
      return;
    }
  
    // Process each character of the paragraph and compare it with the input
    [...currentParagraph].forEach((char, index) => {
      const typedChar = input[index];
  
      if (char === " ") {
        // Count extra characters typed in place of spaces
        if (typedChar && typedChar !== " ") {
          extraChars++;
        }
      } else {
        // Process non-space characters
        if (typedChar === char) {
          correctChars++;
          currentStreak++;
        } else if (typedChar && typedChar !== " ") {
          incorrectChars++;
          longestStreak = Math.max(longestStreak, currentStreak); // Update longest streak
          currentStreak = 0; // Reset current streak
        }
      }
    });
  
    // Handle extra characters beyond the paragraph length
    if (input.length > currentParagraph.length) {
      for (let i = currentParagraph.length; i < input.length; i++) {
        if (input[i] !== " ") {
          extraChars++;
        }
      }
    }
  
    // Finalize longest streak calculation
    longestStreak = Math.max(longestStreak, currentStreak);
  
    // Calculate WPM
    let wpm = 0;
    if (elapsedTime > 0) {
      const wordsTyped = input.trim().split(/\s+/).length; // Count non-empty words
      wpm = ((wordsTyped / elapsedTime) * 60).toFixed(2); // Words per minute
    }
  
    // Calculate accuracy
    const totalTypedChars = correctChars + incorrectChars; // Total meaningful input
    const accuracy = totalTypedChars > 0
      ? ((correctChars / totalTypedChars) * 100).toFixed(2)
      : 0;
  
    // Calculate consistency
    const consistency = longestStreak > 0
      ? Math.min(((longestStreak / currentParagraph.replace(/ /g, "").length) * 100).toFixed(2), 100)
      : 0;
  
    // Count non-space characters in the paragraph
    const nonSpaceCharCount = currentParagraph.replace(/ /g, "").length;
  
    // Determine if the paragraph is completed
    isCompleted = (correctChars + incorrectChars) >= nonSpaceCharCount;
    timeOfCompletion = (elapsedTime + 1);
    if (isCompleted) {
  
      // Generate and append a new paragraph if the current one is completed
      const addExtraParagraph = generateTypingTestParagraph();
      setCurrentParagraph((prevParagraph) => `${prevParagraph} ${addExtraParagraph}`);
    }
  
    // Update stats
    setStats((prevStats) => ({
      ...prevStats,
      wpm: [...prevStats.wpm, parseFloat(wpm)], // Append the new WPM value
      accuracy: [...prevStats.accuracy, parseFloat(accuracy)], // Append the new Accuracy value
      consistency: [...prevStats.consistency, parseFloat(consistency)], // Append the new Consistency value
      correctChars,
      incorrectChars,
      extraChars,
      isCompleted,
      timeOfCompletion
    }));
  
    // Store the previous state of input and words
    setPrevInput(input);
    setPrevInputWords(inputWords);
  };
  
  // Calculate and update statistics-------------------------------------------------------------------
  
  // Eyes on the Completion of test before selected Time-------------------------------------------------
  // useEffect(()=>{
  //   if(stats.isCompleted){
  //       setTimerRunning(false);
  //       setTimeUp(true)
  //       setShowModal(true)
  //   }
  // }, [stats])
  // Eyes on the Completion of test before selected Time-------------------------------------------------

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
      time: timeLimit         // Update the 'time' property
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
      localStorage.setItem('stats', JSON.stringify(result))
      localStorage.setItem('matchHistory', JSON.stringify({time : result.data.time, level : result.data.level}))
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
    setUserInput('');
    setPrevInput('')
    setPrevInputWords('')
    setElapsedTime(0);
    setTimerRunning(false);
    setStats({
      wpm: [],
      accuracy: [],
      consistency: [],
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      // missedChars : 0,
      isCompleted : false,
      timeOfCompletion : 0,
      time: 0,
      level : ''
    });
    typingAreaRef.current.blur();
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
        message : `Your Account has been Blocked! Conatct to Admin`,
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
    if(localStorage.getItem('matchHistory')) {
      let data = localStorage.getItem('matchHistory')
      data = JSON.parse(data)
      const { time, level } = data
      setTime(time)
      setTimeLimit(time)
      setDifficulty(level)
      setTime(()=>{
        localStorage.removeItem('matchHistory')
      }, 1000)
    }
  }, [])
  // Getting match history from local storage -----------------------------------------------------------------
  
  // Putting eye on caps lock -----------------------------------------------------------------
  const handleKeyUp = (event) => {
    // Check if Caps Lock is on and update the ref
    const capsLockStatus = event.getModifierState("CapsLock");
    setIsCapsLockOn(capsLockStatus);
  };
  // Putting eye on caps lock -----------------------------------------------------------------

  const blockRestrictedKeys = (event) => {
    if (event.type === 'keydown') {
      // Handle keydown event
      if (event.ctrlKey && event.key === 'c') {
        event.preventDefault(); // Prevent the default copy action
        setBlockKey({ for: 'Copying is disabled', state: true });
        setTimeout(() => { setBlockKey({ for: '', state: false }); }, 1500);
      }
      if (event.ctrlKey && event.key === 'v') {
        event.preventDefault(); // Prevent the default paste action
        setBlockKey({ for: 'Pasting is disabled', state: true });
        setTimeout(() => { setBlockKey({ for: '', state: false }); }, 1500);
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault(); // Prevent Backspace and Delete actions
        setBlockKey({ for: 'Deleting is disabled', state: true });
        setTimeout(() => { setBlockKey({ for: '', state: false }); }, 1500);
      }
    } else if (event.type === 'keyup') {
      // Optionally handle keyup events if needed
      console.log(`Key released: ${event.key}`);
    }
  };
  

  // useEffect(()=>{console.log(userInput)}, )

  useEffect(() => {
    // Adjust the scroll to ensure the current line stays at the top
    const scrollToCurrentLine = () => {
      if (paragraphWrapperRef.current && typingAreaRef.current) {
        const inputRect = typingAreaRef.current.getBoundingClientRect();
        const wrapperRect = paragraphWrapperRef.current.getBoundingClientRect();
        const offset = inputRect.top - wrapperRect.top;

        if (offset > 0 || offset < 0) {
          paragraphWrapperRef.current.scrollTop += offset;
        }
      }
    };
    scrollToCurrentLine();
  }, [userInput]); // Run this whenever the userInput changes

  return (
    <>

      {
        homePageSEO && (
          <Helmet>
            {/* Set the page title */}
            <title>{homePageSEO.seoTitle || 'Default Title'}</title>
            {/* Meta description for SEO */}
            <meta name="description" content={homePageSEO.seoDescription || 'Default Description'} />
            {/* Open Graph tags for social media */}
            <meta property="og:title" content={homePageSEO.seoTitle || 'Default Title'} />
            <meta property="og:description" content={homePageSEO.seoDescription || 'Default Description'} />
            <meta property="og:image" content={homePageSEO?.imageUrl || '/default-image.jpg'} />
            <link rel="icon" href={homePageSEO?.imageUrl || '/default-favicon.ico'} />
          </Helmet>
        )
      }

      <Header />
      <section className='lobby-area pb-3'>
        <div className="container">
          <div 
            className="row custom-align"
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyUp}
            // ref={isCapsLockOn}
            // style={{
            //   transition: 'transform 0.3s ease', 
            //   transform: window.innerWidth < 767 && hasFocus ? 'translateY(-20%)' : 'none' ,
            // }}
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
            <div className="col-md-12">
              <div className="typing-area" 
                    tabIndex={0} // Make the div focusable
                    onClick={() => {typingAreaRef.current.focus(), setRootFocus(true)}} 
                    onFocus={() => {setHasFocus(true), setRootFocus(true)}} 
                    onBlur={() => {setHasFocus(false), setRootFocus(false)}}
                    onKeyDown={(e)=>blockRestrictedKeys(e)}
                    onKeyUp={(e)=>blockRestrictedKeys(e)}
                    ref={paragraphWrapperRef}
                    >
                <div 
                    ref={paragraphRef}
                    style={{
                      position: "relative",
                      whiteSpace: "pre-wrap", // Preserve spaces and line breaks
                      fontSize: '30px'
                    }}
                >
                  {currentParagraph && typeof currentParagraph === "string" 
                    ? currentParagraph?.split("").map((char, index) => (
                    <span
                      key={index}
                      className={`${userInput[index] === undefined ? 'text-light' : userInput[index] === char ? 'text-active' : 'text-wrong'} ${hasFocus && index === userInput?.length ? 'underline' : ''}`}
                    >
                      {char}
                    </span>
                  )) : null}
                  {hasFocus && userInput?.length < currentParagraph?.length && (
                    <span
                      style={{
                        borderLeft: "2px solid white",
                        animation: "blink 1s infinite",
                        marginLeft: "2px",
                        display: "inline-block",
                      }}
                    />
                  )}
                </div>
                <input
                  ref={typingAreaRef}
                  value={userInput}
                  onChange={handleInputChange}
                  className='main-input-cs'
                  // style={{ opacity: 0, position: "absolute", bottom: 0, left: 0 }}
                />
              </div>
              <div className='reset'><button onClick={resetTest}><i className="fa-solid fa-arrow-rotate-right text-active"></i> <span className='text-idle'>Start Over</span></button></div>
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

export default Lobby