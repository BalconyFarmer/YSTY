import * as THREE from 'three';
import TWEEN from "@tweenjs/tween.js";

export class HotPoint {
    constructor(app) {
        this.app = app
        this.spriteList = []
        // this.add()
    }


    add(po, text, _type) {
        po[1] = po[1] + 0.1
        const self = this
        const scene = this.app.scene
        const camera = this.app.camera
        const renderer = this.app.renderer

        const map = new THREE.TextureLoader().load("http://47.108.186.214:8082/Files/热点.png");
        const material = new THREE.SpriteMaterial({
            map: map
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.8, 0.8, 0.8);
        sprite.position.set(po[0], po[1], po[2]);
        scene.add(sprite);
        this.spriteList.push(sprite)
        const spriteTween = new TWEEN.Tween({scale: 0.2}).to({
            scale: 0.13
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
            renderer.render(scene, camera);
        }

        animate();

        this.addText(po, text, _type)
    }

    addText(po, text, type) {
        let canvas = document.createElement('canvas');
        canvas.style.height = '20px'
        let context = canvas.getContext('2d');
        context.font = 'Bold 15px apple';
        context.fillStyle = 'white'
        context.fillText(text, 0, 10);
        context.fillText(type, 0, 20);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({map: texture});
        let sprite = new THREE.Sprite(material);
        sprite.position.set(po[0], po[1], po[2]);
        sprite.scale.set(0.8, 0.8, 0.8);
        this.spriteList.push(sprite)
        this.app.scene.add(sprite);
    }

    clearAll() {
        this.spriteList.forEach(item => {
            this.app.scene.remove(item);
        })
    }
}
