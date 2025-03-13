import {EventBus} from "../EventBus";
import {Scene} from 'phaser';
import {config} from "@/views/game04/game/main";
// import {Ollama} from 'ollama'

export class GameScene extends Scene {

    private isBlackTurn : boolean = true;
    private stones : any[] = [];

    constructor() {
        super({key: "GameScene"}); // key는 Phaser에서 Scene을 식별하기 위한 값
    }

    private readonly playGround = {x: 0, y: 0};

    // 게임 시작시에 필요한 GameObject를 정의
    create() {

        const bgImage = this.add.image(this.playGround.x, this.playGround.y, "background_19")
        const displayWidth = config.width as number;
        console.log(bgImage.width, displayWidth);

        const boardWidth = bgImage.width; // 바둑판 크기 (픽셀)
        const scale = displayWidth / boardWidth;
        const gridSize = 19;   // 격자 크기 (19x19)
        const cellSize = 66 * scale;
        const cellOffset = 35 * scale;
        const crossPoint = 40 * scale;

        bgImage.setOrigin(0, 0).setScale(scale);

        // 각 교차점의 좌표 계산
        const points : any[] = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = (i * cellSize) + crossPoint;
                const y = (j * cellSize) + crossPoint;
                points.push({x, y});
            }
        }

        // 돌을 저장할 배열
        this.stones = [];

        // 현재 턴을 나타내는 변수 (true: 흑, false: 백)
        this.isBlackTurn = true;

        // 클릭 이벤트 처리
        this.input.on('pointerdown', (pointer : any) => {

            const matchedPoint = points.filter((point) => {
                if ((point.x - cellOffset <= pointer.x && pointer.x <= point.x + cellOffset) && (point.y - cellOffset <= pointer.y && pointer.y
                    <= point.y + cellOffset)) {
                    return point;
                }
            });

            // 클릭된 교차점 계산
            const xy = matchedPoint.pop();
            const x = xy.x;
            const y = xy.y;

            // 이미 돌이 놓인 자리인지 확인
            if (!this.isOccupied(x, y)) {
                // 돌 추가
                this.addStone(x, y);
                // 턴 변경
                this.isBlackTurn = !this.isBlackTurn;
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    // 돌이 놓여 있는지 확인하는 함수
    isOccupied(x : number, y : number) {
        return this.stones.some(stone => stone.x === x && stone.y === y);
    }

    // 돌을 추가하는 함수
    addStone(x : number, y : number) {
        const stone = this.add.image(x, y, this.isBlackTurn ? 'blackStone' : 'whiteStone').setScale(0.3);
        this.stones.push({x, y, stone});
    }

    // 애니메이션을 정의하거나 게임상에서 상호작용을 해야하는 경우 처리
    update() {
        // comment explaining why the method is empty
    }

    // 캡쳐 후 Ollama Vision AI Model에 전송하여 승패를 판단하도록 함.
    async captureAndAsk() {
        // webGL 인경우 캡쳐가 안될 수 있음 https://github.com/hackergrrl/phaser-capture
        // 게임 캔버스에서 이미지 데이터 URL 생성
        const dataURL = this.game.canvas.toDataURL('image/png');
        // 다운로드 링크 생성
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'game_screenshot.png';

        // 링크 클릭하여 다운로드 실행
        // link.click();
        // console.log(dataURL);

        // const ollama = new Ollama({host: 'http://172.27.6.8:11435'})
        // const model = "MiniCPM-V-2_6-Q4_K_M";
        // const systemContent = " You are a friendly AI assistant. Your job is to judge the outcome of the game Gomok. "
        //     + " The rule of Concave is that if five stones of the same color are placed in a row, the stone of that color wins. Continuous corresponds to horizontal, vertical and diagonal lines. "
        //     + " The game board is a 19x19 grid. The intersection is the point where the horizontal and vertical lines intersect. "
        //     + " The white and black stones are placed on a yellow background with 19 lines drawn horizontally and vertically."
        //     + " The white and black stones are big round and placed on top of the intersection. "
        //     + " Please look at the image delivered and tell us the color of the winning stone. Or you can just say that if there is no winner, there is no winner.";
        //
        // const response = await ollama.chat({
        //                                        model: model,
        //                                        messages: [{
        //                                            role: "system",
        //                                            content: systemContent
        //                                        },
        //                                            {
        //                                                role: 'user',
        //                                                content: 'which color stone wins?',
        //                                                image: dataURL,
        //                                            }],
        //                                        stream: true
        //                                    })
        // let answer = "";
        // for await (const part of response) {
        //     answer = answer.concat(part.message.content);
        //     console.log(answer);
        // }
    }

}

export default GameScene;