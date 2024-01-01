<template>
    <div class="hello">
        <div class="homeHeader row1">
            <div class="name">
                3D编辑器
            </div>

            <div class="row1">
                <div>{{ scheduleData }}</div>
                <div v-if="scheduleData" @click="scheduleData = null">
                    -- 点击清除
                </div>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
import $hub from 'hub-js';

export default {
    name: 'HomePage',
    components: {},
    data() {
        return {
            userInf: this.$store.state.userInf,
            userIconBS64: null,
            showUserDetailFlag: false,
            keepUserDetailFlag: false,
            current: ['mail'],
            scheduleData: null
        }
    },
    computed: {},
    methods: {
        goExperimentArea() {
            this.$router.push({path: '/experimentArea'}).catch(error => error)
        },
    },
    mounted() {
        const self = this
        setTimeout(function () {
            self.goExperimentArea()
        }, 100)
        $hub.on("loadSchedule", (data) => {
            this.scheduleData = data
        })
    }
}
</script>

<style lang="less" scoped>
.hello {

    width: 100%;
    height: 100%;

    .homeHeader {
        background-color: rgba(32, 34, 38, 0.9);
        width: 100%;
        height: 45px;
        color: white;
        position: absolute;
        left: 0;
        top: 0;

        .name {
            margin-left: 20px;
        }
    }
}

</style>
