import Preloader from '@/views/game04/game/scenes/Preloader'
import GameScene from '@/views/game04/game/scenes/GameScene'
import GameConfig = Phaser.Types.Core.GameConfig;


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
export const config : GameConfig = {
    type: Phaser.CANVAS,
    width: 640,
    height: 640,
    parent: 'fiveStones',
    backgroundColor: '#B23A3A',
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x : 0, y : 300 },// y방향 300의 중력을 적용, y가 클수록 빠르게 하강
            debug: false, // 디버그 모드 활성화시, 충돌 영역 및 기타 물리 관련 정보 표시
        },
    },
    dom: {
        createContainer: true
    },
    scene: [
        Preloader,
        GameScene,
    ],
    scale: {
        // Or set parent divId here
        parent: 'fiveStones',

        mode: Phaser.Scale.FIT,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 640,
            height: 640
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 1280,
            height: 1280
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