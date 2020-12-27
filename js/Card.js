class Card extends Phaser.GameObjects.Sprite {
    constructor (scene, value) {
        super(scene, 0, 0, 'card');
        this.scene = scene;
        this.value = value;
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.setInteractive();
        this.opened = false;
        // this.on('pointerdown', this.open, this); 
    }



    flip (texture) {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: 'Linear',
            duration: 150,
            onComplete:  () => this.show(texture)
        });
    }

    show (texture) {
        this.setTexture(texture)
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: 'Linear',
            duration: 150
        });
    }

    open () {
        this.opened = true;
        this.flip(`card${this.value}`);
    }

    close () {
        this.opened =false;
        this.flip(`card`);
    }
    
}