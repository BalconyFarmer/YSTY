import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
export class ImportObjs {
    constructor(app) {
        this.app = app
    }

    loadOBJ(url) {
        let scene = this.app.scene
        return new Promise((resolve, reject) => {
            // 创建一个 OBJLoader 实例
            let loader = new OBJLoader();

            // 加载模型
            loader.load(
                // 模型的 URL
                url,
                // 当模型加载完成时的回调函数
                function (object) {
                    // 将模型添加到场景中
                    scene.add(object);
                    resolve(object);
                },
                window.app3D.progress,
            );
        });
    }


}

