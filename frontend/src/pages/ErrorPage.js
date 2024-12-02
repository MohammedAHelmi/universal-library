import { Link } from "wouter";
import communicationHub from "../communication-hub.js";

function ErrorPage({ error }){
    const { code, message: errorMsg } = error;
    communicationHub.communicateToServer({ code });
    
    return (
        <div>
            {code && <h2>{ code }</h2>}
            { errorMsg && <h3>{ errorMsg }</h3>}
            <Link to="/">Back To Home</Link>
        </div>
    )
}

export default ErrorPage;