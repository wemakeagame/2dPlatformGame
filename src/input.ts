import jquery = require("jquery");

export const input = {
  x: 0,
  y: 0,
  space: 0
};

export function startGetInput() {
  jquery("html").keydown(function(event) {
    if (event.which === 39) {
      // right arrow
      input.x = 0.1;
      event.preventDefault();
    }
    if (event.which === 37) {
      // left arrow
      input.x = -0.1;
      event.preventDefault();
    }
    if (event.which === 38) {
      // up arrow
      input.y = 0.1;
      event.preventDefault();
    }
    if (event.which === 40) {
      // down arrow
      input.y = -0.1;
      event.preventDefault();
    }

    if (event.which === 32) {
      // space
      input.space = 1;
      event.preventDefault();
    }
  });

  jquery("html").keyup(function(event) {
    if (event.which === 39 && input.x === 0.1) {
      // right arrow
      input.x = 0;
      event.preventDefault();
    }
    if (event.which === 37 && input.x === -0.1) {
      // left arrow
      input.x = 0;
      event.preventDefault();
    }
    if (event.which === 38 && input.y === 0.1) {
      // up arrow
      input.y = 0;
      event.preventDefault();
    }
    if (event.which === 40 && input.y === -0.1) {
      // down arrow
      input.y = 0;
      event.preventDefault();
    }

    if (event.which === 32) {
      // space
      input.space = 0;
      event.preventDefault();
    }
  });
}
