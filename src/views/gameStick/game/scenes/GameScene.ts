import {EventBus} from "../EventBus";
import {Scene} from 'phaser';
import Pointer = Phaser.Input.Pointer;
import {Utility} from "@/components/ts/Settings";

export class GameScene extends Scene {

    constructor() {
        super({key: "GameScene"}); // key는 Phaser에서 Scene을 식별하기 위한 값
    }

    player : any;
    startX : number = 0;
    startY : number = 0;
    platforms : any;
    jumpButton : any;
    leftButton : any;
    rightButton : any;
    utility : Utility = new Utility();

    // 게임 시작시에 필요한 GameObject를 정의
    create() {

        if(this.utility.isPC()) {
            console.log('PC browser');
        }

        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

        // 플레이어 캐릭터 설정
        // The player and its settings
        this.player = this.physics.add.sprite(400, 400, "player").setName("player");

        // player가 바닥에 닿았을 때, 약간 튕기는 느낌을 설정
        this.player.setBounce(0.2); // y값을 생략하면 x와 y모두 동일한 값을 적용하는 것과 같음
        this.player.setCollideWorldBounds(true);  // 화면 밖으로 나가지 않게 설정

        // 애니메이션 생성 - 나중에 key로 애니메이션 식별해서 참조
        if (!this.anims.exists("left")) {
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("player", {start: 0, end: 3}),
                frameRate: 10, // 초당 프레임 수를 나타냄(초당 10프레임 설정 의미)
                repeat: -1, // 무한 반복을 의미
            });
        }

        if (!this.anims.exists("turn")) {
            this.anims.create({
                key: "turn",
                frames: [{key: "player", frame: 4}],
                frameRate: 20,
            });
        }

        if (!this.anims.exists("right")) {
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers("player", {start: 5, end: 8}),
                frameRate: 10,
                repeat: -1,
            });
        }

        // 가상 버튼 생성
        this.leftButton = this.add.image(100, 500, 'button').setInteractive();
        this.leftButton.on('pointerdown', this.onLeftButtonDown, this);
        this.leftButton.on('pointerup', this.onTurnButtonUp, this);

        // 가상 버튼 생성
        this.rightButton = this.add.image(200, 500, 'button').setInteractive();
        this.rightButton.on('pointerdown', this.onRightButtonDown, this);
        this.rightButton.on('pointerup', this.onTurnButtonUp, this);

        // 가상 버튼 생성
        this.jumpButton = this.add.image(700, 500, 'button').setInteractive();
        this.jumpButton.on('pointerdown', this.onButtonDown, this);
        this.jumpButton.on('pointerup', this.onButtonUp, this);

        this.physics.add.collider(this.player, this.platforms);

        EventBus.emit('current-scene-ready', this);
    }

    // 애니메이션을 정의하거나 게임상에서 상호작용을 해야하는 경우 처리
    update() {
        // 플레이어 이동 처리
        // this.player.setVelocityX(this.moveDirection.x * this.playerSpeed);
        // this.player.setVelocityY(this.moveDirection.y * this.playerSpeed);

    }

    onButtonDown(pointer : Pointer) {
        // 버튼 눌림 상태 처리
        console.log('버튼 눌림', pointer);
        if(this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    onButtonUp(pointer : Pointer) {
        // 버튼 뗌 상태 처리
        console.log('버튼 뗌', pointer);
    }

    onLeftButtonDown(pointer : Pointer) {
        // 버튼 눌림 상태 처리
        console.log('버튼 눌림', pointer);
        this.player.setVelocityX(-160); // 프레임마다 움직일 속도
        this.player.anims.play("left", true); // 애니메이션 실행 메서드(애니메이션 키, 반복여부)
    }

    onRightButtonDown(pointer : Pointer) {
        // 버튼 눌림 상태 처리
        console.log('버튼 눌림', pointer);
        this.player.setVelocityX(160);
        this.player.anims.play("right", true);
    }

    onTurnButtonUp(pointer : Pointer) {
        // 버튼 뗌 상태 처리
        console.log('버튼 뗌', pointer);
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
    }

}

export default GameScene;