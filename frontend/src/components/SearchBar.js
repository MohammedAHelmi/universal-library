import { useState } from "react";

function SearchBar({ handleInput }){
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setValue(value);
    }

    const handleKeyPress = (e) => {
        if(e.key !== "Enter")
            return;

        handleInput(value);
        setValue("");
    }

    return (
        <input
            type="text"
            value={value}
            placeholder="What do you want to find..."
            onChange={handleChange}
            onKeyDown={handleKeyPress}
        />
    );
}

export default SearchBar;