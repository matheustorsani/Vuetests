<script setup lang="ts">
defineProps<{
    title: string | number
    content: string | number
    creator: string | number
}>()
</script>

<template>
    <div class="post">
        <h1 class="title">{{ title }}</h1>
        <p class="content">{{ content }}</p>
        <p class="creator">Escrito por: {{ creator }}</p>
    </div>
</template>
