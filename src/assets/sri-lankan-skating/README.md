# Sri Lankan Endless Skating — Coin and Menu Icon Pack

## Files
- coins/lotus_coin_01.png ... lotus_coin_06.png: six 64 x 64 transparent RGBA animation frames
- coins/lotus_coin_spritesheet_6x64.png: 384 x 64 transparent strip (6 frames, left-to-right)
- coins/lotus_coin_static.png: single front-facing collectible icon
- coins/lotus_coin_master.png: larger original illustration for future editing
- menu_icons/*.svg: 8 original, independently editable 64 x 64 viewBox vector icons: play, pause, restart, home, settings, sound_on, sound_off, fullscreen
- previews/asset_preview.jpg: overview
- previews/lotus_coin_animation.gif: example motion preview

The design is fictional lotus-inspired game currency, not an actual Sri Lankan legal-tender coin.

## Phaser 4 example

```ts
// preload()
this.load.spritesheet('lotus-coin', '/assets/coins/lotus_coin_spritesheet_6x64.png', {
  frameWidth: 64, frameHeight: 64
});
// SVG assets may also be used in web UI as <img> elements.
this.load.svg('playIcon', '/assets/menu_icons/play.svg', { width: 64, height: 64 });

// create()
this.anims.create({
  key: 'lotus-spin',
  frames: this.anims.generateFrameNumbers('lotus-coin', { start: 0, end: 5 }),
  frameRate: 10,
  repeat: -1,
});
const coin = this.add.sprite(400, 280, 'lotus-coin');
coin.play('lotus-spin');
```

For game buttons, SVG icons are graphics only — attach click / pointer handlers in the game or HTML overlay. Do not use a static JPG overview as a texture for the individual controls.
