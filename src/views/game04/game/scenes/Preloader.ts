import {Scene} from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init (){
        // comment explaining why the method is empty
    }

    // 외부 파일 혹은 assets을 미리 불러오기 위한 작업 처리
    preload() {
        this.load.setPath("./assets/gogame");
        this.load.image('background_19', '19_board.png');
        this.load.image('blackStone', 'black_stone.png');
        this.load.image('whiteStone', 'white_stone.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('GameScene');
    }
}

export default Preloader;
