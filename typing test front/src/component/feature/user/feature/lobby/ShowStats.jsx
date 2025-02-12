
const ShowStats = ({stats}) => {
  return (
    <div className="row align-items-center">
        <div className="col-md-7">
            <div className="status">
            <div>
                <h4>WPM</h4>
                <h1>{parseInt(stats.wpm[stats?.wpm?.length - 1]) || 0}</h1>
            </div>
            <div>
                <h4>Accuracy</h4>
                <h1>{stats.accuracy[stats?.accuracy?.length - 1] || 0}<span>%</span></h1>
            </div>
            {/* <div>
                <h4>Consistency</h4>
                <h1>{stats.consistency[stats?.consistency?.length - 1] || 0}<span>%</span></h1>
            </div> */}
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
  )
}

export default ShowStats
