import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader.js";

export class ImportFBX {
    constructor(app) {
        this.app = app
        // obj作为参数创建一个混合器，解析播放obj及其子对象包含的动画数据
        this.mixer = null
        this.url = null
    }

    _loadFBX(url, position, scale) {
        const self = this;
        this.url = url;
        let loader = new FBXLoader(); // 创建一个FBX加载器

        return new Promise((resolve, reject) => {
            if (this.url) {
                loader.load(this.url, function (obj) {
                    self.app.scene.add(obj);
                    if (position) {
                        obj.position.set(position.x, position.y, position.z);
                    }
                    if (scale) {
                        obj.scale.set(scale.x, scale.y, scale.z);
                    }
                    resolve(obj); // 加载成功，返回加载的对象
                }, this.app.progress, function (error) {
                    reject(error); // 加载失败，返回错误信息
                });
            } else {
                reject(new Error('URL is not defined')); // URL 未定义，返回错误信息
            }
        });
    }

}
