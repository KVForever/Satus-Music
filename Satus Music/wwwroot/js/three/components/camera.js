import { PerspectiveCamera } from '../../../lib/three/build/three.module.js';

function createCamera(container) {
    const camera = new PerspectiveCamera(35, container.clientWidth / container.clientHeight, 2, 100);
  
    camera.position.set(0, 0, 10);
  
    return camera;
}

export { createCamera };