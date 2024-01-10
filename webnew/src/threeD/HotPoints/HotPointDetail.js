import * as THREE from "three";
import {serverAdress} from "@/config";

export class HotPointDetail {
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
        let scale = 0.1
        const map = new THREE.TextureLoader().load(data.src);
        const material = new THREE.SpriteMaterial({
            map: map
        });
        material.sizeAttenuation = false
        material.depthTest = false
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(scale, scale, scale);
        sprite.position.set(data.position[0], data.position[0], data.position[0]);
        scene.add(sprite)
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
