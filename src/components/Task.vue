<template>
    <div>
        <div class="text-error" v-if="!this.checkInput">Please enter at least 3 characters</div>
        <input
                class="input"
                type="text"
                placeholder="Search by name"

                v-on:input='validateInputText'
                v-model="text"
        >
        <button :disabled="this.text.length < this.minText" @click="search">Search</button>
        <ul class="list">
            <li class="list__item" v-for="item in resultsList" :key="item.id">
                <div class="list__item-name">Name: <a :href="item.html_url">{{item.name}}</a></div>

                <div class="list__item-star">Star count: {{item.stargazers_count}}</div>
                <div class="list__item-watchers">Watchers : {{item.watchers_count}}</div>
            </li>
        </ul>

        <div>
            <button
                    :disabled="this.$store.state.prevList === undefined "
                    @click="prevPage"
            >Prev
            </button>
            <button
                    :disabled="this.$store.state.nextList === undefined "
                    @click="throttledSave()"
            >Next
            </button>
        </div>
    </div>
</template>

<script>
    import throttle from '../throttle.js'

    export default {
        data() {
            return {
                text: '',
                pageNumber: 0,
                minText: 3,
                checkInput: true
            }
        },
        methods: {
            search() {
                this.$store.dispatch("GET_ALL_LIST", {text: this.text});
            },
            nextPage() {
                this.pageNumber++;
                this.$store.dispatch("GET_NEXT_PREV_LIST", {next: this.$store.state.nextList});
            },
            prevPage() {
                this.pageNumber--;
                this.$store.dispatch("GET_NEXT_PREV_LIST", {next: this.$store.state.prevList});
            },
            validateInputText() {
                let regexp = /^[а-яё]+$/i;

                if(this.text.match(regexp)) {
                    alert("Ввод только по английски");
                    this.text = ''
                }

                this.checkInput = this.text.length >= this.minText;
            }
        },
        computed: {
            throttledSave() {
                let DELAY = 2000;
                return throttle(this.nextPage, DELAY);
            },
            resultsList() {
                if (this.$store.state.list.items) {
                    return this.$store.state.list.items;
                }
                return null
            },
        }

    }
</script>

<style lang="scss">
    .text-error {
        color: red;
    }
    .input {
        margin-bottom: 5px;
    }

    .list {
        list-style: none;
        margin: 0;
        padding: 0;

        &__item {
            padding: 10px 0 10px;
            border-bottom: 1px solid #f1f1f1;

            &:hover {
                background: #f5f5f5;
            }

            &-name, &-star, &-watchers {
                font-size: 16px;
                line-height: 24px;
                margin-bottom: 5px;
            }
        }
    }
</style>
