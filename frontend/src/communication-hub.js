class CommunicationHub{
    #serverDataToComponent;
    #componentDataToServer;

    constructor(){
        this.#serverDataToComponent = null;
        this.#componentDataToServer = null;
    }

    /**
     * this function is intended to be called by a component that needs to communicate some data to the server during its renderings
     * the server can consume the data after the component finishes rendering  
     * @param {object} dataObject
     */
    communicateToServer(dataObject){
        this.#componentDataToServer = dataObject;
    }

    /**
     * this function is intended to be called by the server / index file to pass some data in order to be consumed by the component that is to be rendered
     * this function should be called before triggering the app render
     * @param {object} dataObject 
     */
    communicateToComponent(dataObject){
        this.#serverDataToComponent = dataObject;
    }

    /**
     * this function returns the data the server stored (using communicateToComponent()) in this instance of CommunicationHub
     * server data is available for one time use only (data is nullified after each call)
     * @returns {object|null}
     */
    consumeServerData(){
        const serverData = this.#serverDataToComponent;
        this.#serverDataToComponent = null;
        return serverData;
    }

    /**
     * this function returns the data the component stored (using communicateToServer()) in this instance of CommunicationHub
     * component data is available for one time use only (data is nullified after each call)
     * @returns {object|null}
     */
    consumeComponentData(){
        const componentData = this.#componentDataToServer ?? {};
        this.#componentDataToServer = null;
        return componentData;
    }
}

export default new CommunicationHub();