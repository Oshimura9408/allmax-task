import Vue from 'vue';
import Vuex from 'vuex';
import {HTTP} from "./serve/index.js";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        list: [],
        prevList: undefined,
        nextList: undefined,
        lastList: '',
        listAll: []
    },
    mutations: {
        SET_LIST: (state, payload) => {
            state.list = payload;
        },
        SET_NEXT_LAST: (state, payload) => {
            state.prevList = payload.prev;
            state.nextList = payload.next;
            state.lastList = payload.last;
        },
    },
    actions: {
        GET_ALL_LIST: (context, obj) => {
            HTTP.get('', {params: {q: obj.text}}).then(response => {

                // из Response Headers преобразую строчку Link в объект чтобы получить след. и пред. страницу поиска
                if (response.headers.link) {
                    let arrData = response.headers.link.split("link:");
                    response.headers.link = arrData.length == 2 ? arrData[1] : response.headers.link;
                    let parsed_data = {};

                    arrData = response.headers.link.split(",");

                    for (let d of arrData) {
                        let linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d);

                        parsed_data[linkInfo[2]] = linkInfo[1]
                    }

                    context.commit('SET_NEXT_LAST', parsed_data);

                }

                context.commit('SET_LIST', response.data);

            }).catch(error => {
                console.log(error);
            });
        },
        GET_NEXT_PREV_LIST: (context, obj) => {
            HTTP.get(obj.next).then(response => {
                if (response.headers.link) {
                    let arrData = response.headers.link.split("link:");
                    response.headers.link = arrData.length == 2 ? arrData[1] : response.headers.link;
                    let parsed_data = {};

                    arrData = response.headers.link.split(",");

                    for (let d of arrData) {
                        let linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d);

                        parsed_data[linkInfo[2]] = linkInfo[1]
                    }

                    context.commit('SET_NEXT_LAST', parsed_data);

                }
                context.commit('SET_LIST', response.data);

            });
        }
    }
});
