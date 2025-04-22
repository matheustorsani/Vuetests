<script setup lang="ts">
import { ref } from 'vue';
import Posts from './Posts.vue';

type Post = {
    title: string | number,
    content: string | number,
    creator: string | number
}

const title = ref('');
const content = ref('');
const creator = ref('');
const posts = ref<Post[]>([])

function add() {
    if (!title.value || !content.value) {
        alert('Preencha todos os campos!')
        return
    }

    if (!creator.value) {
        creator.value = 'anonymous'
    }

    posts.value.push({ title: title.value, content: content.value, creator: creator.value });
    console.log(posts.value);
    title.value = '';
    content.value = '';
    creator.value = '';
}
</script>

<template>
    <header>
        <div class="header">
            <a href="../../index.html">
                <h4>Home</h4>
            </a>
            <h1>Registre aqui o que quiser!</h1>
            <h2>Em breve, disponibilidade para imagens!</h2>
        </div>
    </header>
    <main>
        <div class="register-content">
            <div class="form-group">
                <label class="label-title label" for="title">Titulo:</label>
                <input class="title-input input" type="text" name="Title" id="title"
                    placeholder="Qual vai ser o titulo?" v-model="title" autofocus>
            </div>
            <div class="form-group">
                <label class="label-content label" for="content">Conteúdo:</label>
                <textarea class="content-input input" name="Content" id="content" placeholder="Digite aqui..." rows='20'
                    cols='100' v-model="content" @keyup.enter="add"></textarea>
            </div>
            <div class="form-group">
                <label class="label-name label" for="name">Nome:</label>
                <input class="name-input input" type="text" name="Name" id="name"
                    placeholder="deixar em branco = anonymous" v-model="creator" @keyup.enter="add">
            </div>
            <button class="submit-btn" @click="add">Enviar!</button>
        </div>

        <div class="division"></div>
        <div class="posts">
            <Posts v-for="(post, index) in posts" :key="index" :title="post.title" :content="post.content"
                :creator="post.creator" />
        </div>
    </main>
</template>