import { engine } from "/__src__/common.js";

engine.inspector = new HE.Inspector({
    // boundsStroke: '#0F0',
});

engine.inspector.paragraph.position.set(-240, -90);
engine.inspector.paragraph.style.font = 'bold 8px Consolas';
engine.inspector.paragraph.style.fillStyle = '#0F0';
engine.inspector.paragraph.lineHeight = 10;
