import Header from '../../../../shared/header/Header'
import Footer from '../../../../shared/footer/Footer'
import { useEffect, useRef, useState } from 'react'
import Min1Paragraphs from './Min1Paragraphs'
import Min3Paragraphs from './Min3Paragraphs'
import Min5Paragraphs from './Min5Paragraphs'
import { useSelector } from 'react-redux'
import ButtonLoader from '../../../../shared/loader/ButtonLoader'


const Paragraphs = () => {

    const [timeFilter, setTimeFilter] = useState('1')
    const [levelFilter, setLevelFilter] = useState('easy')
    const rawParagraphsData = useSelector(state => state.AdminDataSlice.paragraphs)


    const handleFilterLevel = (level) =>{
        setLevelFilter(level)
    }

    const handleFilterTime = (time) =>{
        setTimeFilter(time)
    }


  return (
    <>
        <Header />

        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                    <div className="leaderboard-head admin">
                        <div className='lobby-menu'>
                            <ul className='switcher'>
                                <li>Time :</li>
                                <li>
                                    <button
                                        onClick={()=>handleFilterTime('1')}
                                        className={timeFilter === '1' ? 'active' : ''}
                                    >
                                    01 Min
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={()=>handleFilterTime('3')}
                                        className={timeFilter === '3' ? 'active' : ''}
                                    >
                                    03 Min
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={()=>handleFilterTime('5')}
                                        className={timeFilter === '5' ? 'active' : ''}
                                    >
                                    05 Min
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className='lobby-menu'>
                            <ul className='switcher'>
                                <li>Level :</li>
                                <li>
                                    <button
                                    onClick={()=>handleFilterLevel('easy')}
                                    className={levelFilter === 'easy' ? 'active' : ''}
                                    >
                                    Easy
                                    </button>
                                </li>
                                <li>
                                    <button
                                    onClick={()=>handleFilterLevel('medium')}
                                    className={levelFilter === 'medium' ? 'active' : ''}
                                    >
                                    Medium
                                    </button>
                                </li>
                                <li>
                                    <button
                                    onClick={()=>handleFilterLevel('hard')}
                                    className={levelFilter === 'hard' ? 'active' : ''}
                                    >
                                    Hard
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {timeFilter === '1' && <Min1Paragraphs props={{timeFilter, levelFilter, paragraphs : rawParagraphsData?.Min1}} />}
        {timeFilter === '3' && <Min3Paragraphs props={{timeFilter, levelFilter, paragraphs : rawParagraphsData?.Min3}} />}
        {timeFilter === '5' && <Min5Paragraphs props={{timeFilter, levelFilter, paragraphs : rawParagraphsData?.Min5}} />}
        <Footer />
    </>
  )
}

export default Paragraphs