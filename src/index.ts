//for questions and suggestions you can contact me:
// dmitry.menshaev@gmail.com
import * as PIXI from 'pixi.js';
//Importing PIXI in global scope with PIXI is OK.
//For this simpile project pollutting global scope is OK too,
//but for large or giant AAA projects it's usually a bad idea to 
//pollute the global scope, so different methods can be used:
//IIFE (classic style), namespaces (just JS objects), typescript namespaces, or ES6 block scopes.
//For bigger project namespace should be used with object "app" (PIXI.Application) 
//and other variables that should be in the same scope
(function dontPolluteTheGlobalScope(): void{
    //particles libarary for test 3
    const particles = require('pixi-particles');
    //load 274918 english words for test 2,
    //more fun than random string from functions
    //like Math.random().toString(36).substring(2, 8),
    //can reduce performance though :(
    //Also excuce me if unacceptable words are shown.
    const englishWords: string[] = require('an-array-of-english-words');

    //Interface to create dynamic objects.
    //Interfaces for every object to save
    //from typos and Development Environment support
    //on property types are possible, but I will
    //keep everything simple for now.
    interface LooseObject {
        [key: string]: any
    }
    // trying not to pollute global scope,
    // and also get acess to local scopes and etc.
    const controlObject: LooseObject = {};

    const settings = {
        width: 1080, //"Instagram" aspect ratio, just square. Works best for
        height: 1080, //Desktop + mobile (portrait + landscape) kind of responsive elements
        backgroundColor: 0xffffff,
        //"roundPixels: true"  gives so much performance (probably x2) and cons are almost not noticable,
        // but I won't use it for now
    };
    const app = new PIXI.Application(settings);
    document.body.appendChild(app.view);

    app.loader
        //could be imported as atlas also, but it is simpiler to edit/remove/add everything
        //one by one while developing
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
            //Seperation of concerens: creating objects to control respective scenes.
            //everything is accessible, but no pollution of scope
            //All methods and variables will be inside.
            //main container, needed for game to be responsive
            const main: LooseObject = {
                scene: new PIXI.Container(),
                //track the current scene in main game container
                currentScene: "menu"
            };
            app.stage.addChild(main.scene);

            //Container for buttons that tied to screen
            const UI: LooseObject = {
                scene: new PIXI.Container()
            };
            app.stage.addChild(UI.scene);

            const menu: LooseObject = {
                scene: new PIXI.Container(),
                //help us identify scene
                name: "menu"
            };
            main.scene.addChild(menu.scene);

            const testOne: LooseObject = {
                scene: new PIXI.Container(),
                name: "testOne"
            };
            testOne.scene.visible = false;
            main.scene.addChild(testOne.scene);
        
            const testTwo: LooseObject = {
                scene: new PIXI.Container(),
                name: "testTwo"
            };
            testTwo.scene.visible = false;
            main.scene.addChild(testTwo.scene);

            const testThree: LooseObject = {
                scene: new PIXI.Container(),
                name: "testThree"
            };
            testThree.scene.visible = false;
            main.scene.addChild(testThree.scene);

            //BACK TO MENU BUTTON
            //Local variable could be create to hold "PIXI.Text" object and then
            //added to "UI" object to make names simplier, but for small files it
            //is probably more understandable this way, also most of the paramaters 
            //are well known PIXI objects/methods/parameters.
            UI.backButton = new PIXI.Text("Back to Menu");
            UI.backButton.anchor.set(0, 1);
            UI.backButton.position.set(20, settings.height - 20); 
            UI.backButton.interactive = true;
            UI.backButton.buttonMode = true;
            UI.backButton.on("pointerdown", () => {
                switchScenes(menu);
            });
            UI.backButton.visible = false;
            UI.scene.addChild(UI.backButton);
            //FPS METER
            UI.FPSMeter = new PIXI.Text("");
            UI.FPSMeter.anchor.set(1, 0);
            UI.FPSMeter.position.set(settings.width - 20, 20);
            UI.scene.addChild(UI.FPSMeter);
            app.ticker.add((delta) => {
                UI.FPSMeter.text = (60/delta).toFixed(0);
            });
            //MENU SCENE
            menu.testOneButton = new PIXI.Text("Test One");
            menu.testOneButton.style.fontSize = 72;
            menu.testOneButton.anchor.set(0.5, 0.5);
            menu.testOneButton.position.set(540, 270);
            menu.testOneButton.interactive = true;
            menu.testOneButton.buttonMode = true;
            menu.testOneButton.on("pointerdown", () => {
                switchScenes(testOne);
            });
            menu.scene.addChild(menu.testOneButton);

            menu.testTwoButton = new PIXI.Text("Test Two");
            menu.testTwoButton.style.fontSize = 72;
            menu.testTwoButton.anchor.set(0.5, 0.5);
            menu.testTwoButton.position.set(540, 540);
            menu.testTwoButton.interactive = true;
            menu.testTwoButton.buttonMode = true;
            menu.testTwoButton.on("pointerdown", () => {
                switchScenes(testTwo);
            });
            menu.scene.addChild(menu.testTwoButton);

            menu.testThreeButton = new PIXI.Text("Test Three");
            menu.testThreeButton.style.fontSize = 72;
            menu.testThreeButton.anchor.set(0.5, 0.5);
            menu.testThreeButton.position.set(540, 810);     
            menu.testThreeButton.interactive = true;
            menu.testThreeButton.buttonMode = true;
            menu.testThreeButton.on("pointerdown", () => {
                switchScenes(testThree);
            });
            menu.scene.addChild(menu.testThreeButton);
            //SCENE SWITCHER
            function switchScenes(targetScene: LooseObject): void {
                if (targetScene.name === "menu"){
                    //clean test one after completion. Could be done with callbacks,
                    //but because we know exactly which scene we are dealing with it is OK
                    if (main.currentScene === "testOne"){
                        testOne.scene.visible = false;
                        if (testOne.numberOfCardsMoving === 0){
                            testOne.clear();
                        }
                    } else {
                        testTwo.scene.visible = false;
                        testThree.scene.visible = false;
                    }
                    UI.backButton.visible = false;
                    menu.scene.visible = true;
                } else {
                    menu.scene.visible = false;
                    UI.backButton.visible = true;
                    targetScene.scene.visible = true;
                }
                main.currentScene = targetScene.name;
            }
            //TEST 1
            //create start button
            testOne.startButton = new PIXI.Text("START"); //use default style
            testOne.startButton.style.fontSize = 72;
            testOne.startButton.anchor.set(0.5, 0.5);
            testOne.startButton.position.set(540, 108);
            testOne.startButton.interactive = true;
            testOne.startButton.buttonMode = true;
            testOne.scene.addChild(testOne.startButton);
            //Create deck
            testOne.deck = new PIXI.Container();
            testOne.scene.addChild(testOne.deck);
            testOne.cards = [];
            testOne.startX = 100;
            for (let i = 0; i < 144; i++){
                let card: PIXI.Sprite = new PIXI.Sprite(resources.card.texture);
                card.position.set(testOne.startX, 300);
                testOne.deck.addChild(card);
                testOne.cards[i] = card;
                testOne.startX += 5;
            }
            testOne.numberOfCardsMoving = 0;
            //Setup movement
            testOne.targetX = 100;
            //pass starting timer in case of lag
            testOne.moveCard = function(card: PIXI.Sprite, startingTimer: number): void {
                //Use control object to pass context, use timer and remove function from the ticker later
                let controlObject = {
                    timer: startingTimer,
                    func: animation,
                    card: card,
                    targetX: testOne.targetX,
                    startingX: card.x
                }

                app.ticker.add(controlObject.func, controlObject);

                function animation(delta: number): void{
                    this.timer += delta;
                    //calculate card's new position
                    this.card.x = this.startingX + (this.targetX - this.startingX)*(this.timer/120);
                    this.card.y = 300 + 300*(this.timer/120);
                    //1 sec == 60 frames in PIXI
                    //Fix Z-order once, use undefined field because of performance
                    if (this.timer > 60 && !this.zOrderChanged){
                        testOne.deck.removeChild(this.card);
                        testOne.deck.addChild(this.card);
                        this.zOrderChanged = true;
                    } 
                    if (this.timer > 120){
                        this.card.position.set(this.targetX, 600);
                        testOne.numberOfCardsMoving--;
                        app.ticker.remove(this.func, this);
                    } 
                    //clean itself if scene is closed
                    if (!testOne.scene.visible) {
                        app.ticker.remove(this.func, this);
                        testOne.numberOfCardsMoving--;
                        if (testOne.numberOfCardsMoving === 0){
                            testOne.clear();
                        }
                    }
                }
            }

            testOne.moveCards = function(): void{
                testOne.startButton.visible = false;

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
                            testOne.moveCard(testOne.cards[this.currentIndex], this.timer);
                            testOne.targetX += 5;
                            this.currentIndex--;
                            testOne.numberOfCardsMoving++;
                        }
                    } else {
                        app.ticker.remove(this.func, this);
                    } 
                    if (!testOne.scene.visible) {
                        app.ticker.remove(this.func, this);
                        if (testOne.numberOfCardsMoving === 0){
                            testOne.clear();
                        }
                    }
                }
            }
            testOne.startButton.on("pointerdown", testOne.moveCards);
            testOne.clear = function():void {
                testOne.startButton.visible = true;
                testOne.startX = 100;
                testOne.targetX = 100;
                for (let i = 0; i < 144; i++){
                    let card = testOne.cards[i];
                    //reset zIndex of the card
                    testOne.scene.removeChild(card);
                    testOne.scene.addChild(card);
                    card.position.set(testOne.startX, 300);
                    testOne.startX += 5;
                }
            }
            //TEST 2
            //Array of images for test 2
            testTwo.images = [
                resources.card.texture,
                resources.coin.texture,
                resources.ball.texture,
                resources.van.texture,
                resources.house.texture
            ];

            testTwo.startButton = new PIXI.Text("START");
            testTwo.startButton.style.fontSize = 72;
            testTwo.startButton.anchor.set(0.5, 0.5);
            testTwo.startButton.position.set(540, 108);
            testTwo.startButton.interactive = true;
            testTwo.startButton.buttonMode = true;
            testTwo.scene.addChild(testTwo.startButton);

            testTwo.spritesContainer = new PIXI.Container();
            testTwo.spritesContainer.position.set(540, 540);
            testTwo.scene.addChild(testTwo.spritesContainer);

            testTwo.start = function(): void {
                testTwo.startButton.visible = false;

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
                        let lastIndex: number = testTwo.spritesContainer.children.length - 1;
                        for (let i = lastIndex; i >= 0; i--){
                            testTwo.spritesContainer.removeChildAt(i);
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
                                //Random word 
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
                                let currentIndex: number = Math.floor(Math.random()*testTwo.images.length);
                                element = new PIXI.Sprite(testTwo.images[currentIndex]);
                            }
                            element.anchor.set(0, 0.5);
                            element.x = elementsWidth;
                            //add 10 pixels space between elements
                            elementsWidth += (element.width + 10);
                            testTwo.spritesContainer.addChild(element);
                        }
                        //center the container (PIXI.Container doesn't have "anchor" property :P)
                        testTwo.spritesContainer.pivot.set(testTwo.spritesContainer.width/2, testTwo.spritesContainer.height/2);
                    } 
                    //clean itself if scene is closed
                    if (!testTwo.scene.visible) {
                        let lastIndex: number = testTwo.spritesContainer.children.length - 1;
                        for (let i = lastIndex; i >= 0; i--){
                            testTwo.spritesContainer.removeChildAt(i);
                        }
                        testTwo.startButton.visible = true;
                        app.ticker.remove(this.func, this);
                    }
                }
            }
            testTwo.startButton.on("pointerdown", testTwo.start);
            //TEST 3
            //Actually more than 10 particles :(
            //I found free fire art and made fire than consisted 
            //of 10 or less sprites, but it didn't look really well.
            //According to my understanding if particles are used
            //there are a lot of simple sprites. If you use better images
            //it's better to just animate it with Spine or make animation from frames
            testThree.startButton = new PIXI.Text("START");
            testThree.startButton.style.fontSize = 72;
            testThree.startButton.anchor.set(0.5, 0.5);
            testThree.startButton.position.set(540, 108);
            testThree.startButton.interactive = true;
            testThree.startButton.buttonMode = true;
            testThree.scene.addChild(testThree.startButton);

            testThree.particlesContainer = new PIXI.Container();
            testThree.particlesContainer.position.set(540, 540);
            testThree.particlesContainer.scale.set(3, 3);
            testThree.scene.addChild(testThree.particlesContainer);

            testThree.emitterConfig = {
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
            };
            testThree.fireTextures = [resources.particle.texture, resources.fire.texture];

            testThree.start = function(): void {
                testThree.startButton.visible = false;

                testThree.emitter = new particles.Emitter(
                    testThree.particlesContainer,
                    testThree.fireTextures,
                    testThree.emitterConfig
                );

                let controlObject = {
                    timer: 0,
                    func: animation
                };

                // Start emitting
                testThree.emitter.emit = true;
        
                app.ticker.add(controlObject.func, controlObject);
        
                function animation(delta: number): void{
                    this.timer += delta;
                    //calculate card's new position
                    testThree.emitter.update(delta/60);
                    //clean itself if scene is closed
                    if (!testThree.scene.visible) {
                        app.ticker.remove(this.func, this);
                        testThree.emitter.destroy();
                        testThree.startButton.visible = true;
                        // stop emitting
                    }
                }
            }
            testThree.startButton.on("pointerdown", testThree.start);
            //UTILITY FUNCTIONS
            //resize the window responsively
            controlObject.onResize = function():void {
                //resize the canvas
                let windowWidth: number = window.innerWidth;
                let windowHeight: number = window.innerHeight;
                let newScale: number;
                if (windowHeight > windowWidth){
                    main.scene.position.set(0, (windowHeight-windowWidth)/2);
                    newScale = windowWidth/1080;
                } else {
                    main.scene.position.set((windowWidth-windowHeight)/2, 0);
                    newScale = windowHeight/1080;
                }
                app.renderer.resize(windowWidth, windowHeight);
                main.scene.scale.set(newScale, newScale);
                //resize and update position of the some elements
                UI.FPSMeter.position.set(windowWidth - 20, 20);
                UI.backButton.position.set(20, windowHeight - 20); 
            }
            //add resize event
            window.addEventListener('resize', controlObject.onResize);
            //call once to init the game
            controlObject.onResize();
        });
    //add key "Enter" toggle fullscreen event
    document.addEventListener('keydown', onKeyDown);
    function onKeyDown(key: any){
        //press "Enter" to go fullscreen:
        if (key.keyCode === 13){
            // toggle fullscreen when the game is started
            document.documentElement.requestFullscreen();
            controlObject.onResize();
        }
    }
})();
//The end, thank you! :)