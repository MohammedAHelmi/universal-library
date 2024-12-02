import ReactDOM from "react-dom/client";
import App from './App.js'
import communicationHub from "./communication-hub.js";

const serverData = window.__SERVER_DATA__;
communicationHub.communicateToComponent(serverData);

ReactDOM
.hydrateRoot(
    document.getElementById('root'),
    <App/>
);