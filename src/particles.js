import { TILE_SIZE } from "./tiles.js";
import { mainScene } from "./mainScene.js";
import { renderer } from "./common.js";

const GROUND_HEIGHT = 100,
    PARTICLE_LIFE = 4000,
    GRAVITY = HE.Vector.of(0, 1.6),
    PARTICLE_COLORS = ['#F00', '#F90', '#FF0', '#9F0', '#0F0',
        '#090', '#09F', '#00F', '#90F', '#F0F', '#F09'];

const groundPosition = renderer.createUIVector(
    renderer => ({ x: 0, y: renderer.bounds.bottom + GROUND_HEIGHT / 2 })
);

export const ground = new HE.Rectangle({
    tag: 'ground',
    visible: false,
    position: groundPosition.clone(),
    width: renderer.width,
    height: GROUND_HEIGHT,
});

ground.on('willUpdate', () => {
    ground.moveToVector(groundPosition);
});

const particlePool = new HE.Pool(HE.Rectangle, {
    active: true,
    tag: 'particle',
    collisionFilter: ground.category,
    width: TILE_SIZE,
    height: TILE_SIZE,
    gravity: GRAVITY,
    style: {
        strokeStyle: null,
    },
});

particlePool.size = 50;

/** @param {import("./mainScene.js").Position} position */
export const addParticle = position => {
    const particle = particlePool.get(),
        deadline = Date.now() + PARTICLE_LIFE;
    particle.moveToVector(position);
    particle.velocity.setVector(HE.Vector.random().scale(2, 1));
    particle.style.fillStyle = HE.Utils.pick(PARTICLE_COLORS);
    const didUpdate = () => {
        if (Date.now() >= deadline) {
            particle.off('didUpdate', didUpdate);
            particlePool.add(particle);
            mainScene.remove(particle);
        }
    };
    particle.on('didUpdate', didUpdate);
    mainScene.add(particle);
};
