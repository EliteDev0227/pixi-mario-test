import { Texture } from 'pixi.js';
import { GAME_HEIGHT } from '../Common/Constants';
import Component from './Component';

export default class Hero extends Component {
  speed: number;

  constructor(public texture: Texture) {
    super(texture);

    this.speed = 3;
  }

  move(up: boolean): void {
    const boundBox = this.sprite.getBounds();
    if (up) {
      if ((boundBox.y - this.speed) >= 0) {
        this.sprite.y -= this.speed;
      }
    } else if (boundBox.y + boundBox.height + this.speed < GAME_HEIGHT) {
      this.sprite.y += this.speed;
    }
  }
}
