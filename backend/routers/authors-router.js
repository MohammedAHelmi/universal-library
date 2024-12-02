import getItemsByPage from "../controllers/get-items-by-page.js";
import getItemsById from "../controllers/get-items-by-id.js";
import searchItems from "../controllers/search-items.js";
import BooksRepository from "../model/books/data-access-layer.js";
import AuthorsRepository from "../model/authors/data-access-layer.js";
import getCount from "../controllers/get-count.js";

export default function(fastify, _, done){
    fastify.get('/authors', (request, reply) => {
        return request.query.term ?
        searchItems(AuthorsRepository.getSimilarAuthors, request, reply)
        : getItemsByPage(AuthorsRepository.getAuthors, request, reply)
    });

    fastify.get('/authors/count', (request, reply) => {
        const countGetter = request.query.term ? AuthorsRepository.getSimilarAuthorsCount : AuthorsRepository.getAuthorsCount;
        getCount(countGetter, request, reply)
    });
    
    fastify.get('/author/:id', (request, reply) => getItemsById(AuthorsRepository.getAuthor, request, reply));
    fastify.get('/author/:id/books', (request, reply) => getItemsById(BooksRepository.getAuthorBooks, request, reply));
    done();
}