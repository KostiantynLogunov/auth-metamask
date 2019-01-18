<template>
    <div class="login row justify-content-center">
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">SignIN</div>
                <div class="card-body">
                    <div v-if="web3.isInjected">
                        <form @submit.prevent="authenticate">
                            <div class="form-group">
                                <label for="messageForSignIn">Message for SignIn</label>
                                <textarea class="form-control" id="messageForSignIn" rows="3" v-model="message" placeholder="Please enter msg"></textarea>
                            </div>
                                <input class="btn btn-warning" type="submit" value="SigIn" :disabled="!message">
                            <div class="form-group row" v-if="authError">
                                <p class="error">
                                    {{ authError }}
                                </p>
                            </div>
                        </form>
                    </div>
                    <div class="text-center" v-else>
                        <h3 class="text-danger"><b>Please go to metamask in your browser and signIn !</b></h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {login} from '../../_helpers/auth';
    export default {
        name: "login",
        data() {
            return {
                message: null
            };
        },
        beforeCreate () {
            this.$store.dispatch('registerWeb3')
        },
        computed: {
            web3 () {
                return this.$store.state.web3
            },
            authError() {
                return this.$store.getters.authError;
            }
        },
        methods: {
            authenticate() {
                if (this.message.length < 1) return alert('Enter message for SignIn');
                this.$store.dispatch('login');
                let myMeta = {
                    isInjected: this.web3.isInjected ,
                    networkId: this.web3.networkId ,
                    coinbase: this.web3.coinbase ,
                    balance: this.web3.balance ,
                };
                console.log(myMeta);

                var input_msg = this.message;
                window.web3.personal.sign(window.web3.fromUtf8(input_msg), window.web3.eth.coinbase, (err, signature)=>{
                    if (err) throw err;
                    console.log('My pidpys:', signature);

                    myMeta.signuture = signature;
                    if (myMeta.isInjected) {
                        login({
                            signature: signature,
                            coinbase: myMeta.coinbase,
                            msg: input_msg
                        })
                            .then((res) => {
                                console.log(res)
                                this.$store.commit("loginSuccess", res);
                                this.$router.push({path: '/'});
                            })
                            .catch((error) => {
                                this.$store.commit("loginFailed", {error});
                            });


                        /*this.$http.post('http://localhost:3000/check-sign',
                            {
                                signature: signature,
                                coinbase: myMeta.coinbase,
                                msg: input_msg
                            })
                            .then(response => {
                                localStorage.setItem('jwt',response.data.token)
                                console.log(response.data)
                            })
                            .catch(function (error) {
                                console.error(error.response);
                            });*/
                    }

                });
            }
        }
    }
</script>

<style scoped>
    .error {
        text-align: center;
        color: red;
    }
</style>