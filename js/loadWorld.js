//mainly just a convenience for the testbed - uses global 'world' variable
function loadWorld(worldString) {
  if(worldString == "") return;
  emitters = new Array();
  emitterBodies = {};
  numBodies = 0;

  var json = JSON.parse(worldString);
  json['bodyList'] = JSON.parse(json['bodyList']);
  json['jointList'] = JSON.parse(json['jointList']);
  json['emitterList'] = JSON.parse(json['emitterList']);

  world = createEmptyWorld();
  world.m_allowSleep = json['m_allowSleep'];
  world.m_gravity = json['m_gravity'];

  for( var i = 0; i < json['bodyList'].length; i++){
    var jsonbody = JSON.parse(json['bodyList'][i]);
    loadJsonBody(jsonbody);
  }

  for( var i = 0; i < json['jointList'].length; i++){
    var jsonjoint = JSON.parse(json['jointList'][i]);
    loadJoint(jsonjoint);
  }

  for( var i = 0; i < json['emitterList'].length; i++){
    var jsonemitter = JSON.parse(json['emitterList'][i]);
    loadEmitter(jsonemitter);
  }

  numBodies = json['numBodies'];
  return true;
}


function loadEmitter(jsonemitter) {
  var velocity = new b2Vec2(jsonemitter.velocity.x, jsonemitter.velocity.y);
  var body = getBodyFromId(jsonemitter.body_id);
  var w = parseInt(jsonemitter.w);
  var period = parseInt(jsonemitter.period);
  var h = parseInt(jsonemitter.h);
  var r = parseInt(jsonemitter.radius);
  var emitter = new Emitter(body, velocity, r, w, h, period);
  emitters.push(emitter);
  emitterBodies[body.m_userData.id] = true;
}


function loadJoint(jsonjoint) {
  var jointDef = null;
  var joint = null;
  switch (jsonjoint.m_type) {
    case b2Joint.e_revoluteJoint: {
      jointDef = new b2RevoluteJointDef();
    } break;
    case b2Joint.e_prismaticJoint: {
      jointDef = new b2PrismaticJointDef();
    } break;
  }
  var body1 = getBodyFromId(jsonjoint.m_body1);
  if(body1 != null)
    jointDef.body1 = body1;

  var body2 = getBodyFromId(jsonjoint.m_body2);
  if(body2 != null)
    jointDef.body2 = body2;

	joint = world.CreateJoint(jointDef);

  switch (jsonjoint.m_type) {
    case b2Joint.e_revoluteJoint: {
      joint.K = new b2Mat22(null, 
        new b2Vec2(jsonjoint.K.col1.x, jsonjoint.K.col1.y),
        new b2Vec2(jsonjoint.K.col2.x, jsonjoint.K.col2.y));
      joint.K1 = new b2Mat22(null, 
        new b2Vec2(jsonjoint.K1.col1.x, jsonjoint.K1.col1.y),
        new b2Vec2(jsonjoint.K1.col2.x, jsonjoint.K1.col2.y));
      joint.K2 = new b2Mat22(null, 
        new b2Vec2(jsonjoint.K2.col1.x, jsonjoint.K2.col1.y),
        new b2Vec2(jsonjoint.K2.col2.x, jsonjoint.K2.col2.y));
      joint.K3 = new b2Mat22(null, 
        new b2Vec2(jsonjoint.K3.col1.x, jsonjoint.K3.col1.y),
        new b2Vec2(jsonjoint.K3.col2.x, jsonjoint.K3.col2.y));
      joint.m_lowerAngle = jsonjoint.m_lowerAngle;
      joint.m_maxMotorTorque = jsonjoint.m_maxMotorTorque;
      joint.m_ptpImpulse = jsonjoint.m_ptpImpulse;
      joint.m_ptpMass = jsonjoint.m_ptpMass;
      joint.m_upperAngle = jsonjoint.m_upperAngle;
    } break;
    case b2Joint.e_prismaticJoint: {
      joint.m_angularImpulse = jsonjoint.m_angularImpulse;
      joint.m_angularMass = jsonjoint.m_angularMass;
      joint.m_linearImpulse = jsonjoint.m_linearImpulse;
      joint.m_linearJacobian = convertToJacobian(jsonjoint.m_linearJacobian);
      joint.m_linearMass = jsonjoint.m_linearMass;
      joint.m_localXAxis1 = new b2Vec2(jsonjoint.m_localXAxis1.x, jsonjoint.m_localXAxis1.y);
      joint.m_localYAxis1 = new b2Vec2(jsonjoint.m_localYAxis1.x, jsonjoint.m_localYAxis1.y);
      joint.m_lowerTranslation = jsonjoint.m_lowerTranslation;
      joint.m_maxMotorForce = jsonjoint.m_maxMotorForce;
      joint.m_motorImpluse = jsonjoint.m_motorImpluse;
      joint.m_motorJacobian = convertToJacobian(jsonjoint.m_motorJacobian);
      joint.m_motorMass = jsonjoint.m_motorMass;
      joint.m_upperTranslation = jsonjoint.m_upperTranslation;
    } break;
  }

  joint.m_collideConnected = jsonjoint.m_collideConnected;
  joint.m_enableLimit = jsonjoint.m_enableLimit;
  joint.m_enableMotor = jsonjoint.m_enableMotor;
  joint.m_intialAngle = jsonjoint.m_intialAngle;
  joint.m_islandFlag = jsonjoint.m_islandFlag;
  joint.m_limitImpulse = jsonjoint.m_limitImpulse;
  joint.m_limitPositionImpulse = jsonjoint.m_limitPositionImpulse;
  joint.m_localAnchor1 = new b2Vec2(jsonjoint.m_localAnchor1.x, jsonjoint.m_localAnchor1.y);
  joint.m_localAnchor2 = new b2Vec2(jsonjoint.m_localAnchor2.x, jsonjoint.m_localAnchor2.y);
  joint.m_motorSpeed = jsonjoint.m_motorSpeed;

/*
    case b2Joint.e_distanceJoint: {
      jointDef = new b2DistanceJointDef();
    } break;
    case b2Joint.e_pulleyJoint: {
      jointDef = new b2PulleyJointDef();
    } break;
    case b2Joint.e_gearJoint: {
      jointDef = new b2GearJointDef();
    } break;
    */
}


function loadJsonBody(jsonbody) {
  var shapeList = JSON.parse(JSON.parse(jsonbody['shapeList'])); 
  if(shapeList.length == 1) {
    var jsonshape = shapeList['0'];
    var body = loadJsonShapeAndCreatBody(jsonshape, jsonbody);

    body.m_angularDamping = jsonbody.m_angularDamping;
    body.m_angularVelocity = jsonbody.m_angularVelocity;
    body.m_center = new b2Vec2(jsonbody.m_center.x, jsonbody.m_center.y);
    body.m_flags = jsonbody.m_flags;
    body.m_force = new b2Vec2(jsonbody.m_force.x, jsonbody.m_force.y);
    body.m_invI = jsonbody.m_invI;
    body.m_invMass = jsonbody.m_invMass;
    body.m_linearDamping = jsonbody.m_linearDamping;
    body.m_linearVelocity = new b2Vec2(jsonbody.m_linearVelocity.x, jsonbody.m_linearVelocity.y);
    body.m_mass = jsonbody.m_mass;
    body.m_position = new b2Vec2(jsonbody.m_position.x, jsonbody.m_position.y);
    body.m_position0 = new b2Vec2(jsonbody.m_position0.x, jsonbody.m_position0.y);
    body.m_rotation = jsonbody.m_rotation;
    body.m_rotation0 = jsonbody.m_rotation0;
    body.m_sleepTime = jsonbody.m_sleepTime;
    body.m_torque = jsonbody.m_torque;
    body.m_sMat0 = new b2Mat22(null, 
        new b2Vec2(jsonbody.sMat0.col1.x, jsonbody.sMat0.col1.y),
        new b2Vec2(jsonbody.sMat0.col2.x, jsonbody.sMat0.col2.y));
    body.m_userData = jsonbody.m_userData;
  }
}


function loadJsonShapeAndCreatBody(jsonshape, jsonbody) {
  var body = null;
  var shape = null;
  var x = jsonshape.m_position.x;
  var y = jsonshape.m_position.y;
  switch (jsonshape.m_type) {
    case b2Shape.e_circleShape:
      {
        body = createBall(world, x, y, jsonshape.m_radius, jsonbody.IsStatic)
        shape = body.GetShapeList();
        //shape.m_localPosition = 
        //    new b2Vec2(jsonshape.m_localPosition.x, jsonshape.m_localPosition.y);
        //shape.m_radius = jsonshape.m_radius;
      }
      break;
    case b2Shape.e_polyShape:
      {
        vertices = jsonshape.m_vertices;
        body = createPolyXY(world, x, y, vertices, jsonbody.IsStatic);
        shape = body.GetShapeList();
        //shape.m_coreVertices = jsonshape.m_;
        //shape.m_localCentroid = 
        //    new b2Vec2(jsonshape.m_localCentroid.x, jsonshape.m_localCentroid.y);
        //shape.m_localOBB = new b2Vec2(jsonshape.m_localOBB.x, jsonshape.m_localOBB.y);
        //shape.m_normals = jsonshape.m_;
        //shape.m_vertexCount = jsonshape.m_;
        //shape.m_vertices = jsonshape.m_;
        //shape.m_syncAABB = jsonshape.m_;
        //shape.m_syncMat = new b2Mat22(null, 
        //    new b2Vec2(jsonshape.m_syncMat.col1.x, jsonshape.m_syncMat.col1.y),
        //    new b2Vec2(jsonshape.m_syncMat.col2.x, jsonshape.m_syncMat.col2.y));
      }
      break;
  }
  shape.m_R = new b2Mat22(null, 
      new b2Vec2(jsonshape.m_R.col1.x, jsonshape.m_R.col1.y),
      new b2Vec2(jsonshape.m_R.col2.x, jsonshape.m_R.col2.y));
  //shape.m_categoryBits = jsonshape.m_categoryBits;
  shape.m_friction = jsonshape.m_friction;
  //shape.m_groupIndex = jsonshape.m_groupIndex;
  //shape.m_maskBits = jsonshape.m_maskBits;
  //shape.m_maxRadius = jsonshape.m_maxRadius;
  //shape.m_position = new b2Vec2(jsonshape.m_position.x, jsonshape.m_position.y);
  //shape.m_proxyId = jsonshape.m_proxyId;
  shape.m_restitution = jsonshape.m_restitution;
  //shape.m_type = jsonshape.m_type;

  return body;
}

function getBodyFromId(id) {
  if(id == null)
    return null;
	for (var b = world.m_bodyList; b; b = b.m_next) {  
    if(b.m_userData && b.m_userData.id == id)
      return b;
    
  }
  return null;
}

function convertToJacobian(jacobianJson) {
  var jacobian = new b2Jacobian();
  jacobian.angular1 = jacobianJson.angular1;
  jacobian.angular2 = jacobianJson.angular2;
  jacobian.linear1 = new b2Vec2(jacobianJson.linear1.x, jacobianJson.linear1.y);
  jacobian.linear2 = new b2Vec2(jacobianJson.linear2.x, jacobianJson.linear2.y);
  return jacobian;
}












