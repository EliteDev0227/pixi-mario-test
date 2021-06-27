/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Application, Loader, Text, TilingSprite,
} from 'pixi.js';
import Hero from './app/Component/Hero';
import Obstacle from './app/Component/Obstacle';
import checkIntersect from './app/Common/Helpers';
import { GAME_HEIGHT, GAME_WIDTH } from './app/Common/Constants';

const loader = Loader.shared;
export default class Game {
  static instance: Game;

  private app: Application;

  private timeDelta: number;

  private hero!: Hero;

  private vehicles: Obstacle[];

  private stones: Obstacle[];

  private bullets: Obstacle[];

  private isGameRunning: boolean;

  private score!: Text;

  keys: any = {};

  constructor() {
    Game.instance = this;

    // instantiate app
    this.app = new Application({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0x1099bb, // light blue
    });

    // create view in DOM
    document.body.appendChild(this.app.view);

    // preload needed assets
    loader.add('bg', '/assets/img/bg.jpg');
    loader.add('hero', '/assets/img/hero.png');
    loader.add('vehicle', '/assets/img/vehicle.png');
    loader.add('stone', '/assets/img/stone.png');
    loader.add('bullet', '/assets/img/bullet.png');

    // then launch app on loader ready
    loader.load(this.setup.bind(this));

    window.addEventListener('keydown', this.keysDown.bind(this));
    window.addEventListener('keyup', this.keysUp.bind(this));

    this.timeDelta = 0;
    this.vehicles = [];
    this.stones = [];
    this.bullets = [];

    this.isGameRunning = false;
  }

  startGame(): void {
    this.vehicles?.forEach((item) => item.destroy());
    this.stones?.forEach((item) => item.destroy());
    this.bullets?.forEach((item) => item.destroy());

    this.timeDelta = 0;
    this.vehicles = [];
    this.stones = [];
    this.bullets = [];
    this.isGameRunning = true;

    this.hero.setPosition(400, 200);
  }

  keysDown(e: any): void {
    this.keys[e.keyCode] = true;
  }

  keysUp(e: any): void {
    this.keys[e.keyCode] = false;
  }

  setup(): void {
    // setup bg
    const bg = new TilingSprite(loader.resources.bg.texture, 800, 450);
    bg.position.set(0, 0);
    this.app.stage.addChild(bg);

    this.score = new Text('Score: ', {
      fontSize: 40,
    });
    this.score.position.set(20, 20);
    this.app.stage.addChild(this.score);

    // append hero
    this.hero = new Hero(loader.resources.hero.texture);
    this.app.stage.addChild(this.hero.sprite);
    this.hero.setPosition(400, 200);

    this.startGame();

    this.app.ticker.add((delta: number) => {
      if (!this.isGameRunning) {
        return;
      }

      this.timeDelta += delta;

      this.score.text = `Score: ${Math.floor(this.timeDelta / 10)}`;

      const tdf = Math.floor(this.timeDelta);
      if (tdf % 75 === 0) {
        // append bullet
        if (this.vehicles.length > 1) {
          const bullet = new Obstacle(loader.resources.bullet.texture, -5);
          this.app.stage.addChild(bullet.sprite);
          const offset = Math.max(1, Math.min(this.vehicles.length, Math.floor(Math.random() * 4)));
          const vehiclePos = this.vehicles[this.vehicles.length - offset].sprite.position;
          bullet.setPosition(vehiclePos.x, vehiclePos.y);
          this.bullets.push(bullet);
        }
      }
      if (tdf % 100 === 0) {
        // add vehicle
        const vehicle = new Obstacle(loader.resources.vehicle.texture, -2);
        this.app.stage.addChild(vehicle.sprite);
        vehicle.setPosition(850, 400);
        this.vehicles.push(vehicle);
      }
      if (tdf % 200 === 0) {
        // add stone
        const stone = new Obstacle(loader.resources.stone.texture, -1);
        this.app.stage.addChild(stone.sprite);
        stone.setPosition(850, Math.random() * 300 + 50);
        this.stones.push(stone);
      }

      // animate bg
      bg.tilePosition.set(bg.tilePosition.x - 1, bg.tilePosition.y);

      // check key input & move hero
      if (this.keys[38] || this.keys[87]) {
        this.hero.move(true);
      }
      if (this.keys[40] || this.keys[83]) {
        this.hero.move(false);
      }

      const updateItem = (item: Obstacle) => {
        // move item
        item.move();

        // detect collision
        if (checkIntersect(this.hero.sprite, item.sprite)) {
          this.isGameRunning = false;
        }
      };

      // animate obstacles
      this.vehicles.forEach((item) => updateItem(item));
      this.stones.forEach((item) => updateItem(item));
      this.bullets.forEach((item) => updateItem(item));

      if (!this.isGameRunning) {
        this.startGame();
      }
    });
  }
}

// eslint-disable-next-line no-new
new Game();
