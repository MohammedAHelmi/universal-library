import PaginationBar from "./PaginationBar.js";
import PaginationInput from "./PaginationInput.js";

function paginationWithInput({ currentPageNumber, lastPageNumber, inputHandler}){
    return (
        <div>
            <PaginationBar currentPageNumber={currentPageNumber} lastPageNumber={lastPageNumber} inputHandler={inputHandler} />
            <PaginationInput lastPageNumber={lastPageNumber} inputHandler={inputHandler} />
        </div>
    )
}

export default paginationWithInput;