demos.top = {};

demos.top.initWorld = function(world) {
	createBall(world, 350, 100, 50, true);
	createPoly(world, 100, 100, [[0, 0], [10, 30], [-10, 30]], true);
	createPoly(world, 150, 150, [[0, 0], [10, 30], [-10, 30]], true);
	var pendulum = createBox(world, 150, 100, 20, 20, false);
	var jointDef = new b2RevoluteJointDef();
	jointDef.body1 = pendulum;
	jointDef.body2 = world.GetGroundBody();
	jointDef.anchorPoint = pendulum.GetCenterPosition();
	world.CreateJoint(jointDef);

	var jointDef2 = new b2RevoluteJointDef();
	var seesaw = createPoly(world, 300, 200, [[0, 0], [100, 30], [-100, 30]]);
	jointDef2.body1 = seesaw;
	jointDef2.body2 = world.GetGroundBody();
	jointDef2.anchorPoint = seesaw.GetCenterPosition();
	world.CreateJoint(jointDef2);
};

demos.InitWorlds.push(demos.top.initWorld);


