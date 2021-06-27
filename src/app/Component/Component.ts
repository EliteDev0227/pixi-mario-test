import { Sprite, Texture } from 'pixi.js';

export default class Component {
  sprite: Sprite;

  constructor(public texture: Texture) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.y = 0.5;
    this.sprite.anchor.x = 0.5;
  }

  setPosition(x: number, y: number): void {
    this.sprite.position.set(x, y);
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
