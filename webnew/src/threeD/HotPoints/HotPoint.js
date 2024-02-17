import * as THREE from 'three';
import TWEEN from "@tweenjs/tween.js";
import {serverAdress} from "@/config";
import {CSS2DRenderer, CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';

export class HotPoint {
    constructor(app) {
        this.app = app
        this.spriteList = []
    }

    add(po, text, _type, allData) {
        let scale = 0.01
        const scene = this.app.scene
        const map = new THREE.TextureLoader().load(`${serverAdress}/3Dstatic/热点.png`);

        const material = new THREE.SpriteMaterial({
            map: map
        });
        material.sizeAttenuation = false
        material.depthTest = false
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(scale, scale, scale);
        sprite.position.set(po[0], po[1], po[2]);
        sprite.allDataHot = allData

        const spriteTween = new TWEEN.Tween({scale: scale + 0.02}).to({
            scale: scale - 0.02
        }, 500).easing(TWEEN.Easing.Quadratic.Out);

        spriteTween.onUpdate(function (that) {
            sprite.scale.set(that.scale, that.scale, that.scale);
        });

        spriteTween.yoyo(true);
        spriteTween.repeat(Infinity);
        spriteTween.start();

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
        }

        animate();

        let group = new THREE.Group();

        group.add(sprite);

        group.allDataHot = allData
        // spritText.allDataHot = allData
        sprite.allDataHot = allData
        scene.add(group)
        this.spriteList.push(group)

    }

    addText(po, allData) {
        let canvas = document.createElement('canvas');
        canvas.width = 200
        canvas.height = 200;
        let context = canvas.getContext('2d');
        context.font = 'Bold 15px apple';
        context.fillStyle = 'white'
        context.fillText(allData.hotName, 0, 15);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({map: texture});
        material.sizeAttenuation = true
        material.depthTest = false
        let sprite = new THREE.Sprite(material);
        sprite.position.set(po[0] + 1.5, po[1] - 0.5, po[2]);
        sprite.scale.set(2, 2, 2);
        return sprite
    }

    clearAll() {
        this.spriteList.forEach(item => {
            this.app.scene.remove(item);
        })
    }


}
