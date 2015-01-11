function worldToJSON() {
  var json = {};
  json['m_allowSleep'] = world.m_allowSleep;
  json['m_gravity'] = world.m_gravity;
  var bodyList = new Array();
  
	for (var b = world.m_bodyList; b; b = b.m_next) {
    var body = saveBody(b);
    if(body)
      bodyList.push(JSON.stringify(body));
	}
  json['bodyList'] = bodyList;

  var jointList = new Array();
	for (var j = world.m_jointList; j; j = j.m_next) {
    var joint = saveJoint(j);
    jointList.push(JSON.stringify(joint));
	}
  json['jointList'] = jointList;

  var emitterList = new Array();
  for(var i=0; i < emitters.length; i++) {
    emitterList.push(emitters[i].toJSON());
  }
  json['emitterList'] = emitterList;

  return json;
}

function saveBody(b) {
  var body = {};
  if(b.m_userData && b.m_userData.id == 0)
    return null;
  body['IsStatic'] = b.IsStatic();
  body['m_angularDamping'] = b.m_angularDamping;
  body['m_angularVelocity'] = b.m_angularVelocity;
  body['m_center'] = b.m_center;
  //body['m_contactList'] = b.m_contactList;
  body['m_flags'] = b.m_flags;
  body['m_force'] = b.m_force;
  body['m_invI'] = b.m_invI;
  body['m_invMass'] = b.m_invMass;
  body['m_linearDamping'] = b.m_linearDamping;
  body['m_linearVelocity'] = b.m_linearVelocity;
  body['m_mass'] = b.m_mass;
  body['m_position'] = b.m_position;
  body['m_position0'] = b.m_position0;
  body['m_rotation'] = b.m_rotation;
  body['m_rotation0'] = b.m_rotation0;
  body['m_sleepTime'] = b.m_sleepTime;
  body['m_torque'] = b.m_torque;
  body['m_userData'] = b.m_userData;
  body['sMat0'] = b.sMat0;
  var shapeList = new Array();

	for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
		var shape = {};
    shape['m_R'] = s.m_R;
    shape['m_categoryBits'] = s.m_categoryBits;
    shape['m_friction'] = s.m_friction;
    shape['m_groupIndex'] = s.m_groupIndex;
    shape['m_maskBits'] = s.m_maskBits;
    shape['m_maxRadius'] = s.m_maxRadius;
    shape['m_position'] = s.m_position;
    shape['m_proxyId'] = s.m_proxyId;
    shape['m_restitution'] = s.m_restitution;
    shape['m_type'] = s.m_type;

    switch (s.m_type) {
      case b2Shape.e_circleShape: {
        shape['m_localPosition'] = s.m_localPosition;
        shape['m_radius'] = s.m_radius;
      } break;
      case b2Shape.e_polyShape: {
        shape['m_coreVertices'] = s.m_coreVertices;
        shape['m_localCentroid'] = s.m_localCentroid;
        shape['m_localOBB'] = s.m_localOBB;
        shape['m_normals'] = s.m_normals;
        shape['m_vertexCount'] = s.m_vertexCount;
        shape['m_vertices'] = s.m_vertices;
        //shape['m_syncAABB'] = s.m_syncAABB;
        //shape['m_syncMat'] = s.m_syncMat;
      } break;
    }
    shapeList.push(shape);
	}
  body["shapeList"] = JSON.stringify(shapeList);
  return body;
}

function saveJoint(j) {
  var joint = {};
  body1id = null;
  body2id = null;
  if(j.m_body1.m_userData != null)
    body1id = j.m_body1.m_userData.id;
  if(j.m_body2.m_userData != null)
    body2id = j.m_body2.m_userData.id;
  joint['m_body1'] = body1id;
  joint['m_body2'] = body2id;
  joint['m_collideConnected'] = j.m_collideConnected;
  joint['m_enableLimit'] = j.m_enableLimit;
  joint['m_enableMotor'] = j.m_enableMotor;
  joint['m_intialAngle'] = j.m_intialAngle;
  joint['m_islandFlag'] = j.m_islandFlag;
  joint['m_limitImpulse'] = j.m_limitImpulse;
  joint['m_limitPositionImpulse'] = j.m_limitPositionImpulse;
  joint['m_localAnchor1'] = j.m_localAnchor1;
  joint['m_localAnchor2'] = j.m_localAnchor2;
  joint['m_motorSpeed'] = j.m_motorSpeed;
//    joint['m_node1'] = j.m_;
//    joint['m_node2'] = j.m_;
  joint['m_type'] = j.m_type;
  joint['m_userData'] = j.m_userData;

  switch (j.m_type) {
    case b2Joint.e_revoluteJoint: {
      joint['K'] = j.K;
      joint['K1'] = j.K1;
      joint['K2'] = j.K2;
      joint['K3'] = j.K3;
      joint['m_lowerAngle'] = j.m_lowerAngle;
      joint['m_maxMotorTorque'] = j.m_maxMotorTorque;
      joint['m_ptpImpulse'] = j.m_ptpImpulse;
      joint['m_ptpMass'] = j.m_ptpMass;
      joint['m_upperAngle'] = j.m_upperAngle;
    } break;
    case b2Joint.e_prismaticJoint: {
      joint['m_angularImpulse'] = j.m_angularImpulse;
      joint['m_angularMass'] = j.m_angularMass;
      joint['m_linearImpulse'] = j.m_linearImpulse;
      joint['m_linearJacobian'] = j.m_linearJacobian;
      joint['m_linearMass'] = j.m_linearMass;
      joint['m_localXAxis1'] = j.m_localXAxis1;
      joint['m_localYAxis1'] = j.m_localYAxis1;
      joint['m_lowerTranslation'] = j.m_lowerTranslation;
      joint['m_maxMotorForce'] = j.m_maxMotorForce;
      joint['m_motorImpluse'] = j.m_motorImpluse;
      joint['m_motorJacobian'] = j.m_motorJacobian;
      joint['m_motorMass'] = j.m_motorMass;
      joint['m_upperTranslation'] = j.m_upperTranslation;
    } break;
  }
  return joint;
}

