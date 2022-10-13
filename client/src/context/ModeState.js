import React, { useState } from "react";
import { useEffect } from "react";
import ModeContext from "./ModeContext";

const ModeState = (props) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    }

  return (
    <ModeContext.Provider value = {{ darkMode, toggleDarkMode }} >
        {props.children}
    </ModeContext.Provider>
  )
}

export default ModeState