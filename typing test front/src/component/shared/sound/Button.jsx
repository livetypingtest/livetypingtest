import { useState } from "react";
import { Select } from "@chakra-ui/react";
import { soundOptions, soundConverter } from "./sound";

const Button = ({ setHasFocus, setRootFocus, typingAreaRef, soundType, setSoundMode, soundMode }) => {

    // const [soundMode, setSoundMode] = useState(false);

    const handleSoundMode = () => {
        setSoundMode(!soundMode);
    }

    const handleSoundType = (value) => {
        soundType(value);
    }


  return (
    <>
        <div
            onClick={() => {typingAreaRef.current.focus(), setRootFocus(true)}} 
            onFocus={() => {setHasFocus(true), setRootFocus(true)}} 
            onBlur={() => {setHasFocus(false), setRootFocus(false)}} 
            className='item'
        >
            <span>Typing Sound</span>
            <div className="d-flex align-items-center gap-2">
                <button 
                    className={soundMode ? 'text-active' : 'text-idle'} 
                    onClick={handleSoundMode}
                >
                    <i className="fa-solid fa-volume text-idle"></i>
                </button>
                {soundMode && (
                    <Select
                        size="sm"
                        width="120px"
                        onChange={(e) => handleSoundType(e.target.value)}
                        variant="outline"
                        border="none"
                        color="#71CAC7"
                        sx={{
                            "& option": {
                                background: "#15131A !important",
                                color: "#71CAC7 !important",
                                border: "none !important"
                            }
                        }}
                    >
                        {soundOptions?.map((option) => (
                            <option key={option.label} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                )}
            </div>
        </div>
    </>
  )
}

export default Button