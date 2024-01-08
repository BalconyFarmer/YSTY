import * as THREE from "three";
import {serverAdress} from "../../config";

export class PlayVideo {
    constructor(app) {
        this.app = app
        this.meshList = []

    }

    mamkeVideoMesh(data) {
        let video = document.createElement('video');
        video.src = data.src; // 设置视频地址
        video.crossOrigin = '*'
        video.autoplay = "autoplay"; //要设置播放
        const texture = new THREE.VideoTexture(video)
        const geometry = new THREE.PlaneGeometry(2, 1); //矩形平面
        const material = new THREE.MeshPhongMaterial({
            map: texture,
        });
        const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        mesh.position.x = data.position[0]
        mesh.position.y = data.position[1]
        mesh.position.z = data.position[2]
        this.app.scene.add(mesh); //网格模型添加到场景中
        this.meshList.push(mesh)
    }


    addPictureMesh(data) {
        const scene = this.app.scene
        const camera = this.app.camera

        // 创建平面几何体
        const geometry = new THREE.PlaneGeometry(4, 3);

        // 创建网格基础材质
        const material = new THREE.MeshBasicMaterial();

        // 加载图片作为纹理贴图
        const loader = new THREE.TextureLoader();
        loader.load(data.src, function (texture) {
            material.map = texture;
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            mesh.position.x = data.position[0]
            mesh.position.y = data.position[1]
            mesh.position.z = data.position[2]
        });
    }

    addSound(data) {
        let audio = document.createElement('audio');
        audio.src = data.src;
        audio.autoplay = true;
        document.body.appendChild(audio);
        this.audio = audio
    }

    clear() {
        if (this.meshList.length) {
            this.meshList.forEach(item => {
                this.app.scene.remove(item);
            })
        }

        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            document.body.removeChild(this.audio);
            this.audio = null
        }
    }

}
