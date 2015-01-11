var Emitter = function(body, velocity, radius, w, h) {
  this.body = body;
  this.velocity = velocity;
  this.radius = radius;
  this.w = w;
  this.h = h;
};

Emitter.prototype.createBall = function() {
  randX = (Math.random() -.5) * this.w;
  randY = (Math.random() -.5) * this.h;
  var center = this.body.GetCenterPosition();
  var x,y;
  if(this.w > this.h) {
    x = center.x + randX;
    if(this.velocity.y < 0) {
      y = center.y - this.h/2;
    } else {
      y = center.y + this.h/2;
    }
  } else {
    y = center.y + randY;
    if(this.velocity.x < 0) {
      x = center.x - this.w/2;
    } else {
      x = center.x + this.w/2;
    }
  }

  var ball = createBall(world, x, y, this.radius, false);
  ball.SetLinearVelocity(this.velocity);
};
