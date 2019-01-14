<template>
    <div class='metamask-info'>
        <!--<p>Metamask: {{ web3.isInjected }}</p>
        <p>Network: {{ web3.networkId }}</p>
        <p>Account: {{ web3.coinbase }}</p>
        <p>Balance: {{ web3.balance}}</p>-->

        <div v-if="web3.isInjected">
            <button class="btn btn-warning" v-on:click="Login">Login</button>
        </div>
        <div v-else>
            <h1>Please go to metamask in your brouser and sign in !</h1>
        </div>
    </div>
</template>

<script>
    import Web3 from 'web3'

    export default {
        data () {
            return {
                msg: 'Hello World!'
            }
        },
        beforeCreate () {
            this.$store.dispatch('registerWeb3')
        },
        computed: {
            web3 () {
                return this.$store.state.web3
            }
        },
        methods: {
            Login()
            {
                let myMeta = {
                    isInjected: this.web3.isInjected ,
                    networkId: this.web3.networkId ,
                    coinbase: this.web3.coinbase ,
                    balance: this.web3.balance ,
                };

                console.log(myMeta);
                var random_msg = "Hello from23111 Kostia!";
                window.web3.personal.sign(window.web3.fromUtf8(random_msg), window.web3.eth.coinbase, (err, signature)=>{
                    if (err) throw err;
                    console.log('My pidpys:', signature);

                    myMeta.signuture = signature;
                    if (myMeta.isInjected) {
                    this.$http.post('http://localhost:3000/check-sign',
                        {
                            signature: signature,
                            coinbase: myMeta.coinbase,
                            msg: random_msg
                        })
                        .then(response => {
                            localStorage.setItem('jwt',response.data.token)
                            console.log(response.data)
                        })
                        .catch(function (error) {
                            console.error(error.response);
                        });
                }

                });

            }
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>