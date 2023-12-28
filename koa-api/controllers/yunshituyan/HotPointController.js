const {initSequelize, sessionApp} = require("../../app");

const HotPointController = {


    getHotById: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.hotPointModel.getHotById(postData)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    }

}


module.exports = {
    HotPointController
};
