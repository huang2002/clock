import { engine, renderer } from "./common.js";
import { COLS_PER_TILES, ROWS_PER_TILES, TILES, TILE_COLOR, TILE_SIZE } from "./tiles.js";
import { getTime } from "./getTime.js";
import { addParticle, ground } from "./particles.js";

export const mainScene = engine.createScene({
    background: '#FFF',
    collisionChecker: HE.Collision.Checker.AABB,
});

mainScene.add(ground);

const REPOSITORY_URL = 'https://github.com/huang2002/clock';

const getLinkPositionY = () => renderer.bounds.bottom - 15;

const link = new HE.Rectangle({
    interactive: true,
    position: HE.Vector.of(0, getLinkPositionY()),
    width: 120,
    height: 25,
    style: {
        strokeStyle: null,
    },
    attachments: [
        new HE.Text({
            content: 'huang2002/clock',
            style: {
                font: 'bold 10px Consolas',
                strokeStyle: null,
                fillStyle: '#0CF',
                shadowColor: '#CCC',
                shadowBlur: 2,
            },
        }),
    ],
}).on('click', () => {
    window.open(REPOSITORY_URL);
});

renderer.on('resize', () => {
    link.y = getLinkPositionY();
});

mainScene.attach(link);

const TILES_COUNT = 8,
    TILE_GAP = 2,
    TILES_GAP = 10,
    LEFT = -(TILE_SIZE * TILES_COUNT * COLS_PER_TILES + TILES_GAP * (TILES_COUNT - 1) +
        TILE_GAP * (COLS_PER_TILES - 1) * TILES_COUNT) / 2,
    TOP = -(TILE_SIZE * ROWS_PER_TILES + TILE_GAP * (ROWS_PER_TILES - 1)) / 2 - 20,
    WIDTH_PER_TILES = TILE_SIZE * COLS_PER_TILES + TILE_GAP * (COLS_PER_TILES - 1),
    HEIGHT_PER_TILES = TILE_SIZE * ROWS_PER_TILES + TILE_GAP * (ROWS_PER_TILES - 1);

/** @typedef {{ x: number; y: number; }} Position */

/** @type {Position[][][]} */
const TILE_POSITIONS = [];
let x = LEFT,
    y = TOP,
    /** @type {Position[][]} */
    rows,
    /** @type {Position[]} */
    cols;
for (let i = 0; i < TILES_COUNT; i++) {
    if (i) {
        x += TILES_GAP;
    }
    TILE_POSITIONS.push(rows = []);
    for (let j = 0; j < ROWS_PER_TILES; j++) {
        if (j) {
            y += TILE_GAP;
        }
        rows.push(cols = []);
        for (let k = 0; k < COLS_PER_TILES; k++) {
            if (k) {
                x += TILE_GAP;
            }
            cols.push({ x, y });
            x += TILE_SIZE;
        }
        x -= WIDTH_PER_TILES;
        y += TILE_SIZE;
    }
    x += WIDTH_PER_TILES;
    y -= HEIGHT_PER_TILES;
}

/** @type {(0 | 1)[][][]} */
let lastTilesMap;

/** @param {HE.Renderer} renderer */
mainScene.on('willRender', renderer => {
    const { context } = renderer;
    context.fillStyle = TILE_COLOR;
    const tilesMap = Array.from(getTime())
        .map(
            /** @returns {(0 | 1)[][]} */
            // @ts-ignore
            char => TILES.get(char)
        );
    tilesMap.forEach((tiles, i) => {
        tiles.forEach((row, j) => {
            row.forEach((tile, k) => {
                if (tile) {
                    const position = TILE_POSITIONS[i][j][k];
                    context.fillRect(position.x, position.y, TILE_SIZE, TILE_SIZE);
                }
            });
        });
    });
    if (lastTilesMap) {
        lastTilesMap.forEach((tiles, i) => {
            if (tiles !== tilesMap[i]) {
                tiles.forEach((row, j) => {
                    row.forEach((tile, k) => {
                        if (tile) {
                            addParticle(TILE_POSITIONS[i][j][k]);
                        }
                    });
                });
            }
        });
    }
    lastTilesMap = tilesMap;
});
