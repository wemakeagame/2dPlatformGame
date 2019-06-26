import jquery = require("jquery");

const showDebug = false;
let hasChecked = false;

export function detectCollision(target, elements, pos, callback) {
  let data = null;
  let _pos = pos;
  let elementsCollided = [];

  if (showDebug) {
    jquery("#playerDebugger").offset({ top: _pos.y, left: _pos.x });
  } else {
    jquery("#playerDebugger").hide();
  }

  for (let i = elements.length - 1; i > -1; i--) {
    let el = elements[i];
    hasChecked = false;

    let tCoord = {
      x: _pos.x,
      y: _pos.y,
      width: target.clientWidth,
      height: target.clientHeight,
      sizeX: _pos.x + target.clientWidth,
      sizeY: _pos.y + target.clientHeight
    };

    let elCoord = {
      x: el.offsetLeft,
      y: el.offsetTop,
      width: el.clientWidth,
      height: el.clientHeight,
      sizeX: el.offsetLeft + el.clientWidth,
      sizeY: el.offsetTop + el.clientHeight
    };

    let hCol = tCoord.sizeX > elCoord.x && tCoord.x < elCoord.sizeX;
    let vCol = tCoord.sizeY > elCoord.y && tCoord.y < elCoord.sizeY;

    if (hCol && vCol) {
      data = posData(tCoord, elCoord, _pos);
      data = resolveCollision(data);
      _pos = data.pos;

      if (hasChecked) {
        if (elementsCollided.length) {
          _pos = detectCollision(
            target,
            elementsCollided.concat(el),
            _pos,
            null
          );
        }

        elementsCollided.push(el);
      }

      callback && callback(data);
    }
  }

  return (data && data.pos) || _pos;
}

function resolveCollision(data) {
  data = adjustRightPos(data, data.target, data.element);
  data = adjustLeftPos(data, data.target, data.element);
  data = adjustBottomPos(data, data.target, data.element);
  data = adjustTopPos(data, data.target, data.element);

  return data;
}

function posData(t, el, pos) {
  return {
    pos: { x: pos.x, y: pos.y },
    collision: {
      top: false,
      bottom: false,
      left: false,
      right: false
    },
    element: el,
    target: t
  };
}

function adjustRightPos(data, t, el) {
  const limitElRight = el.x - t.width / 2;
  if (t.sizeX >= limitElRight && t.x <= limitElRight && !hasChecked) {
    data.pos.x = el.x - t.width;
    data.collision.right = true;

    hasChecked = true;
  }

  return data;
}

function adjustLeftPos(data, t, el) {
  const limitElRight = el.x - t.width / 2;
  const limitElLeft = el.sizeX + t.width / 2;
  if (
    t.x <= limitElLeft &&
    t.x >= limitElRight &&
    limitElLeft <= t.sizeX &&
    !hasChecked
  ) {
    data.pos.x = el.sizeX;
    data.collision.left = true;

    hasChecked = true;
  }

  return data;
}

function adjustTopPos(data, t, el) {
  const limitElTop = el.y;
  if (t.sizeY >= limitElTop && t.y <= limitElTop && !hasChecked) {
    data.pos.y = el.y - t.height;
    data.collision.top = true;

    hasChecked = true;
  }

  return data;
}

function adjustBottomPos(data, t, el) {
  const limitElTop = el.y;
  const limitElBottom = el.sizeY;
  if (
    t.y <= limitElBottom &&
    t.y >= limitElTop &&
    t.sizeY >= limitElBottom &&
    !hasChecked
  ) {
    data.pos.y = el.sizeY;
    data.collision.bottom = true;

    hasChecked = true;
  }

  return data;
}
