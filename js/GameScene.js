class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    };

    // download background
    preload () {
        this.load. image('bg', '/assets/sprites/background.png');
        this.load. image('card', '/assets/sprites/card.png');
    };

    // render background
    create () {
        this.createBackground();
        this.createCards();
    };

    createBackground () {
        // this.add.sprite(config.width / 2, config.height / 2, 'bg');
        // this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg');
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    };

    createCards () {
        this.cards = [];
        let positions = this.getCardPositions();

        for(let position of positions){
            this.cards.push(new Card(this, position));
        }
    };

    getCardPositions () {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 4;
        let cardHeight = cardTexture.height + 4;

        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2;

        for(let row = 0; row <config.rows; row ++){
            for( let col = 0; col < config.cols; col++){
                positions.push({ 
                    x: offsetX + col * cardWidth,
                    y: offsetY +  row * cardHeight
                });
            }
        }
        return positions;
    };

}

