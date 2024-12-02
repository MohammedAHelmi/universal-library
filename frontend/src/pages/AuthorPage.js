import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'wouter';
import Book from '../components/Book.js';
import communicationHub from '../communication-hub.js';
import buildURL from '../hooks/build-url.js';
import ErrorPage from './ErrorPage.js'
import fetchData from '../hooks/fetch-data.js';
import asyncThrowingToErrorAsValue from '../../../utils/async-throwing-to-error-as-value.js';

function AuthorPage(){
    const serverProps = communicationHub.consumeServerData();
    const [props, setProps] = useState(serverProps);

    // client side only
    const { id } = useParams();

    const oldId = useRef(id);

    useEffect(() => {
        if(id === oldId.current && props !== null)
            return;
        
        oldId.current = id;

        if(props !== null){
            setProps(null);
            return;
        }

        getProps({ id })
        .then(props => setProps(props));
    }, [id, props]);
    
    if(props === null)
        return <div>Fetching Author...</div>
    
    // both client & server side
    if(props.error)
        return <ErrorPage error={props.error} />

    const author = props.data.author;
    const renderedBooks = props.data.books.map(book => <Book key={book.id} data={book} />)
    return (
        <div>
            <div><Link to="/">Home</Link></div>
            <div>
                <h2>{ author.name }</h2>
                <p>{ author.bio }</p>
                <div>{ renderedBooks }</div>
            </div>
        </div>
    );
}

export async function getProps(params){
    const { id } = params;
    const authorURL = buildURL(process.env.API_URL, `/author/${id}`);
    const authorBooksURL = buildURL(process.env.API_URL, `/author/${id}/books`);
    
    const nonRejectingFetcher = asyncThrowingToErrorAsValue(fetchData);

    const responses = await Promise.allSettled([nonRejectingFetcher(authorURL), nonRejectingFetcher(authorBooksURL)]);

    for(const response of responses)
        if(response.value instanceof Error)
            return { error: response.value }
    
    return { data: { author: responses[0].value, books: responses[1].value }};
}

export default AuthorPage;