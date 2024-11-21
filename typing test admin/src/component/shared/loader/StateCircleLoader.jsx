

const StateCircleLoader = () => {
  return (
    <>
        <div className="loader-overlay">
            <div className="loader-cs">
                <svg className="circular-cs" viewBox="25 25 50 50">
                    <circle
                        className="path-cs"
                        cx={50}
                        cy={50}
                        r={20}
                        fill="none"
                        strokeWidth={2}
                        strokeMiterlimit={10}
                    />
                </svg>
            </div>
        </div>


    </>
  )
}

export default StateCircleLoader