import {getLocalUser} from "../_helpers/auth";
import Vuex from 'vuex';
import Vue from 'vue';
import getWeb3 from '../util/getWeb3'

Vue.use(Vuex);

const user = getLocalUser();

export const store = new Vuex.Store({
    state: {
        currentUser: user,
        isLoggedIn: !!user,
        loading: false,
        auth_error: null,
        customers: [],

        web3: {
            isInjected: false,
            web3Instance: null,
            networkId: null,
            coinbase: null,
            balance: null,
            error: null
        },
        contractInstance: null
    },
    getters: {
        isLoading(state) {
            return state.loading;
        },
        isLoggedIn(state) {
            return state.isLoggedIn;
        },
        authError(state){
            return state.auth_error;
        },
        currentUser(state){
                return state.currentUser;
        }
    },
    mutations: {
        login(state){
            state.loading = true;
            state.auth_error = null;
        },
        loginSuccess(state, payload){
            state.auth_error = null;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.currentUser = Object.assign({}, payload.user, {token: payload.token});

            localStorage.setItem("user", JSON.stringify(state.currentUser));
        },
        loginFailed(state, payload){
            state.isLoading = false;
            state.auth_error = payload.error;
        },
        logout(state){
          localStorage.removeItem("user");
            state.isLoggedIn = false;
            state.currentUser = null;
        },

        registerWeb3Instance (state, payload) {
            // console.log('registerWeb3instance Mutation being executed', payload)
            let result = payload
            let web3Copy = state.web3
            web3Copy.coinbase = result.coinbase
            web3Copy.networkId = result.networkId
            web3Copy.balance = parseInt(result.balance, 10)
            web3Copy.isInjected = result.injectedWeb3
            web3Copy.web3Instance = result.web3
            state.web3 = web3Copy
        }
    },
    actions: {
        login(context){
            context.commit("login");
        },

        registerWeb3 ({commit}) {
            // console.log('registerWeb3 Action being executed')
            getWeb3.then(result => {
                // console.log('committing result to registerWeb3Instance mutation')
                commit('registerWeb3Instance', result)
            }).catch(e => {
                console.log('error in action registerWeb3', e)
            })
        },
    }
});