// Desc: 로컬 스토리지에 게임 데이터를 저장, 불러오기, 삭제하는 함수들을 정의한 파일
import axios  from 'axios';
import { Http } from '@capacitor-community/http';

export class LocalStorageRepository{

    constructor(){
        console.log('LocalStorageRepository constructor');
    }

    saveGameData(gameName : string, data : object) {
        console.log('saveGameData', gameName, data);
        let datas = this.loadGameData(gameName);
        if (Array.isArray(datas)) {
            datas.push(data);
        }else{
            datas = [];
            datas.push(data);
        }
        localStorage.setItem(gameName, JSON.stringify(datas)); // 데이터 저장
    }

    loadGameData(gameName : string) {
        return JSON.parse(localStorage.getItem(gameName) as string); // 데이터 불러오기
    }

    deleteGameData(gameName : string) {
        localStorage.removeItem(gameName); // 데이터 삭제
    }

    clearAllGameData() {
        localStorage.clear(); // 데이터 전체 삭제
    }
}

export class RedisExternalRepository {

    config = {};
    restClient ;

    constructor() {
        console.log('RedisExternalRepository constructor');
        this.config = {
            baseURL: '/api/v1',
            timeout: 10000,
            auth: {
                username: 'robot',
                password: 'play',
            },
        };
        this.restClient = axios.create(this.config);
    }

    loadGameData(gameName : string, callback : any) {

        this.restClient.get('/score/redis/' + gameName, this.config).then(response => {
            const data = response.data;
            console.log('응답 데이터:', data);
            callback(gameName, JSON.parse(data[gameName]));
        }).catch(error => {
            console.error('오류 발생:', error);
        });
    }

    loadGameDataWithGameId(gameName : string) {
        return new Promise((resolve, reject) => {
            this.restClient.get('/score/redis/' + gameName, this.config).then(response => {
                const data = response.data;
                console.log('응답 데이터:', data);
                resolve(JSON.parse(data[gameName]))
            }).catch(error => {
                console.error('오류 발생:', error);
                reject(new Error(error));
            });
        });
    }

    saveGameDataToRedis(gameName : string, data : string) {

        console.log('saveGameData', gameName, data);
        this.restClient.post('/score/redis/' + gameName, data, this.config).then(response => {
            console.log('redis:saveGameData 응답 데이터:', response.data);
        }).catch(error => {
            console.error('오류 발생:', error);
        });
    }
}

class RedisExternalDataSource {

    constructor() {
        if (new.target === RedisExternalDataSource) {
            throw new Error("이 클래스는 추상 클래스이므로 인스턴스화할 수 없습니다.");
        }
    }

    loadGameData(gameName : string, callback : any) {
        throw new Error("추상 메서드는 서브클래스에서 구현해야 합니다.");
    }

    loadGameDataWithGameId(gameName : string){
        throw new Error("추상 메서드는 서브클래스에서 구현해야 합니다.");
    }

    saveGameDataToRedis(gameName : string, data : string) {
        throw new Error("추상 메서드는 서브클래스에서 구현해야 합니다.");
    }
}

export class CapacitorConnector extends RedisExternalDataSource {

    private readonly baseUrl = "http://172.27.6.8:4000/v1";

    private readonly username = "robot";
    private readonly password = "play";
    private readonly credentials = `${this.username}:${this.password}`;
    private readonly encodedCredentials = this.toBase64(this.credentials);

    loadGameData(gameName: string, callback: any) {

        const options = {
            url: this.baseUrl+ "/score/redis/" + gameName,
            headers: {
                'Authorization': `Basic ${this.encodedCredentials}`,
                'Content-Type': 'application/json',
            },
            params: {id: '123'},
        };

        Http.get(options).then(response => {
            const data = response.data;
            console.log('응답 데이터:', data);
            callback(gameName, JSON.parse(data[gameName])); // 성공 시 콜백 호출
        })
        .catch(error => {
            console.error('오류 발생:', error);
        });
    }

    loadGameDataWithGameId(gameName : string) {

        const options = {
            url: this.baseUrl+ "/score/redis/" + gameName,
            headers: {
                'Authorization': `Basic ${this.encodedCredentials}`,
                'Content-Type': 'application/json',
            },
        };

        return new Promise((resolve, reject) => {
            Http.get(options).then(response => {
                const data = response.data;
                console.log('응답 데이터:', data);
                resolve(JSON.parse(data[gameName]))
            }).catch(error => {
                console.error('오류 발생:', error);
                reject(new Error(error));
            });
        });
    }

    saveGameDataToRedis(gameName : string, data : string) {

        const options = {
            url: this.baseUrl+ "/score/redis/" + gameName,
            headers: {
                'Authorization': `Basic ${this.encodedCredentials}`,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        console.log('saveGameData', gameName, data);
        Http.post(options).then(response => {
            console.log('redis:saveGameData 응답 데이터:', response.data);
        }).catch(error => {
            console.error('오류 발생:', error);
        });
    }

    toBase64(str: string): string {
        if (typeof btoa !== 'undefined') {
            return btoa(str);
        } else {
            return Buffer.from(str).toString('base64');
        }
    }
}