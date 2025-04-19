const { createApp } = Vue;


createApp({
    data() {
        return {
            nomePokemon: '',
            pokemon: null,
            loading: false,
            favorito: []
        }
    },
    methods: {
        async buscarPokemon(nomeOuId = null) {
            const busca = nomeOuId || this.nomePokemon;
            this.loading = true
            if (!busca) {
                alert("Insira o ID ou o nome do Pokemon!");
                this.loading = false;
                return;
            }
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${String(busca).toLowerCase()}`)
                if (!res.ok) {
                    alert("Pokemon não encontrado!");
                    return this.loading = false;
                }
                this.pokemon = await res.json();
                this.nomePokemon = '';
                this.$nextTick(() => {
                    document.querySelector('input[type="text"]').focus();
                });                
            } catch (err) {
                alert(err.message)
                this.pokemon = null;
            }
            return this.loading = false
        },
        tipoCor(type) {
            const tipos = {
                grass: "#008000",
                fire: "#FFA500",
                water: "#00f",
                bug: "rgb(106, 106, 1)",
                normal: "#808080",
                poison: "#A020F0",
                electric: "#FFFF00",
                ground: "rgb(255, 255, 98)",
                fighting: "rgb(255, 106, 0)",
                psychic: "rgb(255, 68, 134)",
                rock: "rgb(250, 192, 134)",
                flying: "rgb(3, 150, 212)",
                ghost: "rgb(0, 14, 103)",
                ice: "rgb(50, 183, 255)",
                dragon: "rgb(28, 0, 139)",
                steel: "rgb(129, 128, 128)",
                dark: "rgb(64, 46, 16)",
                fairy: "rgb(255, 0, 195)"
            };

            return tipos[type] || "#000"
        },
        navegarPokemon(direcao) {
            if (!this.pokemon || isNaN(this.pokemon.id)) return;

            const novoId = this.pokemon.id + direcao;
            if (novoId <= 0) return;
            this.buscarPokemon(novoId);
        },
        favoritar() {
            const existe = this.favorito.find(fav => fav.id === this.pokemon.id)
            if (existe) return alert("Esse Pokemon ja esta na sua lista de favoritos!")
            return this.favorito.push({
                id: this.pokemon.id,
                nome: this.pokemon.name,
                imagem: this.pokemon.sprites.front_default
            });
        }
    },
    watch: {
        pokemon: {
            handler(pokemon) {
                localStorage.setItem("pokemon", JSON.stringify(pokemon))
            },
            deep: true
        },
        favorito: {
            handler(favorito) {
                localStorage.setItem("favoritos", JSON.stringify(favorito))
            },
            deep: true
        }
    },
    mounted() {
        const ultimoPokemon = localStorage.getItem("pokemon")
        const favoritosSalvos = localStorage.getItem("favoritos")

        if (ultimoPokemon) {
            try {
                const parse = JSON.parse(ultimoPokemon);
                if (parse && parse.sprites && parse.sprites.other.showdown.front_default) {
                    this.pokemon = parse;
                }
            } catch (e) {
                console.error("Erro ao carregar último Pokémon:", e);
            }
        }

        if (favoritosSalvos) {
            try {
                this.favorito = JSON.parse(favoritosSalvos)
            } catch (e) {
                console.error("Erro ao carregar favoritos:", e);
            }
        }
    }

}).mount('#app');