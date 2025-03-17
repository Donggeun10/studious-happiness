import axios from "axios";
import {Http} from "@capacitor-community/http";

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

    sendVisionTrainData(trainId : string, uuid : string, data : string, callback : any) {

        this.restClient.post(`/train/multi-modal/${trainId}/train-data/${uuid}`, data, this.config).then(response => {
            const data = response.data;
            console.log('응답 데이터:', data);
            if(callback) {
                callback(trainId, uuid, data);
            }
        }).catch(error => {
            console.error('오류 발생:', error);
        });

    }

}

export class OllamaCapacitorConnector {

    private readonly baseUrl = "http://172.27.6.8:4000/v1";

    private readonly username = "robot";
    private readonly password = "play";
    private readonly credentials = `${this.username}:${this.password}`;
    private readonly encodedCredentials = this.toBase64(this.credentials);

    retrieveOllamaVisionModel(gameName : string, uuid : string, data : string, callback : any) {

        const options = {
            url: `${this.baseUrl}/ollama/multi-modal/${gameName}`,
            headers: {
                'Authorization': `Basic ${this.encodedCredentials}`,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        Http.post(options).then(response => {
            const data = response.data;
            console.log('응답 데이터:', data);
            if(callback) {
                callback(gameName, uuid, data);
            }
        })
        .catch(error => {
            console.error('오류 발생:', error);
        });
    }

    sendVisionTrainData(trainId : string, uuid : string, data : string, callback : any) {
        //
    }

    toBase64(str: string): string {
        if (typeof btoa !== 'undefined') {
            return btoa(str);
        } else {
            return Buffer.from(str).toString('base64');
        }
    }
}