import { DirectionalLight } from 'three';

function createLights() {

    const light = new DirectionalLight('red', 8);

    light.position.set(10, 10, 10);

    return light;
}

export { createLights };