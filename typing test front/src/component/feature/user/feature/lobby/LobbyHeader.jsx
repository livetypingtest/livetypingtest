import { useEffect, useRef } from 'react';
const LobbyHeader = ({timerRunning, ref, handleTime, timeLimit, difficulty, handleDifficultyChange, isMobile, elapsedTime}) => {

  const containerRef = useRef(null);

  useEffect(() => {
    ref = containerRef
  }, [containerRef]);

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

  return (
    <>
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
              <div className="lobby-menu cs-timer text-center">
                <h4 className={`${timerRunning ? 'text-active' : 'text-idle'}`}>
                  {timeLimit - elapsedTime > 0 ? convertSecondsToFormattedTime(timeLimit - elapsedTime) : 0}
                </h4>
                
                {
                  isMobile && (<div className='cs-logo' style={isMobile && timerRunning ? {opacity: 1} : {}}><img src="/assets/images/logo.svg" alt="Logo" /></div>)
                }
                
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
    </>
  )
}

export default LobbyHeader