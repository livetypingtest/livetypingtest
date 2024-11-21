import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <>
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="footer-layout">
                            <div className='footer'>
                                <ul>
                                    <li><NavLink to=''>Copyright 2024 &nbsp; |</NavLink></li>
                                    <li><NavLink to=''>Live Typing Test &nbsp; |</NavLink></li>
                                    <li><NavLink to=''>All Rights Reserved.</NavLink></li>
                                </ul>
                                <p>Design and Developed By <span>Aerozef Creations</span></p>
                            </div>
                            <div className="footer">
                                <ul>
                                    <li><NavLink to=''>Contact Us &nbsp; |</NavLink></li>
                                    <li><NavLink to=''>About &nbsp; |</NavLink></li>
                                    <li><NavLink to=''>Privacy Policy &nbsp; |</NavLink></li>
                                    <li><NavLink to=''>Terms & Condition</NavLink></li>
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