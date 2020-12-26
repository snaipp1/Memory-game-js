const config = {
    type: Phaser.AUTO ,// use webGL if can it
    width: 1280,
    height: 720,
    rows: 2,
    cols: 5,
    scene: new GameScene()
};


let game = new Phaser.Game(config);