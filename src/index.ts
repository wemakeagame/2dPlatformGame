import { startGetInput } from "./input";
import { getPlayer, setPlayerGraphic } from "./player";
import { GAME_CONFIG } from "./game_config";
import { getLevel } from "./level";
import { generateLevel, enableBuild, disableBuild } from "./build_level";
import jquery = require("jquery");

let player = getPlayer();
let isBuildMode = true;

(function start() {
  setPlayerGraphic();
  startGetInput();
  getLevel();
  setInterval(update, GAME_CONFIG.interval);
  jquery("#toggle").click(toggleGameMode.bind(this));
  jquery("#build").hide();
  toggleGameMode();

  generateLevel(
    '{"elements":[{"id":"element1","classes":"block size2 element","pos":{"x":284,"y":191}},{"id":"element2","classes":"block size1 element","pos":{"x":194,"y":221}},{"id":"element3","classes":"block size3 element","pos":{"x":375,"y":176}},{"id":"element4","classes":"block size1 element","pos":{"x":383,"y":238}},{"id":"element5","classes":"block size1 element","pos":{"x":578,"y":55}},{"id":"element6","classes":"block size2 element","pos":{"x":695,"y":105}},{"id":"element7","classes":"coin element","pos":{"x":613,"y":18}}]}'
  );
})();

function update() {
  if (player && !isBuildMode) {
    player.move();
  }
}

function toggleGameMode() {
  if (!isBuildMode) {
    enableBuild();
  } else {
    disableBuild();
  }
  isBuildMode = !isBuildMode;
}
