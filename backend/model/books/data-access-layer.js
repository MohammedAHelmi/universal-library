import pool from "../../data/pool.js";
import { snakeCaseObjectKeysToCamelCase } from "../../../utils/to-camel-case.js";

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string|undefined} description
 */

class BooksRepository{
    /**
     * @param {string|String} bookId 
     * @returns {Promise<Book|null>}
     */
    static async getBook(bookId){
        const { rows } = await pool.query(`SELECT * FROM books WHERE id=$1::UUID;`, [bookId]);
        return rows.length? snakeCaseObjectKeysToCamelCase(rows[0]) : null;
    }

    /** 
    * @returns {Promise<number>}
    */
    static async getBooksCount(){
        const { rows } = await pool.query(`SELECT * FROM books_count;`);
        return + rows[0].count;
    }

    /**
     * @param {number} firstRowNum 
     * @param {number} lastRowNum 
     * @returns {Promise<Book[]>}
     */
    static async getBooks(firstRowNum, lastRowNum){
        const { rows } = await pool.query(`
            SELECT books.id, books.title
            FROM books
            JOIN ordered_books_title_view AS ordered_books
            ON ordered_books.id = books.id
            WHERE row_num BETWEEN $1::INTEGER AND $2::INTEGER
            ORDER BY row_num;
        `, [firstRowNum, lastRowNum]);

        return rows.map(row => snakeCaseObjectKeysToCamelCase(row));
    }

    /**
     * @param {string|String} authorId 
     * @returns {Promise<Book[]>}
     */
   
    static async getAuthorBooks(authorId){
        const { rows } = await pool.query(`
            SELECT books.id, books.title
            FROM books
            JOIN author_books
            ON author_books.book_id = books.id
            WHERE author_books.author_id = $1::UUID;
        `, [authorId]);

        return rows.map(row => snakeCaseObjectKeysToCamelCase(row));
    }

    /**
     * @param {string} bookTitle
     * @param {string | undefined} [limit=process.env.MAX_SEARCH_RESULTS] 
     * @returns {Promise<number>}
     */
    static async getSimilarBooksCount(bookTitle, limit=process.env.MAX_SEARCH_RESULTS){
        bookTitle = `%${bookTitle}%`
        const { rows } = await pool.query(`
            SELECT COUNT(*)
            FROM books
            WHERE books.title ILIKE $1
            LIMIT $2
        `, [bookTitle, limit]);

        return + rows[0].count;
    }

    /**
     * 
     * @param {string|String} name 
     * @param {number} resultLimit 
     * @param {number} resultOffset
     * @returns {Promise<Book[]>} 
     */
    static async getSimilarBooks(name, resultOffset, resultLimit){
        name = `%${name}%`;
        const { rows } = await pool.query(`
            SELECT books.id, books.title
            FROM books
            WHERE books.title ILIKE $1
            LIMIT $2::INTEGER
            OFFSET $3::INTEGER
        `, [name, resultLimit, resultOffset]);

        return rows.map(row => snakeCaseObjectKeysToCamelCase(row));
    }
}

export default BooksRepository;