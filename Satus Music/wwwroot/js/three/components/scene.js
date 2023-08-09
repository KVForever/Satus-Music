import { Color, Scene } from '../../../lib/three/build/three.module.js';

function createScene() {
    const scene = new Scene();

    scene.background = new Color('black');

    scene.tick = () => {
        scene.rotateY(.01);
    }

    return scene;

}

export { createScene }