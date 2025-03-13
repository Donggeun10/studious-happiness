<script setup lang="ts">
import PhaserGame2 from "./game/PhaserGame2.vue";
import {ref, toRaw} from "vue";
import {LocalStorageRepository, RedisExternalRepository, CapacitorConnector} from "@/components/ts/DataStorage";
import {config} from "@/views/game02/game/main";

import { IonButton, IonIcon } from '@ionic/vue';
import {star} from "ionicons/icons";
import {Utility} from "@/components/ts/Settings";

const phaserRef = ref();
const gameId = config.parent as string;
const repository = new LocalStorageRepository();
const redisRepo = new Utility().isPC() ? new RedisExternalRepository() : new CapacitorConnector();

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

const addPlayerName = () => {
    const scene = toRaw(phaserRef.value.scene);
    scene.addPlayerName(playerName.value);
}

const displayScoreList = () => {
    const scene = toRaw(phaserRef.value.scene);
    if (scene) {
        //  Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
        scene.changeScene()
    }
}

const removeAllGameData = () => {
    if (confirm('Do you want to remove all game data?')) {
        repository.clearAllGameData();
    }
}

const playerName = ref("");
const saveDatas = ref("");

const findPlayerName = (gameId : string, datas : any) => {
    saveDatas.value = datas;

    if (Array.isArray(saveDatas.value)) {
        saveDatas.value.sort((a, b) => b.timestamp - a.timestamp);
        playerName.value = saveDatas.value[0]["playerName"];
    } else {
        playerName.value = "Not found";
    }
    console.log('playerName', gameId, playerName.value, saveDatas.value[0]);
}

redisRepo.loadGameData(gameId, findPlayerName);
</script>
<template>
    <div class="container">
        <div class="row">
            <!-- 왼쪽 열 -->
            <div class="col-12 col-md-8 order-md-1">
                <PhaserGame2 ref="phaserRef" @current-active-scene="currentScene" @game-over-scene="gameOverScene"/>
            </div>
            <!-- 오른쪽 열 -->
            <div class="col-12 col-md-4 order-md-2">
                <div class="input-form">
                    <input v-model="playerName" type="text" placeholder="put in Player Name" @keyup.enter="addPlayerName"/>
                </div>
                <div>
                    <ion-button size="default" @click="displayScoreList">
                        <ion-icon slot="start" :icon="star"></ion-icon> Score List</ion-button>
                </div>
                <div class="spritePosition">
                    Game Result : <pre>{{ saveDatas }}</pre>
                </div>
                <div>
                    <ion-button size="default" @click="removeAllGameData">Clear All Game Data</ion-button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.input-form {
    padding: 15px;
    width: 100%;
    background-color: #f67171;
}
#input-form input {
    padding: 10px;
    font-size: 20px;
    width: 100%;
}
</style>