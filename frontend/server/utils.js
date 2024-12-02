import { match } from 'path-to-regexp';
import { routes } from '../compiled/routes.js';

const matchPathToRoute = (path, route) => {
    const routeMatchingFn = match(route);
    const result = routeMatchingFn(path);
    return result;
}

const getMatchingRoute = (path) => {
    for(const route of routes){
        const result = matchPathToRoute(path, route.path);
        if(result)
            return route;
    }
    return null;
}

export const getProps = async (path, query) => {
    const route = getMatchingRoute(path);
    
    if(route == null)
        return;

    // the result will be used to extract params
    const result = matchPathToRoute(path, route.path);
    return await route.getSSRProps(result.params, query);
}

export const constructHTMLTemplate = (content, serverData) => {
    return (
    `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Library</title>
            <script src="/public/bundle.js" defer></script>
        </head>
        <body>
            <div id="root">${content}</div>
            ${serverData? `<script type="text/javascript">window.__SERVER_DATA__=${JSON.stringify(serverData)}</script>` : ''}
        </body>
    </html>`
    );
}