import * as PIXI from 'pixi.js';
//particles libarary for test 3
const particles = require('pixi-particles');
//load 274918 english words for test 2,
//more fun than random string from functions
//like Math.random().toString(36).substring(2, 8),
//can reduce performance though :P
const englishWords = require('an-array-of-english-words');


const settings = {
    width: window.innerWidth,
    height: innerHeight,
    backgroundColor: 0xffffff,
    roundPixels: true
};
const app = new PIXI.Application(settings);
document.body.appendChild(app.view);

app.loader
    .add('card', 'assets/card.png')
    //some random pictures from opengameart.org and others websites, 
    //public domain ot other free licenses
    .add('coin', 'assets/coin.png')
    .add('ball', 'assets/ball.png')
    .add('van', 'assets/van.png')
    .add('house', 'assets/house.png')
    //Fire particles
    .add('particle', 'assets/particle.png')
    .add('fire', 'assets/fire.png')
    .load((loader, resources) => {
        //FPS METER
        const FPSMeter: PIXI.Text = new PIXI.Text("");
        FPSMeter.anchor.set(1, 0);
        FPSMeter.position.set(settings.width - 20, 20);
        app.stage.addChild(FPSMeter);
        app.ticker.add((delta) => {
            FPSMeter.text = (60/delta).toFixed(0);
        });
        //SCENES
        const menu: PIXI.Container = new PIXI.Container();
        app.stage.addChild(menu);

        const testOne: PIXI.Container = new PIXI.Container();
        testOne.visible = false;
        app.stage.addChild(testOne);

        const testTwo: PIXI.Container = new PIXI.Container();
        testTwo.visible = false;
        app.stage.addChild(testTwo);

        const testThree: PIXI.Container = new PIXI.Container();
        testThree.visible = false;
        app.stage.addChild(testThree);
        //BACK TO MENU BUTTON
        const backButton: PIXI.Text = new PIXI.Text("Back to Menu");
        backButton.anchor.set(0, 1);
        backButton.position.set(20, settings.height - 20); 
        backButton.interactive = true;
        backButton.buttonMode = true;
        backButton.on("pointerdown", () => {
            switchScenes(menu);
        });
        backButton.visible = false;
        app.stage.addChild(backButton);
        //MENU SCENE
        const testOneButton: PIXI.Text = new PIXI.Text("Test One");
        testOneButton.anchor.set(0.5, 0.5);
        testOneButton.position.set(settings.width/2, 100);
        testOneButton.interactive = true;
        testOneButton.buttonMode = true;
        testOneButton.on("pointerdown", () => {
            switchScenes(testOne);
        });
        menu.addChild(testOneButton);

        const testTwoButton: PIXI.Text = new PIXI.Text("Test Two");
        testTwoButton.anchor.set(0.5, 0.5);
        testTwoButton.position.set(settings.width/2, 200);
        testTwoButton.interactive = true;
        testTwoButton.buttonMode = true;
        testTwoButton.on("pointerdown", () => {
            switchScenes(testTwo);
        });
        menu.addChild(testTwoButton);

        const testThreeButton: PIXI.Text = new PIXI.Text("Test Three");
        testThreeButton.anchor.set(0.5, 0.5);
        testThreeButton.position.set(settings.width/2, 300);     
        testThreeButton.interactive = true;
        testThreeButton.buttonMode = true;
        testThreeButton.on("pointerdown", () => {
            switchScenes(testThree);
        });
        menu.addChild(testThreeButton);
        //SCENE SWITCHER
        function switchScenes(targetScene: PIXI.Container): void {
            if (targetScene === menu){
                backButton.visible = false;
                testOne.visible = false;
                testTwo.visible = false;
                testThree.visible = false;
                menu.visible = true;
            } else {
                menu.visible = false;
                backButton.visible = true;
                targetScene.visible = true;
            }
        }
        //TEST 1
        //create start button
        const startButtonOne: PIXI.Text = new PIXI.Text("START");
        startButtonOne.anchor.set(0.5, 0.5);
        startButtonOne.position.set(settings.width/2, 30);
        startButtonOne.interactive = true;
        startButtonOne.buttonMode = true;
        startButtonOne.on("pointerdown", moveCards);
        testOne.addChild(startButtonOne);
        //Create deck
        const deck: PIXI.Container = new PIXI.Container();
        testOne.addChild(deck);
        const cards: PIXI.Sprite[] = [];
        let startX: number = 200;
        for (let i = 0; i < 144; i++){
            let card: PIXI.Sprite = new PIXI.Sprite(resources.card.texture);
            card.position.set(startX, 100);
            deck.addChild(card);
            cards[i] = card;
            startX += 5;
        }
        //Setup movement
        let targetX: number = 200;
        //pass starting timer in case of lag
        function moveCard(card: PIXI.Sprite, startingTimer: number): void {
            //Use control object to pass context, use timer and remove function from the ticker later
            let controlObject = {
                timer: startingTimer,
                func: animation,
                card: card,
                targetX: targetX,
                startingX: card.x
            }

            app.ticker.add(controlObject.func, controlObject);

            function animation(delta: number): void{
                this.timer += delta;
                //calculate card's new position
                this.card.x = this.startingX + (this.targetX - this.startingX)*(this.timer/120);
                this.card.y = 100 + 300*(this.timer/120);
                //1 sec == 60 frames in PIXI
                //Fix Z-order once, use undefined field because of performance
                if (this.timer > 60 && !this.zOrderChanged){
                    deck.removeChild(this.card);
                    deck.addChild(this.card);
                    this.zOrderChanged = true;
                } 
                if (this.timer > 120){
                    this.card.position.set(this.targetX, 400);
                    app.ticker.remove(this.func, this);
                } 
            }
        }
        function moveCards(): void{
            startButtonOne.visible = false;

            let controlObject = {
                timer: 0,
                func: animation,
                currentIndex: 143
            }

            app.ticker.add(controlObject.func, controlObject);

            function animation(delta: number): void{
                this.timer += delta;
                //calculate card's new position
                if (this.currentIndex >= 0){
                    if (this.timer > 60){
                        this.timer -= 60;
                        moveCard(cards[this.currentIndex], this.timer);
                        targetX += 5;
                        this.currentIndex--;
                    }
                } else {
                    app.ticker.remove(this.func, this);
                }
            }
        }

        //TEST 2
        //Array of images for test 2
        const images: PIXI.Texture[] = [
            resources.card.texture,
            resources.coin.texture,
            resources.ball.texture,
            resources.van.texture,
            resources.house.texture
        ];

        const startButtonTwo: PIXI.Text = new PIXI.Text("START");
        startButtonTwo.anchor.set(0.5, 0.5);
        startButtonTwo.position.set(settings.width/2, 30);
        startButtonTwo.interactive = true;
        startButtonTwo.buttonMode = true;
        startButtonTwo.on("pointerdown", startAnimaton);
        testTwo.addChild(startButtonTwo);

        const spritesContainer: PIXI.Container = new PIXI.Container();
        spritesContainer.position.set(settings.width/2, settings.height/2);
        testTwo.addChild(spritesContainer);

        function startAnimaton(): void {
            startButtonTwo.visible = false;

            let controlObject = {
                timer: 0,
                func: animation
            }
    
            app.ticker.add(controlObject.func, controlObject);
    
            function animation(delta: number): void{
                this.timer += delta;
                //calculate card's new position
                if (this.timer > 120){
                    this.timer = 0;
                    //remove elements from previous iteration starting from last
                    let lastIndex: number = spritesContainer.children.length - 1;
                    for (let i = lastIndex; i >= 0; i--){
                        spritesContainer.removeChildAt(i);
                    }
                    //generate new elements
                    let elementsWidth: number = 0; //cummulative width of all elements
                    for (let i = 0; i < 3; i++){
                        //union type
                        let element: PIXI.Text | PIXI.Sprite;
                        //choose between text and image, 
                        //Math.random() returns a value between 0 and 0.999999... ,
                        //so exact 50/50 are ranges [0, 0.5) and [0.5, 1)
                        if (Math.random() < 0.5){ //element is Text
                            //index of random word
                            let currentIndex: number = Math.floor(Math.random()*englishWords.length);
                            //random word
                            let elementString: string = englishWords[currentIndex];
                            element = new PIXI.Text(elementString);
                            //random font size, from 10 to 100
                            let fontSize: number = (Math.random()*90) + 10;
                            //Check type, just for TypeScript compiler
                            //could be omited and type of element set to any
                            //for the sake of simplicity for
                            //experienced developer and performance.
                            //Otherwise "Sprite" has no "style".
                            if (element instanceof PIXI.Text){
                                //change fontSize
                                element.style.fontSize = fontSize;
                            }
                        } else { //element is Sprite
                            //index of random image
                            let currentIndex: number = Math.floor(Math.random()*images.length);
                            element = new PIXI.Sprite(images[currentIndex]);
                        }
                        element.anchor.set(0, 0.5);
                        element.x = elementsWidth;
                        elementsWidth += element.width;
                        spritesContainer.addChild(element);
                    }
                    //center the container (PIXI.Container doesn't have "anchor" property :P)
                    spritesContainer.pivot.set(spritesContainer.width/2, spritesContainer.height/2);
                } 
                //clean itself if scene is closed
                if (!testTwo.visible) {
                    let lastIndex: number = spritesContainer.children.length - 1;
                    for (let i = lastIndex; i >= 0; i--){
                        spritesContainer.removeChildAt(i);
                    }
                    app.ticker.remove(this.func, this);
                }
            }
        }
        //TEST 3
        //Array of images for test 2
        const startButtonThree: PIXI.Text = new PIXI.Text("START");
        startButtonThree.anchor.set(0.5, 0.5);
        startButtonThree.position.set(settings.width/2, 30);
        startButtonThree.interactive = true;
        startButtonThree.buttonMode = true;
        startButtonThree.on("pointerdown", burn);
        testThree.addChild(startButtonThree);

        

        const particlesContainer: PIXI.Container = new PIXI.Container();
        particlesContainer.position.set(settings.width/2, settings.height/2);
        testThree.addChild(particlesContainer);

        var emitter = new particles.Emitter(

            // The PIXI.Container to put the emitter in
            particlesContainer,
          
            // The collection of particle images to use
            [resources.particle.texture, resources.fire.texture],
          
            // Emitter configuration
            {
                alpha: {
                  start: 0.62,
                  end: 0
                },
                scale: {
                  start: 0.25,
                  end: 0.75,
                  minimumScaleMultiplier: 1
                },
                color: {
                  start: '#fff191',
                  end: '#ff622c'
                },
                speed: {
                  start: 50,
                  end: 150,
                  minimumSpeedMultiplier: 1
                },
                acceleration: {
                  x: 0,
                  y: 0
                },
                maxSpeed: 0,
                startRotation: {
                  min: 255,
                  max: 280
                },
                noRotation: false,
                rotationSpeed: {
                  min: 50,
                  max: 50
                },
                lifetime: {
                  min: 0.1,
                  max: 0.75
                },
                blendMode: 'normal',
                frequency: 0.001,
                emitterLifetime: -1,
                maxParticles: 1000,
                pos: {
                  x: 0,
                  y: 0
                },
                addAtBack: false,
                spawnType: 'circle',
                spawnCircle: {
                  x: 0,
                  y: 0,
                  r: 10
                }
            }
        );

        function burn(): void {
            startButtonThree.visible = false;

            let controlObject = {
                timer: 0,
                func: animation
            };

            // Start emitting
            emitter.emit = true;
    
            app.ticker.add(controlObject.func, controlObject);
    
            function animation(delta: number): void{
                this.timer += delta;
                //calculate card's new position
                emitter.update(delta/60);
                //clean itself if scene is closed
                if (!testThree.visible) {
                    app.ticker.remove(this.func, this);
                    // stop emitting
                    emitter.emit = false;
                }
            }
        }
    });