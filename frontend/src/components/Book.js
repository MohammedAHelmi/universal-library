function Book({ data }){
    return (
        <div>
            <h4>{data.title}</h4>
            <p>{data.description}</p>
        </div>
    );
}

export default Book;