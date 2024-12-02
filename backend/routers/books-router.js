import getItemsByPage from "../controllers/get-items-by-page.js";
import getItemsById from "../controllers/get-items-by-id.js";
import searchItems from "../controllers/search-items.js";
import BooksRepository from "../model/books/data-access-layer.js";
import AuthorsRepository from "../model/authors/data-access-layer.js";
import getCount from "../controllers/get-count.js";

export default function(fastify, _, done){
    fastify.get('/books', (request, reply) => {
        return request.query.term ?
        searchItems(BooksRepository.getSimilarBooks, request, reply)
        : getItemsByPage(BooksRepository.getBooks, request, reply)
    });

    fastify.get('/books/count', (request, reply) => {
        const countGetter = request.query.term ? BooksRepository.getSimilarBooksCount : BooksRepository.getBooksCount;
        getCount(countGetter, request, reply)
    });

    fastify.get('/book/:id', (request, reply) => getItemsById(BooksRepository.getBook, request, reply));
    fastify.get('/book/:id/authors', (request, reply) => getItemsById(AuthorsRepository.getBookAuthors, request, reply));
    done();
}