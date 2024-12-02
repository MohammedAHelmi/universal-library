function PaginationBar({ currentPageNumber, lastPageNumber, inputHandler }){
    const delta = 3;
    const firstNumberInBar = Math.max(currentPageNumber - delta, 1);
    const lastNumberInBar = Math.min(currentPageNumber + delta, lastPageNumber)
    
    const prevArray = [
        ...getPaginationBarPrefix(firstNumberInBar),
        ...getNumbersInRange(Math.min(firstNumberInBar, lastPageNumber), Math.min(currentPageNumber - 1, lastPageNumber))
    ];
    
    const nextArray = [
        ...getNumbersInRange(currentPageNumber + 1 , lastNumberInBar),
        ...getPaginationBarSuffix(lastNumberInBar, lastPageNumber)
    ];

    return (
        <div>
            {createPageButtons(prevArray, inputHandler)}
            {currentPageNumber <= lastPageNumber && <span className="active-page-number">{currentPageNumber}</span>}
            {createPageButtons(nextArray, inputHandler)}
        </div>
    )
}

/**
 * 
 * @param {number} minPageNumber the minimum number in the pagination bar 
 * @returns {Array}
 */
function getPaginationBarPrefix(minPageNumber){
    const paginationBarPrefix = [];

    if(minPageNumber > 1)
        paginationBarPrefix.push(1);

    if(minPageNumber > 2)
        paginationBarPrefix.push('...');

    return paginationBarPrefix;
}

/**
 * 
 * @param {number} lastNumberInBar the maximum number in the pagination bar
 * @param {number} lastPageNumber the number of the last page
 * @returns {Array}
 */
function getPaginationBarSuffix(lastNumberInBar, lastPageNumber){
    const paginationBarSuffix = [];

    if(lastNumberInBar + 1 < lastPageNumber){
        paginationBarSuffix.push('...');
    }

    if(lastNumberInBar < lastPageNumber){
        paginationBarSuffix.push(lastPageNumber);
    }

    return paginationBarSuffix;
}

/**
 * 
 * @param {number} from 
 * @param {number} to
 * @returns {number[]} 
 */
function getNumbersInRange(from, to){
    const numbers = [];
    for(let i = from; i <= to; ++i)
        numbers.push(i);
    return numbers;
}

/**
 * @param {Array} pageNumbers 
 * @param {Function} inputHandler 
 * @returns {Array}
*/
function createPageButtons(pageNumbers, inputHandler){
    return pageNumbers.map(pageNum => {
        if(pageNum === '...')
            return <span key="dots">{pageNum}</span>
        
        return ( 
            <button
            key={pageNum} 
            onClick={() => inputHandler(pageNum)}
            >
                {pageNum}
            </button>
        )
    })
}

export default PaginationBar;