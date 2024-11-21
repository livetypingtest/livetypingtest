import { useMemo } from 'react';
import { NavLink } from 'react-router-dom'

const Footer = () => {

    const checkUserToken = useMemo(() => !!localStorage.getItem('userToken'), []);

  return (
    <>
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="footer-layout">
                            <div className='footer'>
                                <ul className='custom mb-3'>
                                    <li><a target='_blank' href='https://www.facebook.com/livetypingtest'><i class="fa-brands fa-lg fa-facebook-f "></i> &nbsp; |</a></li>
                                    <li><a target='_blank' href='https://www.instagram.com/livetypingtest/'><i class="fa-brands fa-lg fa-instagram"></i> &nbsp; |</a></li>
                                    <li><a target='_blank' href='https://in.pinterest.com/livetypingtest/'><i class="fa-brands fa-lg fa-pinterest-p"></i> &nbsp; |</a></li>
                                    <li><a target='_blank' href='https://x.com/livetypingtest'><i class="fa-brands fa-lg fa-twitter"></i></a></li>
                                </ul>
                                <p className='m-0'>Design and Developed By <span>Aerozef Creations</span></p>
                            </div>
                            <div className="footer">
                                <ul className='mb-3'>
                                    {
                                        checkUserToken && (
                                            <li><NavLink to='/contact'>Contact Us &nbsp; |</NavLink></li>
                                        )
                                    }
                                    <li><NavLink to='/about' >About &nbsp; |</NavLink></li>
                                    <li><NavLink to='/privacy' >Privacy Policy &nbsp; |</NavLink></li>
                                    <li><NavLink to='/term-condition'>Terms & Condition</NavLink></li>
                                </ul>
                                <ul>
                                    <li className='footer-design'><i class="fa-regular fa-copyright"></i> Copyright 2024 Live Typing Test - All Rights Reserved. </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer