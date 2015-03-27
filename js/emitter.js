var Emitter = function(body, velocity, radius, w, h, period) {
    this.body = body;
    this.velocity = velocity;
    this.radius = radius;
    this.w = w;
    this.h = h;
    this.period = period;
    this.numUntilEmit = 0;
    if(this.period >= 1)
        this.numUntilEmit = period;
};

Emitter.prototype.update = function(velocity, radius, period) {
    this.velocity = velocity;
    this.radius = radius;
    this.period = period;
    this.numUntilEmit = 0;
    if(this.period >= 1)
        this.numUntilEmit = period;
};

Emitter.prototype.createBall = function() {
    var emitting = 0;
    if(this.period >= 1) {
        this.numUntilEmit--;
        if(this.numUntilEmit < 0) {
            emitting = 1;
            this.numUntilEmit = this.period;
        }
    } else {
        emitting = 1.0/this.period;
    }

    for(var i=0; i < emitting; i++) {
        randX = (Math.random() -.5) * this.w;
        randY = (Math.random() -.5) * this.h;
        var center = this.body.GetCenterPosition();
        var x,y;
        if(this.w > this.h) {
            x = center.x + randX;
            if(this.velocity.y < 0) {
                y = center.y - this.h/2 -this.radius;
            } else {
                y = center.y + this.h/2 +this.radius;
            }
        } else {
            y = center.y + randY;
            if(this.velocity.x < 0) {
                x = center.x - this.w/2 -this.radius;
            } else {
                x = center.x + this.w/2 +this.radius;
            }
        }

        var ball = createBall(world, x, y, this.radius, false);
        ball.SetLinearVelocity(this.velocity);
    }
};

Emitter.prototype.toJSON = function() {
    var jsonEmitter = {};
    jsonEmitter['w'] = this.w;
    jsonEmitter['h'] = this.h;
    jsonEmitter['radius'] = this.radius;
    jsonEmitter['velocity'] = this.velocity;
    jsonEmitter['period'] = this.period;
    jsonEmitter['body_id'] = this.body.m_userData.id;
    return JSON.stringify(jsonEmitter);
};


