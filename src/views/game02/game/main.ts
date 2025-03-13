import Preloader from '@/views/game02/game/scenes/Preloader'
import GameScene from '@/views/game02/game/scenes/GameScene'
import ScoreBoard from "@/views/game02/game/scenes/ScoreBoard";
import GameConfig = Phaser.Types.Core.GameConfig;

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
export const config : GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'firstGame',
    backgroundColor: '#B23A3A',
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y : 300 },// y방향 300의 중력을 적용, y가 클수록 빠르게 하강
            debug: false, // 디버그 모드 활성화시, 충돌 영역 및 기타 물리 관련 정보 표시
        },
    },
    dom: {
        createContainer: true
    },
    scene: [
        Preloader,
        GameScene,
        ScoreBoard,
        // MainMenu,
        // MainGame,
    ],
    scale: {
        // Or set parent divId here
        parent: 'firstGame',

        mode: Phaser.Scale.FIT,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: window.innerWidth,
            height: 0
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 800,
            height: 600
        },
        // Or set maximum size like these
        // maxWidth: 1600,
        // maxHeight: 1200,

        zoom: 1,  // Size of game canvas = game size * zoom
    },
};

// Create a new game instance
const StartGame = (containerId : string) => {
    config.parent = containerId;
    if(config.scale) {
        config.scale.parent = containerId;
    }
    return new Phaser.Game(config);
}

export default StartGame;


export class GameData {

// {playerName: "", stage: 1, score: 0, playTime: 0, dateTime: Date.now().toString(), timestamp: Date.now(), timeZone: "Aisa/Seoul"}

    private _playerName : string = "";
    private _stage : number = 1;
    private _score : number = 0;
    private _playTime : number = 0;
    private _dateTime : string = Date.now().toString();
    private _timestamp : number = Date.now();
    private _timeZone : string = "Asia/Seoul";


    // Getter: _playerName 프로퍼티의 값을 반환
    get playerName() : string {
        return this._playerName;
    }

    // Setter: _playerName 프로퍼티의 값을 설정
    set playerName(value : string) {
        if (value.trim() === '') {
            console.log('playerName에 빈 문자열일 수 없습니다.');
        } else {
            this._playerName = value;
        }
    }

    // Getter: _stage 프로퍼티의 값을 반환
    get stage() : number {
        return this._stage;
    }

    // Setter: _stage 프로퍼티의 값을 설정
    set stage(value : number) {
        if (value) {
            this._stage = value;
        } else {
            console.log('stage에 빈 문자열일 수 없습니다.');
        }
    }

    // Getter: _score 프로퍼티의 값을 반환
    get score() : number {
        return this._score;
    }

    // Setter: _score 프로퍼티의 값을 설정
    set score(value : number) {
        if (value) {
            this._score = value;
        } else {
            console.log('score에 빈 문자열일 수 없습니다.');
        }
    }

    get playTime() : number {
        return this._playTime;
    }

    set playTime(value : number) {
        if (value) {
            this._playTime = value;
        } else {
            console.log('playTime에 빈 문자열일 수 없습니다.');
        }
    }

    get dateTime() : string {
        return this._dateTime;
    }

    set dateTime(value : string) {
        if (value) {
            this._dateTime = value;
        } else {
            console.log('dateTime에 빈 문자열일 수 없습니다.');
        }
    }

    get timestamp() : number {
        return this._timestamp;
    }

    set timestamp(value : number) {
        if (value) {
            this._timestamp = value;
        } else {
            console.log('timestamp에 빈 문자열일 수 없습니다.');
        }
    }

    get timeZone() : string {
        return this._timeZone;
    }

    set timeZone(value : string) {
        if (value) {
            this._timeZone = value;
        } else {
            console.log('timeZone에 빈 문자열일 수 없습니다.');
        }
    }

    toJson(): string {
        let json = JSON.stringify(this);
        Object.keys(this).filter(key => key.startsWith("_")).forEach(key => {
            json = json.replace(key, key.substring(1));
        });
        return JSON.parse(json);
    }

}