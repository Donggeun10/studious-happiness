<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Tab 2</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Tab 2</ion-title>
                </ion-toolbar>
            </ion-header>
            <GameDude/>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent} from '@ionic/vue';

import GameDude from '@/views/game02/GameDude.vue';
</script>
