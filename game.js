(function gameSetup() {
    'use strict';

    var shipElem = document.getElementById('ship');

    // Create your "ship" object and any other variables you might need...
    var gameWidth = document.documentElement.clientWidth;
    var gameHeight = document.documentElement.clientHeight;

    var ship = {
      body: shipElem.style,
      velocity: 0,
      angle: 0,
      x: gameWidth/2,
      y: gameHeight/2,
      top: shipElem.getBoundingClientRect().top,
      left: shipElem.getBoundingClientRect().left,
      right: shipElem.getBoundingClientRect().right,
      bottom: shipElem.getBoundingClientRect().bottom,
      update: function () {
        this.top = shipElem.getBoundingClientRect().top;
        this.left = shipElem.getBoundingClientRect().left;
        this.right = shipElem.getBoundingClientRect().right;
        this.bottom = shipElem.getBoundingClientRect().bottom;
      },
    };

    function Asteroid(detail, top, left, right, bottom) {
      this.detail = detail;
      this.top = top;
      this.left = left;
      this.right = right;
      this.bottom = bottom;
      this.update = function () {
        this.top = this.detail.getBoundingClientRect().top;
        this.left = this.detail.getBoundingClientRect().left;
        this.right = this.detail.getBoundingClientRect().right;
        this.bottom = this.detail.getBoundingClientRect().bottom;
      };
    }


    var allAsteroids = [];
    shipElem.addEventListener('asteroidDetected', function (event) {
        // You can detect when a new asteroid appears with this event.
        // The new asteroid's HTML element will be in:  event.detail

        // What might you need/want to do in here?
        var newAsteroid = event.detail;
        var topBorder = newAsteroid.getBoundingClientRect().top;
        var leftBorder = newAsteroid.getBoundingClientRect().left;
        var right = newAsteroid.getBoundingClientRect().right;
        var bottom = newAsteroid.getBoundingClientRect().height;
        var asteroidObject = new Asteroid(newAsteroid, topBorder, leftBorder, right, bottom);
        allAsteroids.push(asteroidObject);

    });

    /**
     * Use this function to handle when a key is pressed. Which key? Use the
     * event.keyCode property to know:
     *
     * 37 = left
     * 38 = up
     * 39 = right
     * 40 = down
     *
     * @param  {Event} event   The "keyup" event object with a bunch of data in it
     * @return {void}          In other words, no need to return anything
     */
    function handleKeys(event) {
        console.log(event.keyCode);
        var key = event.keyCode;
        // Implement me!
        switch (key) {
          case 37:
            //Increase angle
            ship.angle+=20;
            break;
          case 38:
            //Decrease velocity variable, increase velocity in game
              ship.velocity--;
            break;
          case 39:
            //Decrease angle
            ship.angle-=20;
            break;
          case 40:
            //Increase velocity variable, decrease velocity in game.
            // Check to make sure ship can not go backwards
            if (ship.velocity >= 0) {
              ship.velocity = 0;
            } else {
              ship.velocity++;
            }
            break;
        }
        console.clear();
        console.log("Ship velocity: " + ship.velocity);
        console.log("Ship angle: " + ship.angle);
        console.log("Ship x: " + ship.x);
        console.log("Ship y: " + ship.y);
        console.log("Left of ship: " + ship.body.left);
        console.log("Top of ship: " + ship.body.top);
        console.log("Left of ship box: " + ship.left);
        console.log("Right of ship box: " + ship.right);
        console.log("Top of ship box: " + ship.top);
        console.log("Bottom of ship box: " + ship.bottom);
        console.log("Game width: " + gameWidth);
        console.log("Game height: " + gameHeight);
        console.log("Asteroids: " + allAsteroids);
        console.log("First asteroid's left side: " + allAsteroids[0].left);
        console.log("First asteroid's right side: " + allAsteroids[0].right);
        console.log("First asteroid's top: " + allAsteroids[0].top);
        console.log("First asteroid's bottom: " + allAsteroids[0].bottom);

    }
    document.querySelector('body').addEventListener('keyup', handleKeys);

    /**
     * This is the primary "game loop"... in traditional game development, things
     * happen in a loop like this. This function will execute every 20 milliseconds
     * in order to do various things. For example, this is when all game entities
     * (ships, etc) should be moved, and also when things like hit detection happen.
     *
     * @return {void}
     */
    function gameLoop() {
        // This function for getting ship movement is given to you (at the bottom).
        // NOTE: you will need to change these arguments to match your ship object!
        // What does this function return? What will be in the `move` variable?
        // Read the documentation!
        var move = getShipMovement(ship.velocity, ship.angle);

        //Refresh game dimensions in case browser window changes
        gameWidth = document.documentElement.clientWidth;
        gameHeight = document.documentElement.clientHeight;

        // Move the ship here!
        if (ship.x < -20) {
          ship.x = gameWidth;
        } else if (ship.x > gameWidth + 20) {
          ship.x = 0;
        }
        if (ship.y < -20) {
          ship.y = gameHeight;
        } else if (ship.y > gameHeight + 20) {
          ship.y = 0;
        }
        ship.x += move.left;
        ship.y += move.top;

        ship.body.left = parseFloat(ship.x) + "px";
        ship.body.top = parseFloat(ship.y) + "px";


        var rotateString = "rotate(" + -1*ship.angle + "deg)";
        ship.body.transform = rotateString;



        // Time to check for any collisions (see below)...
        checkForCollisions();
    }

    /**
     * This function checks for any collisions between asteroids and the ship.
     * If a collision is detected, the crash method should be called with the
     * asteroid that was hit:
     *    crash(someAsteroidElement);
     *
     * You can get the bounding box of an element using:
     *    someElement.getBoundingClientRect();
     *
     * A bounding box is an object with top, left, width, and height properties
     * that you can use to detect whether one box is on top of another.
     *
     * @return void
     */
    function checkForCollisions() {
        // Implement me!
        for (var index = 0; index < allAsteroids.length; index++) {
          var current = allAsteroids[index];
          ship.update();
          current.update();
          if (current.right > ship.left && current.top < ship.bottom && current.bottom > ship.top && current.left < ship.right) {
            crash(current.detail);
          }
        }

    }


    /**
     * This event handler will execute when a crash occurs
     *
     * return {void}
     */
    document.querySelector('main').addEventListener('crash', function () {
        console.log('A crash occurred!');

        // What might you need/want to do in here?
        clearInterval(loopHandle);
        loopHandle = 0;
        var main = document.querySelector('main');
        main.style.color = "white";
        main.style.fontSize = "5em";
        main.style.lineHeight = gameHeight+"px";
        main.style.textAlign = "center";
        main.innerHTML = "GAME OVER!";

    });



    /** ************************************************************************
     *             These functions and code are given to you.
     *
     *                   !!! DO NOT EDIT BELOW HERE !!!
     ** ************************************************************************/

     var loopHandle = setInterval(gameLoop, 20);

     /**
      * Executes the code required when a crash has occurred. You should call
      * this function when a collision has been detected with the asteroid that
      * was hit as the only argument.
      *
      * @param  {HTMLElement} asteroidHit The HTML element of the hit asteroid
      * @return {void}
      */
    function crash(asteroidHit) {
        document.querySelector('body').removeEventListener('keyup', handleKeys);
        asteroidHit.classList.add('hit');
        document.querySelector('#ship').classList.add('crash');

        var event = new CustomEvent('crash', { detail: asteroidHit });
        document.querySelector('main').dispatchEvent(event);
    }

    /**
     * Get the change in ship position (movement) given the current velocity
     * and angle the ship is pointing.
     *
     * @param  {Number} velocity The current speed of the ship (no units)
     * @param  {Number} angle    The angle the ship is pointing (no units)
     * @return {Object}          The amount to move the ship by with regard to left and top position (object with two properties)
     */
    function getShipMovement(velocity, angle) {
        return {
            left: (velocity * Math.sin(angle * Math.PI / 180)),
            top: (velocity * Math.cos(angle * Math.PI / 180))
        };
    }

})();
