import { GAME_CONFIG } from "./game_config";
import { input } from "./input";
import { moveLevel } from "./level";
import { detectCollision } from "./collision";
import jquery = require("jquery");

export const PLAYER_CONFIG = {
  speed: 30,
  jump: 5.5
};

export let player;

export function getPlayer() {
  player = player
    ? player
    : {
        graphic: null,
        position: getPlayerPos,
        jumpedDis: 0,
        isGrounded: false,
        move: move
      };
  return player;
}

export function setPlayerGraphic() {
  const graphic = jquery("#player") && jquery("#player")[0];
  if (!graphic) {
    console.error("you don't have a player");
  }
  getPlayer().graphic = graphic;
}

function getPlayerPos(offset) {
  var pos = {
    x: 0,
    y: 0
  };

  if (offset) {
    var posToSet = {
      top: offset.y,
      left: offset.x
    };
    jquery(player.graphic).offset(posToSet);
  }

  if (player && player.graphic) {
    pos.x = jquery(player.graphic).offset().left;
    pos.y = jquery(player.graphic).offset().top;
  }

  return pos;
}

function move() {
  var gravity = GAME_CONFIG.gravity;
  var newPos = player.position();
  var isGround = GAME_CONFIG.groundPosition === newPos.y || player.isGrounded;
  var isJumping = player.jumpedDis < PLAYER_CONFIG.jump;

  newPos = moveLevel(newPos);

  if (!isGround) {
    newPos.y += gravity;
  } else {
    player.jumpedDis = 0;
  }

  newPos.x += input.x * PLAYER_CONFIG.speed;

  //Jump logic ///////////////////////////////////////////////
  if (input.space && isGround) {
    player.jumpedDis = PLAYER_CONFIG.jump;
    player.isGrounded = false;
  }

  player.jumpedDis = isJumping ? player.jumpedDis - gravity : 0;

  if (isJumping) {
    newPos.y -= player.jumpedDis;
  }

  if (newPos.y > GAME_CONFIG.groundPosition) {
    newPos.y = GAME_CONFIG.groundPosition;
  }
  //Jump logic ///////////////////////////////////////////////

  newPos = detectCollision(
    player.graphic,
    jquery("#level .element"),
    newPos,
    onCollisionEnter
  );

  player.position(newPos);
}

function onCollisionEnter(res) {
  player.isGrounded = res.collision.top;

  if (res.collision.top) {
    player.isJumping = false;
    player.jumpedDis = 0;
  }

  if (res.collision.bottom) {
    player.jumpedDis = 0;
  }
}
