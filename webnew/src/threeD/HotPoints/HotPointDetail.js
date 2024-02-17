import * as THREE from "three";
import {App2D} from "@/threeD/HotPoints/App2D";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class HotPointDetail {
    constructor(app) {
        this.app = app
        // this.addCanvas2D()
        this.allDetail = []
    }

    mamkeVideoMesh(data) {
        const originPositon = data.position
        const offsetValue = 1

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

        const geometry = new THREE.PlaneGeometry(2, 1); //矩形平面
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

        data.offsetPositon = offsetPositon
        let text = this.addTextCss(data)

        group.add(line)
        group.add(mesh)
        group.add(text)

        this.app.scene.add(group); //网格模型添加到场景中
        const self = this
        mesh.clickFun = function () {
            self.clear()
        }
        this.allDetail.push(group)
    }

    addPictureMesh(data) {
        const originPositon = data.position
        const offsetValue = 1

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
        data.offsetPositon = offsetPositon
        let text = this.addTextCss(data)
        group.add(text)
        group.add(sprite)
        group.add(line)
        scene.add(group)
        const self = this
        sprite.clickFun = function () {
            self.clear()
        }
        this.allDetail.push(group)

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
        this.allDetail.push(line)
        return line
    }

    addSound(data) {
        let audio = document.createElement('audio');
        audio.src = data.src;
        audio.autoplay = true;
        document.body.appendChild(audio);
        this.audio = audio
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
        material.depthTest = false
        let sprite = new THREE.Sprite(material);
        sprite.position.set(offsetPositon[0], offsetPositon[1], offsetPositon[2]);
        sprite.scale.set(0.2, 0.1, 0);

        let group = new THREE.Group();
        let line = this.addLine(originPositon, offsetPositon)
        group.add(line)
        group.add(sprite)
        this.app.scene.add(group)
        let scene = this.app.scene
        const self = this
        sprite.clickFun = function () {
            self.clear();
        }
        this.allDetail.push(group)

    }

    addTextCss(allData) {
        const text = document.createElement('div');
        text.id = 'myUniqueID';
        const text1 = document.createElement('div');
        text1.className = 'label';
        text1.textContent = "名称:"+allData.hotName;
        text1.style.color = "white";
        text.appendChild(text1)

        const text2 = document.createElement('div');
        text2.className = 'label';
        text2.textContent = "详情:"+allData.hotDescription;
        text2.style.color = "white";
        text.appendChild(text2)

        const label = new CSS2DObject(text);
        label.position.set(allData.offsetPositon[0], allData.offsetPositon[1]-1, allData.offsetPositon[2]);
        return label
    }


    clear() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            document.body.removeChild(this.audio);
            this.audio = null
        }
        this.allDetail.forEach(item => {
            window.app3D.scene.remove(item);
        })

        let element = document.getElementById('myUniqueID');
        if (element) {
            element.parentNode.removeChild(element);
        }

    }
}
