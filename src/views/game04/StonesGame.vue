<script setup lang="ts">
import StonesGame from "./game/PhaserStonesGame.vue";
import {ref, toRaw} from "vue";
import { IonButton } from '@ionic/vue';
const phaserRef = ref();
// Event emitted from the PhaserGame component
const currentScene = (scene : object) => {
    print('Game is ready to play', scene)
}

const gameOverScene = (scene : object) => {
    print('Game Over', scene)
}

const print = (phase : string, data : object) => {
    console.log(phase, data)
}

const response = ref("");

const winner = (gameName: string, uuid : string, data : any) => {
    console.log('winner', gameName, uuid, data);
    response.value = data;
}

const createScreenShot = () => {
    const scene = toRaw(phaserRef.value.scene);
    scene.captureAndAsk(winner);
}

</script>
<template>
    <div class="container">
        <div class="row">
            <!-- 왼쪽 열 -->
            <div class="col-12 col-md-8 order-md-1">
                <StonesGame ref="phaserRef" @current-active-scene="currentScene" @game-over-scene="gameOverScene"/>
            </div>
            <!-- 오른쪽 열 -->
            <div class="col-12 col-md-4 order-md-2">
                <div>
                    <ion-button @click="createScreenShot">ScreenShot</ion-button>
                </div>
                <div class="spritePosition">
                    Result : <pre>{{ response }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>
