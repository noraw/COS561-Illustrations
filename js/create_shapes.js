function createPoly(world, x, y, points, fixed) {
    var polySd = new b2PolyDef();
    if (!fixed) {
        polySd.density = density;
        polySd.restitution = restitution;
        polySd.friction = friction;
    }  
    polySd.vertexCount = points.length;
    for (var i = 0; i < points.length; i++) {
        polySd.vertices[i].Set(points[i][0], points[i][1]);
    }
    var polyBd = new b2BodyDef();
    polyBd.AddShape(polySd);
    polyBd.position.Set(x,y);
    body = world.CreateBody(polyBd);
    body.m_userData = {'id': numBodies};
    numBodies++;
    return body;
};

function createPolyXY(world, x, y, points, fixed) {
    var polySd = new b2PolyDef();
    if (!fixed) {
        polySd.density = density;
        polySd.restitution = restitution;
        polySd.friction = friction;
    }  
    polySd.vertexCount = points.length;
    for (var i = 0; i < points.length; i++) {
        polySd.vertices[i].Set(points[i].x, points[i].y);
    }
    var polyBd = new b2BodyDef();
    polyBd.AddShape(polySd);
    polyBd.position.Set(x,y);
    body = world.CreateBody(polyBd);
    body.m_userData = {'id': numBodies};
    numBodies++;
    return body;
};

function createBall(world, x, y, r, fixed) {
    r = r || 20;
    fixed = fixed || false;
    var ballSd = new b2CircleDef();
    ballSd.radius = r;
    if (!fixed) {
        ballSd.density = density;
        ballSd.restitution = restitution;
        ballSd.friction = friction;
    }
    var ballBd = new b2BodyDef();
    ballBd.AddShape(ballSd);
    ballBd.position.Set(x,y);
    body = world.CreateBody(ballBd);
    body.m_userData = {'id': numBodies};
    numBodies++;
    return body;
}

function createBox(world, x, y, width, height, fixed) {
    if (typeof(fixed) == 'undefined') fixed = true;
    var boxSd = new b2BoxDef();
    if (!fixed) {
        boxSd.density = density;
        boxSd.restitution = restitution;
        boxSd.friction = friction;
    }
    boxSd.extents.Set(width/2, height/2);
    var boxBd = new b2BodyDef();
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x,y);
    body = world.CreateBody(boxBd);
    body.m_userData = {'id': numBodies};
    numBodies++;
    return body;
}


