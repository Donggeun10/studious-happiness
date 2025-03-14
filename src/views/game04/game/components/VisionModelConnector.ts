import axios from "axios";

export class OllamaConnector {

    config = {};
    restClient ;

    constructor() {
        console.log('OllamaConnector constructor');
        this.config = {
            baseURL: '/api/v1',
            timeout: 60000,
            auth: {
                username: 'robot',
                password: 'play',
            },
        };
        this.restClient = axios.create(this.config);
    }

    retrieveOllamaVisionModel(gameName : string, uuid : string, data : string, callback : any) {

        this.restClient.post('/ollama/multi-modal/' + uuid, data, this.config).then(response => {
            const data = response.data;
            console.log('응답 데이터:', data);
            if(callback) {
                callback(gameName, uuid, data);
            }
        }).catch(error => {
            console.error('오류 발생:', error);
        });

    }

}