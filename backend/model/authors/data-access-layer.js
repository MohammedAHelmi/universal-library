import pool from '../../data/pool.js'
import { snakeCaseObjectKeysToCamelCase } from '../../../utils/to-camel-case.js'

/**
 * @typedef {Object} Author
 * @property {string} id
 * @property {string} name
 * @property {string} bio 
 */

class AuthorsRepository{
    /**
     * @param {string|String} id 
     * @returns {Promise<Author|null>}
     */
    static async getAuthor(id){
        const { rows } = await pool.query(`SELECT * FROM authors WHERE id = $1::UUID`, [id]);
        return rows.length? snakeCaseObjectKeysToCamelCase(rows[0]) : null;
    }

    /** 
     * @returns {Promise<number>}
     */
    static async getAuthorsCount(){
        const { rows } = await pool.query(`SELECT * FROM authors_count;`);
        return + rows[0].count;
    }

    /**
     * @param {number} firstRowNum 
     * @param {number} lastRowNum 
     * @returns {Promise<Author[]>}
     */
    static async getAuthors(firstRowNum, lastRowNum){
        const { rows } = await pool.query(`
            SELECT authors.id, authors.name
            FROM authors
            JOIN ordered_authors_name_view AS ordered_authors
            ON ordered_authors.id = authors.id
            WHERE row_num BETWEEN $1::INTEGER AND $2::INTEGER
            ORDER BY row_num;
        `, [firstRowNum, lastRowNum]);

        return rows.map(row => snakeCaseObjectKeysToCamelCase(row));
    }

    /**
     * @param {string|String} bookId 
     * @returns {Promise<Author[]>}
     */
    static async getBookAuthors(bookId){
        const { rows } = await pool.query(`
            SELECT authors.id, authors.name
            FROM authors
            JOIN author_books
            ON author_books.author_id = authors.id
            WHERE author_books.book_id = $1::UUID; 
        `, [bookId]);
        
        return rows.map(row => snakeCaseObjectKeysToCamelCase(row));
    }
    
    /**
     * @param {string} authorName  
     * @param {string | undefined} [limit=process.env.MAX_SEARCH_RESULTS] 
     * @returns {Promise<number>}
     */
    static async getSimilarAuthorsCount(authorName, limit=process.env.MAX_SEARCH_RESULTS){
        authorName = `%${authorName}%`;
        const { rows } = await pool.query(`
            SELECT COUNT(*)
            FROM authors
            WHERE authors.name ILIKE $1
            LIMIT $2
        `, [authorName, limit]);

        return + rows[0].count;
    }

    /**
     * @param {string|String} name 
     * @param {number} resultLimit 
     * @param {number} resultOffset
     * @returns {Promise<Author[]>} 
    */
    static async getSimilarAuthors(name, resultOffset, resultLimit){
        name = `%${name}%`;
        const { rows } = await pool.query(`
            SELECT authors.id, authors.name
            FROM authors
            WHERE authors.name ILIKE $1
            LIMIT $2::INTEGER
            OFFSET $3::INTEGER
        `, [name, resultLimit, resultOffset]);
        
        return rows.map(row => snakeCaseObjectKeysToCamelCase(row));
    }
            
}
        
export default AuthorsRepository;