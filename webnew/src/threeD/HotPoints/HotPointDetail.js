import * as THREE from "three";
import {App2D} from "@/threeD/HotPoints/App2D";

export class HotPointDetail {
    constructor(app) {
        this.app = app
        // this.addCanvas2D()
    }

    mamkeVideoMesh(data) {
        const originPositon = data.position
        const offsetValue = 0.4

        const offsetPositon = [
            data.position[0] + offsetValue,
            data.position[1] + offsetValue,
            data.position[2] + offsetValue
        ]

        let video = document.createElement('video');
        video.src = data.src; // 设置视频地址
        video.crossOrigin = '*'
        video.autoplay = "autoplay"; //要设置播放
        const texture = new THREE.VideoTexture(video)

        const geometry = new THREE.PlaneGeometry(0.2, 0.1); //矩形平面
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        mesh.position.x = offsetPositon[0]
        mesh.position.y = offsetPositon[1]
        mesh.position.z = offsetPositon[2]
        let group = new THREE.Group();
        let line = this.addLine(originPositon, offsetPositon)
        group.add(line)
        group.add(mesh)
        this.app.scene.add(group); //网格模型添加到场景中
        mesh.clickFun = function () {
            window.app3D.scene.remove(group);
        }

    }


    addPictureMesh(data) {
        const originPositon = data.position
        const offsetValue = 0.4

        const offsetPositon = [
            data.position[0] + offsetValue,
            data.position[1] + offsetValue,
            data.position[2] + offsetValue
        ]

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
        sprite.position.set(offsetPositon[0], offsetPositon[1], offsetPositon[2]);

        let group = new THREE.Group();
        let line = this.addLine(originPositon, offsetPositon)
        group.add(sprite)
        group.add(line)
        scene.add(group)
        group.clickFun = function () {
            scene.remove(group);
        }
        sprite.clickFun = function () {
            scene.remove(group);
        }
        sprite.clickFun = function () {
            scene.remove(group);
        }
    }

    addLine(point1, point2) {
        let geometry = new THREE.BufferGeometry();
        let vertices = new Float32Array([
            point1[0], point1[1], point1[2],
            point2[0], point2[1], point2[2]
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        let material = new THREE.LineBasicMaterial({color: 0xE0EFF0});
        let line = new THREE.Line(geometry, material);
        return line
    }

    addSound(data) {
        let audio = document.createElement('audio');
        audio.src = data.src;
        audio.autoplay = true;
        document.body.appendChild(audio);
        this.audio = audio
    }


    clear() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            document.body.removeChild(this.audio);
            this.audio = null
        }
    }

    addCanvas2D(data) {
        const originPositon = data.position
        const offsetValue = 0.4

        const offsetPositon = [
            data.position[0] + offsetValue,
            data.position[1] + offsetValue,
            data.position[2] + offsetValue
        ]

        let app2D = new App2D()
        let canvas = app2D.addText(data)
        let texture = new THREE.Texture(canvas);
        let material = new THREE.SpriteMaterial({map: texture});
        material.sizeAttenuation = false
        material.map.needsUpdate = true;
        let sprite = new THREE.Sprite(material);
        sprite.position.set(offsetPositon[0], offsetPositon[1], offsetPositon[2]);
        sprite.scale.set(0.2, 0.2, 0.2);

        let group = new THREE.Group();
        let line = this.addLine(originPositon, offsetPositon)
        group.add(line)
        group.add(sprite)
        this.app.scene.add(group)
        let scene = this.app.scene
        sprite.clickFun = function () {
            scene.remove(group);
        }
    }

}
