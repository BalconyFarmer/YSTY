import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import ExperimentArea from "../components/ExperimentArea/ExperimentArea";

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage,
            children: [
                {path: 'experimentArea', component: ExperimentArea, children: []},
            ]
        }
    ],
    // mode: "history", // hash
    // base: process.env.NODE_ENV === "development" ? "/test" : "/YSTY",
})

export default router
