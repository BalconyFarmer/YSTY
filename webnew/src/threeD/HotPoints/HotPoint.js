import * as THREE from 'three';
import TWEEN from "@tweenjs/tween.js";
import {serverAdress} from "@/config";

export class HotPoint {
    constructor(app) {
        this.app = app
        this.spriteList = []
        // this.test()
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

        let spritText = this.addText(po, text, _type, allData)
        group.add(spritText);
        group.allDataHot = allData
        scene.add(group)

    }

    addText(po, text, type, allData) {
        let canvas = document.createElement('canvas');
        canvas.width = 200
        canvas.height = 200;
        let context = canvas.getContext('2d');
        context.font = 'Bold 15px apple';
        context.fillStyle = 'white'
        context.fillText(text, 0, 15);
        context.fillText(type, 0, 45);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({map: texture});
        material.sizeAttenuation = false
        material.depthTest = false
        let sprite = new THREE.Sprite(material);
        sprite.position.set(po[0], po[1] - 0.2, po[2] - 0.1);
        sprite.scale.set(0.1, 0.1, 0.1);
        return sprite
    }

    clearAll() {
        this.spriteList.forEach(item => {
            this.app.scene.remove(item);
        })
    }

    test() {
        let canvas = window.app3D.app2D.canvasDom

        const self = this

        setTimeout(function () {
            window.app3D.app2D.addText()
            let texture = new THREE.Texture(canvas);
            let material = new THREE.SpriteMaterial({map: texture});
            material.sizeAttenuation = false
            material.map.needsUpdate = true;
            let sprite = new THREE.Sprite(material);
            sprite.position.set(0, 0, 0);
            sprite.scale.set(1, 1, 1);
            self.app.scene.add(sprite)

            setTimeout(function () {
                window.app3D.app2D.addRect()
                // texture.needsUpdate = true;
            }, 2000)

            setInterval(function () {
                texture.needsUpdate = true;
            }, 1000)
        }, 2000)


    }

}
