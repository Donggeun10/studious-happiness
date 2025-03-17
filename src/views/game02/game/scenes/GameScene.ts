import {EventBus} from "../EventBus";
import {Scene} from 'phaser';
import {CapacitorConnector, RedisExternalRepository} from "@/components/ts/DataStorage";
import {DateTime} from "luxon";
import {config, GameData} from "@/views/game02/game/main";
import ArcadeSprite = Phaser.Physics.Arcade.Sprite;
import {Utility} from "@/components/ts/Settings";


export class GameScene extends Scene {

    constructor() {
        super({key: "GameScene"}); // key는 Phaser에서 Scene을 식별하기 위한 값
        this.repository = new Utility().isPC() ? new RedisExternalRepository() : new CapacitorConnector();
    }

    repository;
    gameName = config.parent as string;
    gameData = new GameData();
    player!: Phaser.Physics.Arcade.Sprite;
    stars : any;
    bombs : any;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    cursors : any;
    gameOver = false;
    stage = 1;
    stageText: any;
    score = 0;
    scoreText: any;
    timerVal = 60;
    timerText: any;
    playTime = 0;
    tmpPlayTime = 0;
    playTimeText: any;
    playGround = {x: 400, y: 300};
    playerName = "";
    welcomeMessage: any;
    timer: any;

    // 게임 시작시에 필요한 GameObject를 정의
    create() {
        // Background image
        this.add.image(this.playGround.x, this.playGround.y, "sky");

        const titleText = this.add.text(this.sys.game.scale.width / 2, this.sys.game.scale.height / 2,
            "BabaBom\nClick to Play",
            {align: "center", strokeThickness: 4, fontSize: 40, fontStyle: "bold", color: "#8c7ae6"}
        )
        .setOrigin(.5)
        .setDepth(3)
        .setInteractive();
        // title tween like retro arcade
        this.add.tween({
            targets: titleText,
            duration: 800,
            ease: (value: number) => (value > .8),
            alpha: 0,
            repeat: -1,
            yoyo: true,
        });

        // Text Events
        titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
            titleText.setColor("#9c88ff");
            this.input.setDefaultCursor("pointer");
        });
        titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
            titleText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
        titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            //this.sound.play("whoosh", { volume: 1.3 });
            this.add.tween({
                targets: titleText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    // if (!this.sound.get("theme-song")) {
                    //     this.sound.play("theme-song", { loop: true, volume: .5 });
                    // }
                    this.startGame();
                }
            })
        });

        this.welcomeMessage = this.add.text(this.playGround.x, this.playGround.y - 200, "Hello, --", {
            color: "#FFFFFF",
            fontSize: 60,
            fontStyle: "bold"
        }).setOrigin(0.5);

        EventBus.emit('current-scene-ready', this);
    }

    startGame() {

        this.add.image(this.playGround.x, this.playGround.y, "sky");
        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

        //  Now let's create some ledges
        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        // The player and its settings
        this.player = this.physics.add.sprite(100, 400, "dude").setName("player");

        // player가 바닥에 닿았을 때, 약간 튕기는 느낌을 설정
        this.player.setBounce(0.2); // y값을 생략하면 x와 y모두 동일한 값을 적용하는 것과 같음

        // player가 게임 화면 밖으로 나가지 않게 설정
        this.player.setCollideWorldBounds(true);

        // 애니메이션 생성 - 나중에 key로 애니메이션 식별해서 참조
        if (!this.anims.exists("left")) {
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),
                frameRate: 10, // 초당 프레임 수를 나타냄(초당 10프레임 설정 의미)
                repeat: -1, // 무한 반복을 의미
            });
        }

        if (!this.anims.exists("turn")) {
            this.anims.create({
                key: "turn",
                frames: [{key: "dude", frame: 4}],
                frameRate: 20,
            });
        }

        if (!this.anims.exists("right")) {
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}),
                frameRate: 10,
                repeat: -1,
            });
        }

        this.cursors = this.input.keyboard?.createCursorKeys();

        this.score = 0;
        this.gameOver = false;
        // 별 생성
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70},
        });

        // 별 이미지 요소 튕김 효과
        this.stars.children.iterate(function (star : ArcadeSprite) {
            //  Give each star a slightly different bounce
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // 장애물 생성
        this.bombs = this.physics.add.group();

        // 단계 텍스트 생성
        this.stageText = this.add.text(16, 16, "STAGE : 1", {
            fontSize: "32px",
            color: "#333",
        });

        // 점수 텍스트 생성
        this.scoreText = this.add.text(240, 16, "SCORE : 0", {
            fontSize: "32px",
            color: "#333",
        });

        this.timer = this.time.addEvent({delay: 60000, callback: this.gameOverScreen, callbackScope: this});

        this.timerText = this.add.text(this.playGround.x * 1.5, 16, "Time : 60", {
            fontSize: "32px",
            color: "#333",
        });

        this.playTimeText = this.add.text(this.playGround.x, 560, "Play Time : 00", {
            fontSize: "32px",
            color: "#fbfbfb",
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);
    }

    gameOverScreen() {
        if (this.playerName && this.playerName !== "") {
            this.gameData.stage = this.stage;
            this.gameData.score = this.score;
            this.gameData.dateTime = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');
            this.gameData.timeZone = DateTime.now().zoneName;
            this.gameData.timestamp = DateTime.utc().toMillis();
            this.gameData.playTime = this.tmpPlayTime;
            this.gameData.playerName = this.playerName;
            this.repository.saveGameDataToRedis(this.gameName, this.gameData.toJson());
        } else {
            console.log("playerName is empty. ", this.playerName);
        }
        this.add.image(this.playGround.x, this.playGround.y, 'background').setAlpha(0.5);

        const gameOverText = this.add.text(this.playGround.x, this.playGround.y, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        gameOverText.on(Phaser.Input.Events.POINTER_OVER, () => {
            gameOverText.setColor("#FF7F50");
            this.input.setDefaultCursor("pointer");
        });

        gameOverText.on(Phaser.Input.Events.POINTER_OUT, () => {
            gameOverText.setColor("#ffffff");
            this.input.setDefaultCursor("default");
        });

        gameOverText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.add.tween({
                targets: gameOverText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    this.scene.start('GameScene');
                }
            })
        });
    }

    collectStar(_player : any, _star : any) {

        _star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('SCORE : ' + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child: ArcadeSprite) => {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            const bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
            this.timerVal = 60;
            this.stageText.setText('STAGE : ' + ++this.stage);
            this.playTime = this.tmpPlayTime;
            this.timer.reset({delay: 60000, callback: this.gameOverScreen, callbackScope: this});
        }
    }

    // 플레이어 및 폭탄 충돌 처리
    hitBomb(_player : any, _bomb : any) {
        console.log("hitBomb", _player, _bomb);
        this.physics.pause();
        _player.setTint(0xff0000);
        _player.anims.play("turn");
        this.gameOver = true;
        EventBus.emit('game-over', this);
        this.gameOverScreen();
    }

    // 애니메이션을 정의하거나 게임상에서 상호작용을 해야하는 경우 처리
    update() {
        if (this.gameOver) return;

        //const player = this.children.getByName("player") as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

        if (!this.cursors || !this.player) return;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160); // 프레임마다 움직일 속도
            this.player.anims.play("left", true); // 애니메이션 실행 메서드(애니메이션 키, 반복여부)
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(-330);
        }

        if (this.timer) {
            if (this.timer.getProgress() === 1) {
                this.timerText.setText("Time : 00");
            } else {
                const elapsedSeconds = Math.floor(this.timer.getElapsedSeconds());
                const remaining = (this.timerVal - elapsedSeconds).toPrecision(4);
                const pos = remaining.indexOf('.');

                let seconds = remaining.substring(0, pos);
                const ms = remaining.substring(pos + 1, 2);

                seconds = Phaser.Utils.String.Pad(seconds, 2, '0', 1);

                this.timerText.setText(seconds + ':' + ms);
                this.timerText.setText("Time : " + seconds);
                this.playTimeText.setText("Play Time : " + Phaser.Utils.String.Pad(this.playTime + elapsedSeconds, 2, '0', 1));
                this.tmpPlayTime = this.playTime + elapsedSeconds;
            }
        }

    }

    addPlayerName(name: string) {
        this.playerName = name;
        this.welcomeMessage.setText("Hello, " + name);
    }
}

export default GameScene;