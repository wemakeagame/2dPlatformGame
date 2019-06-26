import { GAME_CONFIG } from "./game_config";
import jquery = require("jquery");

let level = null;

export function getLevel() {
  let _level = level ? level : jquery("#level")[0];
  level = _level;
  return level;
}

export function moveLevel(pos) {
  if (!level) return pos;

  let screenLimitLeft = GAME_CONFIG.screenLimit;
  let screenLimitRight = level.clientWidth - GAME_CONFIG.screenLimit;

  if (pos.x > screenLimitRight) {
    move({ x: screenLimitRight - pos.x, y: 0 });
    pos.x = screenLimitRight;
  } else if (pos.x < screenLimitLeft) {
    move({ x: -1 * (pos.x - screenLimitLeft), y: 0 });
    pos.x = screenLimitLeft;
  }

  return pos;
}

function move(pos) {
  let elements = jquery("#level .element");
  var newPos, e;

  for (let i = 0; i < elements.length; i++) {
    e = elements[i];
    newPos = {
      top: e.offsetTop + pos.y,
      left: e.offsetLeft + pos.x
    };
    jquery(e).offset(newPos);
  }
}
