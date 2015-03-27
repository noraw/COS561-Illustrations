function createWorld() {
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);
    worldAABB.maxVertex.Set(1000, 1000);
    var gravity = new b2Vec2(0, 300);
    var doSleep = true;
    var world = new b2World(worldAABB, gravity, doSleep);
    var ground = world.GetGroundBody();
    ground.m_userData = {'id': numBodies};
    numBodies++;
    createGround(world);
    createBox(world, 0, 300, 20, 600, true);
    createBox(world, 650, 300, 20, 600, true);
    return world;
}


function createEmptyWorld() {
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);
    worldAABB.maxVertex.Set(1000, 1000);
    var gravity = new b2Vec2(0, 300);
    var doSleep = true;
    var world = new b2World(worldAABB, gravity, doSleep);
    var ground = world.GetGroundBody();
    ground.m_userData = {'id': numBodies};
    numBodies++;
    return world;
}


function createGround(world) {
    var groundSd = new b2BoxDef();
    groundSd.extents.Set(1000, 50);
    groundSd.restitution = 0.2;
    var groundBd = new b2BodyDef();
    groundBd.AddShape(groundSd);
    groundBd.position.Set(-300, 440);
    body = world.CreateBody(groundBd);
    body.m_userData = {'id': numBodies};
    numBodies++;
    return body;
}


