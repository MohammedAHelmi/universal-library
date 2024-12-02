import { useState } from "react";

function PaginationInput({ lastPageNumber, inputHandler }){
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setValue(value);
    }

    const handleKeyPress = (e) => {
        if(e.key !== 'Enter')
            return;

        const pageNum = parseInt(value);

        inputHandler(pageNum);
        setValue("");
    }

    return (
        <div>
            <span>Go To: </span>
            <input 
                type="number"
                min={0}
                max={lastPageNumber}
                placeholder="Page #"
                onChange={handleChange}
                onKeyDown={handleKeyPress} 
            />
        </div>
    );
}

export default PaginationInput;