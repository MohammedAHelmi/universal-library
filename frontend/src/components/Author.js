import { Link } from "wouter";

function Author({ data }){
    const { id, name } = data;
    
    return (
        <Link to={`/author/${id}`}>
            <h4>{ name }</h4>
        </Link>
    );
}

export default Author;