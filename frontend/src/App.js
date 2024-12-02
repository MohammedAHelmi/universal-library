// import { StrictMode } from "react";
import { Router, Route, Switch } from "wouter";
import ErrorPage from "./pages/ErrorPage.js";
import { routes } from './routes.js';
import { StrictMode } from "react";

function App({ SSRPath }){
    const renderedRoutes = (routes) => routes.map(route => <Route key={route.path} path={route.path} component={route.page} />);

    return (
        <StrictMode>
            
        <Router ssrPath={SSRPath}>
            <Switch>
                    {renderedRoutes(routes)}
                <Route component={() => <ErrorPage error={{ code: 404, message: "Page Not Found" }} />} />
            </Switch>
        </Router>
        </StrictMode>
    );
}

export default App;