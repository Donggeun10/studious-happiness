<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {EventBus} from './EventBus'
import StartGame from './main'
import {Scene} from "phaser";

// Save the current scene instance
const scene = ref()
const game = ref()
const containerId = 'fiveStones'
const emit = defineEmits(['current-active-scene', 'game-over-scene'])

onMounted(() => {
    game.value = StartGame(containerId)

    EventBus.on('current-scene-ready', (scene_instance : Scene) => {
        emit('current-active-scene', scene_instance)

        scene.value = scene_instance
    })

    EventBus.on('game-over', (scene_instance : Scene) => {
        emit('game-over-scene', scene_instance)

        scene.value = scene_instance
    })
})

onUnmounted(() => {
    if (game.value) {
        game.value.destroy(true)
        game.value = null
    }
})

defineExpose({scene, game})
</script>

<template>
    <div :id="containerId"></div>
</template>
