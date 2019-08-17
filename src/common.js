export const renderer = new HE.Renderer({
    width: 500,
    height: 200,
    sizing: HE.Sizing.Fixed,
});

export const engine = new HE.Engine({
    renderer,
});
