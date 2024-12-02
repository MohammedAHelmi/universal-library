import { useEffect, useState, useRef } from "react";
import communicationHub from "../communication-hub.js";
import ErrorPage from "./ErrorPage.js";
import Author from "../components/Author.js";
import SearchBar from "../components/SearchBar.js";
import buildURL from "../hooks/build-url.js";
import getSearchQuery from "../hooks/get-search-query.js";
import getPaginationDetails from "../hooks/get-pagination-details.js";
import { useLocation, useSearch } from "wouter";
import buildSearchString from "../hooks/build-search-string.js";
import PaginationWithInput from "../components/PaginationWithInput.js";
import CodedError from "../../../errors/CodedError.js";
import fetchData from "../hooks/fetch-data.js";

function AuthorsPage(){
    const serverProps = communicationHub.consumeServerData();
    const [props, setProps] = useState(serverProps);
    const wouterSearchString = useSearch();
    const [_, setLocation] = useLocation();
    const searchString = useRef(typeof window !== 'undefined'? window.location.search: "");

    useEffect(() => {
        if(window.location.search === searchString.current && props !== null)
            return;

        searchString.current = window.location.search;

        if(props !== null){
            setProps(null);
            return;
        }

        getProps(undefined, searchString.current, props)
        .then(props => setProps(props));
    }, [wouterSearchString, props]);


    if(props === null)
        return <div>Fetching Authors...</div>;

    if(props.error)
        return <ErrorPage error={props.error}/>;

    const authors = props.data;

    const renderedAuthors = authors.length === 0? 
    <div>Looks Like There Are No Authors Here</div>
    : authors.map(authorData => <Author key={authorData.id} data={authorData} />);
    

    const lastPageNumber = Math.ceil(props.count/props.pagination.limit);

    const pageInputHandler = (newPageNumber) => {
        const path = buildSearchString({ ...props.pagination, page: newPageNumber, q: props.q });
        setLocation(path);
    }

    const searchInputHandler = (term) => {
        setLocation(`/?q=${encodeURIComponent(term)}`);
    }

    return (
        <div>
            <SearchBar handleInput={searchInputHandler}/>
            { renderedAuthors }
            <PaginationWithInput currentPageNumber={props.pagination.page} lastPageNumber={lastPageNumber} inputHandler={pageInputHandler}/>
        </div>
    );
}

export async function getProps(params, query){
    let pagination = null, q = null;

    try{
        pagination = getPaginationDetails(query);
        q = getSearchQuery(query);
        q &&= encodeURIComponent(q);
    }
    catch(err){
        return { error: new CodedError(400, err.message) };
    }

    const authorsURL = buildURL(process.env.API_URL, "/authors", { ...pagination, term: q });
    const countURL = buildURL(process.env.API_URL, "/authors/count", { term: q });

    let responses = null;
    try{
        responses = await Promise.all([
            fetchData(authorsURL), 
            fetchData(countURL)
        ]);    
    }
    catch(err){
        return { error: err };
    } 

    const [authors, count] = responses;

    return {
        data: authors,
        count: + count,
        pagination,
        q
    }
}

export default AuthorsPage;