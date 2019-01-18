<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card card-default">
                    <div class="card-body text-center">
                        <h2>DATA for test</h2>
                        <p>Metamask: {{ web3.isInjected }}</p>
                        <p>Network: {{ web3.networkId }}</p>
                        <p>Account: {{ web3.coinbase }}</p>
                        <p>Balance: {{ web3.balance }}</p>
                        <img src="../ethereum.jpg" alt="ethereum" style="max-height: 120px"><br>
                        <p style="color: lightgrey">на цій кнопці просто звернення до сервера для перевірки що запрос пішов із уже отриманим токеном після підпису. Check network in Inspect</p>
                        <button class="btn btn-primary" @click="checkServer">REQUEST with token!</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import  axios  from 'axios'

    export default {
        name: 'home',
        computed: {
            currentUser() {
                return this.$store.getters.currentUser
            },
            web3 () {
                return this.$store.state.web3
            },
        },
        methods: {
            checkServer(){
                axios.post('http://localhost:3000/api/check-server')
                    .then((response) => {
                        alert("Check headers in network in inspect");
                        console.log(response.data)
                    })
                    .catch((err) => {
                        console.log('Something wrong with token...');
                    })
            }
        }
    }
</script>