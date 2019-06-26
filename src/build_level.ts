import jquery = require("jquery");
import { getLevel } from "./level";
let selectedEl = null;

export function generateLevel(_level) {
  if (!_level) return;

  let els = JSON.parse(_level).elements;

  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var node = document.createElement("div");
    jquery(node).addClass(el.classes);
    jquery(node).offset({
      top: el.pos.y,
      left: el.pos.x
    });
    getLevel().append(node);
  }
}

export function getLevelCode(isBuild?) {
  let els = jquery("#level")[0].children;
  let levelCode = {
    elements: []
  };
  for (var i = 1; i < els.length + 1; i++) {
    var el = els[i - 1];
    levelCode.elements.push({
      id: "element" + i,
      classes: el.className,
      pos: {
        x: el["offsetLeft"],
        y:
          el["offsetTop"] -
          (isBuild
            ? -jquery("#game")[0].offsetTop
            : +jquery("#game")[0].offsetTop)
      }
    });
  }

  jquery("#levelJson").html(JSON.stringify(levelCode));
}

function onMouseMove(e) {
  if (selectedEl) {
    let parentId = selectedEl.parentElement && selectedEl.parentElement.id;
    if (parentId === "level" || selectedEl.id === "player")
      jquery(selectedEl).offset({
        top: e.clientY - selectedEl.clientHeight / 2,
        left: e.clientX - selectedEl.clientWidth / 2
      });
  }
}

function onElMouseUp(e) {
  e.stopPropagation();
  if (e.target === selectedEl) {
    selectedEl = null;
    getLevelCode();
  }
}

function onElMouseDown(e) {
  e.stopPropagation();
  selectedEl = e.target;
}

function onElDblclick(e) {
  e.target.remove();
  getLevelCode();
}

function onListElMouseUp(e) {
  e.stopPropagation();

  var newEl = e.target.cloneNode(true);
  jquery("#level").append(newEl);
  selectedEl = newEl;
  getLevelCode();
  unbindEvents();
  bindEvents();
}

function onListElMouseDown(e) {
  e.stopPropagation();
}

function bindEvents() {
  $("#elements .element").mouseup(onListElMouseUp.bind(this));
  $("#elements .element").mousedown(onListElMouseDown.bind(this));
  $(".element").mousedown(onElMouseDown.bind(this));
  $(".element").mouseup(onElMouseUp.bind(this));
  $("#level .element").dblclick(onElDblclick.bind(this));
  $("#app").mousemove(onMouseMove.bind(this));
}

function unbindEvents() {
  $("#elements .element").off();
  $("#elements .element").off();
  $(".element").off();
  $(".element").off();
  $("#app").off();
}

export function enableBuild() {
  jquery("#build").show();
  getLevelCode(true);
  requestLoadLevel();
  bindEvents();
}

export function disableBuild() {
  unbindEvents();
  getLevelCode();
  requestLoadLevel();
  jquery("#build").hide();
}

function requestLoadLevel() {
  var lvl = document.getElementById("level");
  while (lvl.firstChild) {
    lvl.removeChild(lvl.firstChild);
  }
  generateLevel(jquery("#levelJson")[0]["value"]);
}
