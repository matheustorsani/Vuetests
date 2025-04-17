const { createApp } = Vue;


createApp({
    data() {
        return {
            temaEscuro: false,
            buscaAtiva: null,
            filme: '',
            filmes: [
                {
                    poster: 'https://m.media-amazon.com/images/M/MV5BM2JiZjU1NmQtNjg1Ni00NjA3LTk2MjMtNjYxMTgxODY0NjRhXkEyXkFqcGc@._V1_SX300.jpg',
                    nome: 'Matrix',
                    ano: 1993,
                    curtido: false,
                    numCurtido: 56
                }
            ],
            filmesRefs: []
        }
    },
    methods: {
        alterarTema() {
            this.temaEscuro = !this.temaEscuro
        },
        async adicionarFilme() {
            if (this.isNull()) return alert("Insira o nome do filme!")

            try {
                const query = await fetch(`https://www.omdbapi.com/?apikey=e1c17332&t=${encodeURIComponent(this.filme)}`)
                const res = await query.json();

                if (this.filmes.find(f =>
                    f.nome.toLowerCase().includes(this.filme.trim().toLowerCase())
                )) return this.buscar();

                if (res.Error) return alert("Filme não encontrado!")
                let curtidas = parseInt(res.imdbVotes.replace(/,/g, '')) || 0

                return this.filmes.push({
                    poster: res.Poster,
                    nome: res.Title,
                    ano: res.Year,
                    curtido: false,
                    numCurtido: curtidas
                });
            } catch (error) {
                console.error(error.message);
            }

            return this.filme = '';

        },
        curtirFilme(index) {
            if (!this.filmes[index].curtido) {
                this.filmes[index].curtido = true;
                return this.filmes[index].numCurtido++
            }
            this.filmes[index].curtido = false
            return this.filmes[index].numCurtido--
        },
        removerFilme(index) {
            this.filmes.splice(index, 1);
        },
        buscar() {
            if (this.isNull()) return alert("Insira o titulo do filme para procurar!")
            const idx = this.filmes.findIndex(f =>
                f.nome.toLowerCase().includes(this.filme.trim().toLowerCase())
            );
            if (idx !== -1) {
                this.buscaAtiva = idx;
                this.$nextTick(() => {
                    const el = this.filmesRefs[idx];
                    if (el && typeof el.scrollIntoView === 'function') {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
                alert(`Filme encontrado: ${this.filmes[idx].nome}`);
            } else {
                this.buscaAtiva = null;
                alert("Filme não encontrado!");
            }



            setTimeout(() => this.buscaAtiva = null, 2000);
        },
        isNull() {
            return this.filme.trim() == "" ? true : false
        },
        async filmeAleatorio() {
            const keys = [
                'the', 'batman', 'dark', 'love', 'war', 'hero', 'space', 'dream', 'legend', 'mystery',
                'adventure', 'fantasy', 'thriller', 'comedy', 'drama', 'horror', 'action', 'romance', 'crime', 'sci-fi',
                'animation', 'family', 'history', 'biography', 'western', 'musical', 'sport', 'documentary', 'noir', 'supernatural',
                'revenge', 'survival', 'friendship', 'betrayal', 'power', 'magic', 'journey', 'destiny', 'future', 'past',
                'robot', 'alien', 'monster', 'vampire', 'zombie', 'detective', 'spy', 'treasure', 'island', 'kingdom',
                'star', 'death', 'night', 'life', 'light'
            ];
            const randomKey = keys[Math.floor(Math.random() * keys.length)]

            const query = await fetch(`https://www.omdbapi.com/?apikey=e1c17332&s=${randomKey}`)

            const res = await query.json()

            const randomIndex = () => Math.floor(Math.random() * res.Search.length)
            const filmeAleatorio = res.Search[randomIndex()]
            if (this.filmes.find(f =>
                f.nome.toLowerCase().includes(filmeAleatorio.Title.trim().toLowerCase())
            )) return randomIndex();

            this.filme = filmeAleatorio.Title
            return this.adicionarFilme()
        }
    },
    mounted() {
        const filmesSalvos = localStorage.getItem('filmes')
        const tema = localStorage.getItem('tema')
        if (filmesSalvos) this.filmes = JSON.parse(filmesSalvos)
        if (tema) this.temaEscuro = JSON.parse(tema)

    },
    watch: {
        temaEscuro: {
            handler(temaEscuro) {
                localStorage.setItem('tema', JSON.stringify(temaEscuro))
                document.body.classList.toggle('dark-body', temaEscuro)
            },
            deep: true
        },
        filmes: {
            handler(newMv) {
                localStorage.setItem('filmes', JSON.stringify(newMv))
                this.filmeRefs = []
            },
            deep: true
        }
    }
}).mount('#app')