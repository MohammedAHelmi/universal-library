import AuthorsPage, { getProps as authorsPropsGetter } from "./pages/AuthorsPage.js";
import AuthorPage, { getProps as authorPropsGetter } from "./pages/AuthorPage.js";

const routeFactory = (path, page, propFn) => {
    return { path, page, getSSRProps: propFn }
}

export const routes = [
    routeFactory('/', AuthorsPage, authorsPropsGetter),
    routeFactory('/author/:id', AuthorPage, authorPropsGetter)
];