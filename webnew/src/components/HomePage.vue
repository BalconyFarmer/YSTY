<template>
    <div class="hello">
        <div class="homeHeader row1">
            <div class="name">
                3D编辑器
            </div>
            &nbsp;
            &nbsp;
            <div class="row1">
                <div style="width: 400px" v-if="scheduleData">
                    <el-progress :percentage="scheduleData"></el-progress>
                </div>
                <div v-if="scheduleData" @click="scheduleData = 0" class="finger">
                    清除
                </div>
            </div>

            <div class="quitButton">
                <el-button size="mini" type="primary" @click="quit">退出</el-button>
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
        quit() {
            location.reload();
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

<style lang="scss" scoped>
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

        .quitButton {
            position: absolute;
            right: 20px;
        }
    }
}

</style>
