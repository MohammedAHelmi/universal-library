import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactApp from '../compiled/App.js';
import communicationHub from '../compiled/communication-hub.js';
import { constructHTMLTemplate, getProps } from './utils.js';

export default async (request, reply) => {
    // extracting path and query
    const path = request.params['*'];
    const query = request.query;

    //prefetching data
    let serverData = await getProps(path, query);
    if(serverData?.error != null)
        serverData = { error: { code: serverData.error.code, message: serverData.error.message }};

    // store the fetched data so the component can use it
    communicationHub.communicateToComponent(serverData);
    
    // now create the component/page
    const reactApp = React.createElement(ReactApp, { SSRPath: path }, null);
    
    // turn the component/page to a string
    const renderedPage = renderToString(reactApp);
    
    // send the reply
    const code = communicationHub.consumeComponentData().code ?? 200;
    
    reply
    .code(code)
    .type('text/html')
    .send(constructHTMLTemplate(renderedPage, serverData));
}