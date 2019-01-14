<template>
    <div>
        <div class='metamask-info'>
            <p>Metamask: {{ web3.isInjected }}</p>
            <p>Network: {{ web3.networkId }}</p>
            <p>Account: {{ web3.coinbase }}</p>
            <p>Balance: {{ web3.balance}}</p>

            <div v-if="web3.isInjected">
                <button class="btn btn-warning">Login</button>
            </div>
            <div v-else>
                <h1>Please go to metamask in your brouser and sign in !</h1>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                balance: null
            }
        },
        computed: {
            web3 () {
                return this.$store.state.web3
            }
        },
        methods : {
            handleSubmit(e){
                e.preventDefault()
                if (this.password.length > 0) {
                    this.$http.post('http://localhost:3000/login', {
                        email: this.email,
                        password: this.password
                    })
                        .then(response => {
                            // let is_admin = response.data.user.is_admin
                            // localStorage.setItem('user',JSON.stringify(response.data.user))
                            // localStorage.setItem('jwt',response.data.token)

                            console.log(response.data)

                            /*if (localStorage.getItem('jwt') != null){
                                this.$emit('loggedIn')
                                if(this.$route.params.nextUrl != null){
                                    this.$router.push(this.$route.params.nextUrl)
                                }
                                else {
                                    if(is_admin== 1){
                                        this.$router.push('admin')
                                    }
                                    else {
                                        this.$router.push('dashboard')
                                    }
                                }
                            }*/
                        })
                        .catch(function (error) {
                            console.error(error.response);
                        });
                }
            }
        }
    }
</script>