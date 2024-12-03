# Welcome To My Universal Library App 📚
---
It is a full stack library project where a user can access **MILLIONS** of Authors, read their bios and learn about their works. It's server side rendered single page websites that features searching and efficient pagination across the tens of thousands of page by leveraging PostgreSQL's features such as trigrams, text search, different kinds of indexs and materialized views.

---
## Backend
I used [Fastify](https://fastify.dev/) to build the backend, [PostgreSQL](https://www.postgresql.org/) for data storage and retrieval and [Jest](https://jestjs.io/) to do unit and endpoint testing.

---
### Dataset
I used the works dump and authors dump on [open library](https://openlibrary.org/developers/dumps) I have [another project](https://github.com/MohammedAHelmi/open-library-to-postgresql) that is dedicated to extracting JSON for each entry, discovering the different JSON shapes, inserting the data inside the database **concurrently** and building indexs and materialized views to help make this app efficient.

---
### APIs
#### `GET /api/authors`
##### Description
It's default functionality is to fetch authors ordered lexicographically by their names, however, if `term` appears in the query string then orders will be fetched by the order of their similarity to `term` in descending order.

Authors fetching is efficient because 
- A [materialized view](https://www.postgresql.org/docs/current/rules-materializedviews.html) that stores `id` and `row number` of an author based on the lexicographically sorted order.
- The index on the `row number` column of the view allows efficient joins to fetch authors by getting authors with row numbers between the first and the last row inclusive. 
- First row number is calculated as `(page - 1) * limit + 1` and last row number is calculated as `page * limit`.

Author searching is also efficient because of a [GiST index](https://www.postgresql.org/docs/8.1/gist.html) on the [Trigrams](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-INDEX) of the name column of the authors table and searching is done by fetching the authors with name with the smallest [Trigram Distance](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-FUNCS-OPS) from the searched name.
##### Query Parameters
###### page
A postive integer used together with limit parameter to calculate the row number of the first author and the row number for the last author of fetched authors
###### limit
A positive number that represents the maximum number of authors. If `limit` is too big, the number of items returned will the maximum number of items per page or the maximum search result that is specified in the .env file
###### term
A string that represents the author name to search for 
##### Status Codes & Errors
###### 200
body is a list of objects descriped as following
| Property Name | Type | Description |
| ------------- | ---- | ----------- |
| id | `string` | The uuid of the author which can be used to access it |
| name | `string` | A string that contains any character representing the name of the author |
###### 400
- Invalid Page Number - when page is not a postive integer
- Invalid Items Per Page Limit - when limit is not a postive integer
- Maximum Results Count Exceeded - when trying to get results whose first row is beyond the Maximum search result specified in the .env file

---
#### `GET /api/authors/count`
##### Description
Fetches the number of authors in the data base which is needed for frontend paginations. In the case which term is specified in the query it returns the `max(number of similar authors to term, maximum search result limit that is specified in the .env file)`
##### Query Parameters
###### term
The string which is used to count how many author names that are similar to i.e. `distance !== 1`.
##### Status Codes & Errors
###### 200
The body is a postive integer representing the count.

---
#### `GET /api/author/:id`
##### Description
Fetch the author with the id passed in the url parameter
##### Parameters
###### id
The UUID of the author in the database 
##### Status Codes & Errors
###### 200
The body is an object with the following shape
| Property Name | Type | Description |
| ------------- | ---- | ----------- |
| id | `string` | The uuid of the author which can be used to access it |
| name | `string` | A string that contains any character representing the name of the author |
| bio | `string` / `null` | A description about the author | 
###### 400
- Invalid Id - if the id does not follow UUID v4 syntax 
###### 404
- Item(s) Doesn't Exist - if there are no authors with such id

---
#### `GET /api/author/:id/books`
##### Description
Fetches the book(s) which the author with the id passed as parameter in the URL wrote.
##### Status Codes & Errors
###### 200
A list of objects of the following shape
| Property Name | Type | Description |
| ------------- | ---- | ----------- |
| id | `string` | The uuid of the book which can be used to access it |
| title | `string` | A string that contains any character representing the title of the book |
| description | `string` / `null` | A description about the book | 
###### 400
- Invalid Id - if the id does not follow UUID v4 syntax

---
#### Book APIs
Book APIs are identical authors' in fact I decided to use the same controllers for both authors and books routes and pass the data fetching function from the data access layers as a parameter to the controllers as a dependency injection.

The only difference is that instead of the `name` property in any response for authors it is `title` for books and instead of `bio` for authors it is `description` for books.

I don't use the Book APIs for frontend but I might do in the future.

---
## Frontend
I used [React.js](https://react.dev/) to build the frontend with [wouter](https://www.npmjs.com/package/wouter) for routing along side with [Fastisy](https://fastify.dev/) to build the frontend server

---
### Pages
#### Authors Page
##### Description
A page responsible for showing a list of authors
##### State
- `props` (`object`|`null`)
    - Data stored:
        - List of authors stored in `data` field
        - Count of authors stored in `count` field
        - pagination details (page number & limit) stored in `pagination` field
        - q (the author name searched for) stored in `q` field
    - Client-side lifecycle
        - on the first render props is initialized by the value returned by `communicationHub.consumeServerData()` which is the data stored in the script tag of HTML returned by the server. Please be aware that the data is available for one-off consumption and never again
        - on subsequent renders an effect runs whenever the query string changes or `props` state change
            - if the new query string is the same as the previous one (it may happen because of Wouter's useSearch async parsing) and `props` state is not null then the function returns returns immediately
            - if the new query string is different than the previous one and `props` state is not null then it's set to null and the function returns.
            - if `props` is null then the new `props` state is calculated by `getProps()` 
            - `getProps()` takes the `params` object and the `query` string or object. Query string is parsed to extract pagination details to an `object` and search term `q` to a string. The list of author is fetched from the backend according to pagination details and search term. The count needed for pagination is fetched as well from the backend. If an error happens in this process it will recorded in the props object into `error` field
##### Rendered Content
- props is `null`
    - a div with "Fetching Author..." message is shown
- props has a `error` field
    - `<ErrorPage />` is rendered and the error is passed as a prop to it
- otherwise the `<SearchBar>` component is rendered with a handler passed as a prop to update the query string whenever a query is submitted. The list of authors renders each author as `<Author>` component with the author data passed as a prop to the component. Last the `<PaginationWithInput>` component with current page number, last page number (which is calculated from `props.count`) and a handler to update the query string when a new page is navigated

---
#### Author Page
##### Description
A page responsible for showing an author's details and works
##### State
- `props` (`object`|`null`)
    - Data stored:
        - Author details stored in `data.author` field
        - Author books stored in `data.books` field
    - Client-side lifecycle
        - on the first render props is initialized by the value returned by `communicationHub.consumeServerData()` which is the data stored in the script tag of HTML returned by the server. Please be aware that the data is available for one-off consumption and never again
        - on subsequent renders an effect runs whenever the `id` parameter changes or `props` state change
            - if the new `id` is the same as the previous one and `props` state is not null then the function returns returns immediately
            - if the new `id` is different than the previous one and `props` state is not null then it's set to null and the function returns.
            - if `props` is null then the new `props` state is calculated by `getProps()` 
            - `getProps()` takes the `params` object. Author details and authors books details are fetched from the backend. If an error happens in this process it will recorded in the props object into `error` field
##### Rendered Content
- props is `null`
    - a div with "Fetching Authors..." message is shown
- props has a `error` field
    - `<ErrorPage />` is rendered and the error is passed as a prop to it
- otherwise the author `name` and `bio` are rendered and then the list of book is rendered as a list of `book` component

---
#### Error Page
##### Description
A page dedicated to show errors and it also communicates the error code to the server at the server side rendering phase because this helps the server respond with the proper http code.
##### Props 
- code (`string` | `number` | `null`)
- message (`string` | `null`)
##### Rendered Content
- `code` if it exists
- `message` if it exists
- a link to the home page
---
### Components
#### Author
##### Description
a component that renders an author's name in a link that forwards to their page
##### Props
- `data` (`object`)
    - id - the author's uuid
    - name - the author's name

---
#### Book
##### Description
a component that renders a book's name and description
##### Props
- `data` (`object`)
    - title - the book's title
    - description - the book's description

---
#### PaginationBar
##### Description
a bar of buttons that represent the page numbers up to some delta before and after the current page number that is if `delta` is `3` and current page number is `17` so the rendered numbers are `14`, `15`, `16`, `18`, `19`, `20`. The current page number (`17` in my example) is also rendered but as a normal text rather than a button `1` and the last page number always get rendered and if there is a gap more than `1` between the first page number `1` and first page number of the deltas (`14` in this example) then `...` is rendered as a text. The same case happens with the last number of the deltas (`20` in this example) and last page number.
##### Props
- currentPageNumber `number` 
- lastPageNumber `number`
- inputHandler `function`
    - a function that is invoked when a page button is clicked, and the button number is passed as an argument to the function

---
#### PaginationInput
##### Description
a page number input field to directly access a certain page which making naviagation across hundereds of thousands of pages no hussle
##### Props
- lastPageNumber `number`
- inputHandler `function`
    - a function that is invoked when a page number is submitted (using `Enter` key) and the number is passed as an argument to the function
##### State
- value `string`
    - represent the current value of the input and is updated whenever the input changes. On submit it parsed to integer to pass to `inputHandler()` 

---
#### PaginationWithInput
##### Description
Renders `<PaginationBar/>` and `<PaginationInput/>` together. Props are received just to pass as is to children components.
##### Props
- currentPageNumber `number` 
- lastPageNumber `number`
- inputHandler `function`

---
#### SearchBar
##### Description
a searching term input field 
##### Props
- handleInput `function`
    - a function that is invoked when a searching term is submitted (using `Enter` key), and the term is passed as an argument to the function. The function receives the searching term as a parameter and may attempt to update the search string of the URL. The function encodes the term before updating the URL. 
##### State
- value `string`
    - represent the current value of the input and is updated whenever the input changes. On submit it is passed to `handleInput()`
---
### Frontend Server
It's responsible for rendering pages on the server and serving static resources
#### Request Handling
When a request is receive and is not looking for a static resource. A request handler function executes the following steps
1. Extracts path and query parameters object
2. Gets the static props need to render the page according to the path
3. Stores the props using `communicationHub.communicateToComponent()` so that the page to rendered can initialized its props state using `communicationHub.consumeServerData()`
4. Creates the react component and path is passed to the react app. It's essential that the app is compiled from JSX to normal JavaScript because the server is running Node.js and cannot understand JSX.
5. Renders the app to a string
6. Initializes the response code with code that may have been communicated from the app (especially the error page) or `200` if no coded was communicated 
7. Builds the HTML template to send as a response by adding the rendered app inside the HTML and the server data (static props) inside a script tag because it will be consumed again on the client side at [hydration](https://react.dev/reference/react-dom/client/hydrateRoot).
## How To Try
1. Make sure that you have a compatiable PostgreSQL with initialized data in it. If you have the authors dump and the works dump from open library you can use my other project to build the tables and write the data efficiently in the database. Otherwise You can also take a look at the other project and discover the tables's schemas, materialized views and indexes.  
2. Clone this Repo
3. Run `npm install`
4. Make sure your .env files have all environment variables correctly
    1. A .env file that will be in the root directory of the repo. It contains the essential environment variables for the backend and the frontend server. Make sure **ALL** the following variables are set correctly.
        - NODE_ENV
        - FRONTEND_PORT
        - BACKEND_PORT
        - DB_HOST
        - DB_PORT
        - DB_USER
        - DB_NAME
        - DB_PASSWORD
        - DATABASE_URL
        - MAX_DB_CONNECTIONS
        - DEFAULT_PAGE
        - DEFAULT_ITEMS_PER_PAGE
        - MAX_ITEMS_PER_PAGE
        - MAX_SEARCH_RESULTS
    2. A .env.frontend file that will be in `frontend/configs/` directory which has all the essential environment variables for the frontend app. Make sure **ALL** the following variables are initialized correctly
        - API_URL
        - DEFAULT_PAGE
        - DEFAULT_ITEMS_PER_PAGE
        - MAX_ITEMS_PER_PAGE
        - MAX_SEARCH_RESULTS
5. Run `npm start`
