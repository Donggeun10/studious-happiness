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

        this.load.setPath("./assets/joystick");
        this.load.image('background', 'bg.png');
        this.load.image("sky", "sky.png");
        this.load.spritesheet("player", "dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("ground", "platform.png");
        this.load.image('left', 'arrow_left.png');
        this.load.image('right', 'arrow_right.png');
        this.load.image('up', 'arrow_up.png');

    }

    create (){
        this.scene.start('GameScene');
    }

    update(){
        // comment explaining why the method is empty
    }
}

export default Preloader;
