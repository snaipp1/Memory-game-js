class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    };

    // download background
    preload () {
        this.load.image('bg', 'assets/sprites/background.png');
        this.load.image('card', 'assets/sprites/card.png');
        this.load.image('card1', 'assets/sprites/card1.png');
        this.load.image('card2', 'assets/sprites/card2.png');
        this.load.image('card3', 'assets/sprites/card3.png');
        this.load.image('card4', 'assets/sprites/card4.png');
        this.load.image('card5', 'assets/sprites/card5.png');

        this.load.audio('card', 'assets/sounds/card.mp3');
        this.load.audio('theme', 'assets/sounds/theme.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');
        this.load.audio('timeout', 'assets/sounds/timeout.mp3');
        this.load.audio('complete', 'assets/sounds/complete.mp3');
    };

    createText () {
        this.timeoutText = this.add.text(10, 330, "", {
            font: '36px CurseCasual',
            fill: '#ffffff'
        })
    };

    onTimerTick () {
       if(this.timeout <= 0){
        this.timer.paused = true;
        this.sounds.timeout.play();
        this.restart();        
       } else {
        this.timeoutText.setText(`Time: ${--this.timeout}`);
       } 
    }

    createTimer () {
         this.timer = this.time.addEvent({
             delay: 1000,
             callback: this.onTimerTick,
             callbackScope: this,
             loop: true
         });
    }

    createSounds () {
        this.sounds = {
            card: this.sound.add('card'),
            theme: this.sound.add('theme'),
            success: this.sound.add('success'),
            timeout: this.sound.add('timeout'),
            complete: this.sound.add('complete')
        };
        this.sounds.theme.play({volume: 0.1});
    }

    // render background
    create () {
        this.timeout = config.timeout;
        this.createSounds();
        this.createTimer();
        this.createBackground();
        this.createText();
        this.createCards();
        this.start();   
    };

    start () {
        this.timeout = config.timeout;
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.timer.paused = false;
        this.initCardPositions();
        this.initCards();
        this.showCards();
    };

    restart () {
        let count = 0;
        let onCardMoveComplete = () => {
            count += 1;
            if (count >= this.cards.length) {
                this.start();
            }
        };

        this.cards.forEach(card => {
            card.move({
                x: this.sys.game.config.width + card.width,
                y: this.sys.game.config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            });
        });
    };

    initCards () {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);

        this.cards.forEach(card => {
            card.init(positions.pop());
        });
    };

    showCards () {
        this.cards.forEach(card => {
            card.depth = card.position.delay;
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            });
        });
    };

    createBackground () {
        // this.add.sprite(config.width / 2, config.height / 2, 'bg');
        // this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg');
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    };

    createCards () {
        this.cards = [];

        for(let value of config.cards){
            for (let i = 0; i < 2; i += 1) {
                this.cards.push(new Card(this, value));
            } 
        }

        this.input.on("gameobjectdown", this.onCardClicked, this);
    };

    onCardClicked (pointer, card) {
        
        if(card.opened) return false;
        this.sounds.card.play();

        if(this.openedCard) {
            if( this.openedCard.value === card.value) {
                this.sounds.success.play();

                this.openedCard = null;
                this.openedCardsCount += 1;
            } else {
                this.openedCard.close();
                this.openedCard = card;
            }
        } else {
            this.openedCard = card;
        }

        card.open(() => {
            if(this.openedCardsCount === this.cards.length / 2) {
                this.sounds.complete.play();
                this. restart();
            }
        });
    }

    initCardPositions () {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 4;
        let cardHeight = cardTexture.height + 4;

        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

        let id = 0;

        for(let row = 0; row <config.rows; row ++){
            for( let col = 0; col < config.cols; col++){
                positions.push({ 
                    x: offsetX + col * cardWidth,
                    y: offsetY +  row * cardHeight,
                    delay: id += 1 * 100
                });
                
            }
        }
        this.positions = positions;
    };

}

