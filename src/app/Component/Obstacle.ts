import { Texture } from 'pixi.js';
import Component from './Component';

export default class Obstacle extends Component {
  constructor(public texture: Texture, public speed: number) {
    super(texture);
  }

  move(): void {
    this.sprite.x += this.speed;
  }
}
