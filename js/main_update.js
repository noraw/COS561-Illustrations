
// Change Global variables
function changeGravity() {
    var x = parseInt(document.getElementById("gravityX").value);
    var y = parseInt(document.getElementById("gravityY").value);
    world.m_gravity = new b2Vec2(x, y);
}

function updateTimeStep(currTimeStepMilli) {
    time_step_ms = currTimeStepMilli;
    document.getElementById("timeStep").textContent = time_step_ms;
    document.getElementById("timeStepSlider").value = time_step_ms;
}

// Change shape variables
function updateFriction(currFriction) {
    selected_shape.m_friction = currFriction;
    document.getElementById("frictionObject").textContent = selected_shape.m_friction;
    document.getElementById("frictionSlider").value = selected_shape.m_friction;
}

function updateRestitution(currRestitution) {
    selected_shape.m_restitution = currRestitution;
    document.getElementById("restitutionObject").textContent = selected_shape.m_restitution;
    document.getElementById("restitutionSlider").value = selected_shape.m_restitution;
}


// Update emitter
function updateEmitter() {
    var body = selected_shape.GetBody();
    var emitter = null;
    for(var i=0; i < emitters.length; i++) {
        if(body.m_userData.id == emitters[i].body.m_userData.id)
            emitter = emitters[i];
    }
    var radius = parseInt(document.getElementById("editEmitterRadius").value);
    var velocity = new b2Vec2(parseInt(document.getElementById("editEmitterX").value),
        parseInt(document.getElementById("editEmitterY").value));
    var period = parseFloat(document.getElementById("emitterEditPeriodLabel").textContent);
    emitter.update(velocity, radius, period);
}

// Update Joint
function updateJoint() {
    selected_joint.m_enableMotor = document.getElementById("jointEnableMotor").checked;
    selected_joint.m_motorSpeed = parseInt(document.getElementById("editJointSpeed").value);

    switch(selected_joint.m_type) {
        case b2Joint.e_revoluteJoint: {
            selected_joint.m_maxMotorTorque = parseInt(document.getElementById("editJointForce").value);
        } break;
        case b2Joint.e_prismaticJoint: {
            selected_joint.m_maxMotorForce = parseInt(document.getElementById("editJointForce").value);
        } break;
    }
}

function UpdateJointPosition(body) {
	for (var j = world.m_jointList; j; j = j.m_next) {
    var b1 = j.GetBody1();
    var b2 = j.GetBody2();
    if(b1 == body) {
        j.m_localAnchor2.x = body.m_position.x;
        j.m_localAnchor2.y = body.m_position.y;
    }// else if(b2 == body) {
//      j.m_localAnchor1.x = body.m_position.x;
//      j.m_localAnchor1.y = body.m_position.y;
//    }
	}
}
