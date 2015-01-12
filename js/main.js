document.getElementById( 'editPlaySwitch' ).addEventListener('click', function() {
  state = !state;
  selected_shape = false;
  time_last_run = (new Date()).getTime();
  if(state) {
    document.getElementById("sidebar1Div").className = 
      document.getElementById("sidebar1Div").className.replace( /(?:^|\s)selected(?!\S)/g , '' );
    document.getElementById("sidebar2Div").className = 
      document.getElementById("sidebar1Div").className.replace( /(?:^|\s)selected(?!\S)/g , '' );
    document.getElementById("sidebar1Div").className += " notSelected";
    document.getElementById("sidebar2Div").className += " notSelected";
  } else {
    document.getElementById("sidebar1Div").className = 
      document.getElementById("sidebar1Div").className.replace( /(?:^|\s)notSelected(?!\S)/g , '' );
    document.getElementById("sidebar2Div").className = 
      document.getElementById("sidebar1Div").className.replace( /(?:^|\s)notSelected(?!\S)/g , '' );
    document.getElementById("sidebar1Div").className += " selected";
    document.getElementById("sidebar2Div").className += " selected";
  }
  document.getElementById('editJoint').className = 'notSelected';
  document.getElementById('editObject').className = 'notSelected';
  document.getElementById('editEmitter').className = 'notSelected';

});

document.getElementById( 'moveSelectSwitch' ).addEventListener('click', function() {
  moveObjects = !moveObjects;
  select_type = select_any;
  if(moveObjects) {
    selected_shape = false;
    document.getElementById('editJoint').className = 'notSelected';
    document.getElementById('editObject').className = 'notSelected';
    document.getElementById('editEmitter').className = 'notSelected';
  } else {
    select_type = select_any;
  }
});

function deleteObject() {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			if(s == selected_shape) {
        world.DestroyBody(b);
        selected_shape = false;
        document.getElementById('editObject').className = 'notSelected';
        return;
      }
		}
	}
}

function deleteEmitter() {
  var body = selected_shape.GetBody();
  var emitter = null;
  for(var i=0; i < emitters.length; i++) {
    if(body.m_userData.id == emitters[i].body.m_userData.id) {
      emitters.splice(i);
      delete emitterBodies[body.m_userData.id];
      break;
    }
  }
  deleteObject();
  document.getElementById('editEmitter').className = 'notSelected';
}

function deleteJoint() {
	for (var j = world.m_jointList; j; j = j.m_next) {
    if(j == selected_joint) {
      world.DestroyJoint(j);
      selected_joint = false;
      document.getElementById('editJoint').className = 'notSelected';
      return;
    }
  }
}

function loadPolygon() {
  var fixed = document.getElementById("fixed").checked;
  var doc = document.getElementById("loadPolygon");
  var oFiles = document.getElementById("loadPolygon").files,
      nFiles = oFiles.length,
      file,
      pointsArray=new Array();

  for (var nFileId = 0; nFileId < nFiles; nFileId++) {
    file = oFiles[nFileId];
    if (file) {
        var r = new FileReader();
        r.readAsText(file);
        r.onload = function(e) { 
	        var contents = e.target.result;
          console.log(contents);
          var arrLines = contents.split("\n");
          for( var i = 0; i < arrLines.length; i++) {
            line = arrLines[i];
            console.log(line);
            if(line != "")
              pointsArray.push(JSON.parse(line));
          }
          createPoly(world, 30, 30, pointsArray, fixed);
          document.getElementById("loadPolygon").value = "";
        }
      } else { 
        alert("Failed to load file");
      }
  }
}

function addCircle() {
  var fixed = document.getElementById("fixed").checked;
  var r = document.getElementById("radius").value;
  r = parseInt(r);
  createBall(world, 30, 30, r, fixed);
}

function addRectangle() {
  var fixed = document.getElementById("fixed").checked;
  var w = parseInt(document.getElementById("rectWidth").value);
  var h = parseInt(document.getElementById("rectHeight").value);
  createBox(world, 30, 30, w, h, fixed);
}

function addEmitter() {
  var w = parseInt(document.getElementById("emitterWidth").value);
  var h = parseInt(document.getElementById("emitterHeight").value);
  var r = parseInt(document.getElementById("emitterRadius").value);
  var x = parseInt(document.getElementById("emitterX").value);
  var y = parseInt(document.getElementById("emitterY").value);
  var period = parseFloat(document.getElementById("emitterPeriodLabel").textContent);

  var velocity = new b2Vec2(x, y);
  var body = createBox(world, 30, 30, w, h, true);

  var emitter = new Emitter(body, velocity, r, w, h, period);
  emitters.push(emitter);
  emitterBodies[body.m_userData.id] = true;
}


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

function updateEmitterPeriod(currPeriod) {
  document.getElementById("emitterPeriodLabel").textContent = document.getElementById("emitterPeriodSlider").value;
}

function updateEmitterEditPeriod(currPeriod) {
  document.getElementById("emitterEditPeriodLabel").textContent = document.getElementById("emitterEditPeriodSlider").value;
}

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

function saveIllustration() {
  var worldJSON = worldToJSON();
  var textToWrite = JSON.stringify(worldJSON);
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileNameToSaveAs = document.getElementById("fileName").value;

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();

}

function loadIllustration() {
  document.getElementById('editObject').className = 'notSelected';
  document.getElementById('editEmitter').className = 'notSelected';
  document.getElementById('editJoint').className = 'notSelected';
  var oFiles = document.getElementById("loadIllustration").files,
      nFiles = oFiles.length,
      file;

  for (var nFileId = 0; nFileId < nFiles; nFileId++) {
    file = oFiles[nFileId];
    if (file) {
      var r = new FileReader();
      r.readAsText(file);
      r.onload = function(e) { 
        var contents = e.target.result;
        if ( loadWorld(contents) )
            console.log("Scene loaded successfully.");
        else
            console.log("Failed to load scene");
        document.getElementById("loadIllustration").value = "";
      }
    } else { 
      alert("Failed to load file");
    }
  }
}

function selectBody1() {
  select_type = select_body1;
  document.getElementById("body1").className = "button-clicked";
  selectAny();
}

function selectBody2() {
  select_type = select_body2;
  document.getElementById("body2").className = "button-clicked";
  selectAny();
}

function selectAnchor1() {
  select_type = select_anchor1;
  document.getElementById("anchor1").className = "button-clicked";
  selectAny();
}

function setAnchor1BodyCenter(bodyType) {
  var body = null;
  switch(bodyType) {
    case 1: {
      body = getBodyFromId(parseInt(document.getElementById("selectedBody1").textContent));
    } break;
    case 2: {
      body = getBodyFromId(parseInt(document.getElementById("selectedBody2").textContent));
    } break;
  }
  var point = body.GetCenterPosition();
  var str = "("+point.x+", "+point.y+")";
  document.getElementById("selectedAnchor1").textContent = str;
}

function selectAny() {
  document.getElementById("moveSelectSwitch").checked = false;
  selected_shape = false;
  moveObjects = false;
}

function saveSelectedBody(body) {
  switch(select_type) {
    case select_body1: {
      document.getElementById("selectedBody1").textContent = body.m_userData.id;
      document.getElementById("body1").className = "button";
    } break;
    case select_body2: {
      document.getElementById("selectedBody2").textContent = body.m_userData.id;
      document.getElementById("body2").className = "button";
    } break;
  }
  select_type = select_any;
}

function saveSelectedPoint(point) {
  var str = "("+point.x+", "+point.y+")";
  document.getElementById("selectedAnchor1").textContent = str;
  document.getElementById("anchor1").className = "button";
  select_type = select_any;
}

function addJoint() {
  var b1 = parseInt(document.getElementById("selectedBody1").textContent);
  var b2 = parseInt(document.getElementById("selectedBody2").textContent);
  var body1 = getBodyFromId(b1);
  var body2 = getBodyFromId(b2);

  var a1 = document.getElementById("selectedAnchor1").textContent.split(", ");
  var x = parseInt(a1[0].split("(")[1]);
  var y = parseInt(a1[1].split(")")[0]);
  var aX = parseInt(document.getElementById("axisX").value);
  var aY = parseInt(document.getElementById("axisY").value);

  var jointDef = null;
  var val = document.getElementById("jointType").value;
  switch(val) {
    case "revolute": {
      jointDef = new b2RevoluteJointDef();
    } break;
    case "prismatic": {
	    jointDef = new b2PrismaticJointDef();
    	jointDef.axis.Set(aX, aY);
      document.getElementById("axisX").value = "";
      document.getElementById("axisY").value = "";
    } break;
  }

  if(body1 != null)
    jointDef.body1 = body1;
  if(body2 != null)
    jointDef.body2 = body2;

  jointDef.anchorPoint = new b2Vec2(x, y);

	joint = world.CreateJoint(jointDef);

  document.getElementById("selectedBody1").textContent = "NaN";
  document.getElementById("selectedBody2").textContent = "NaN";
  document.getElementById("selectedAnchor1").textContent = "NaN";
}

function showJointOptions() {
  var val = document.getElementById("jointType").value;
  switch(val) {
    case "revolute": {
      document.getElementById("jointPrismatic").style.display = "none";
    } break;
    case "prismatic": {
      document.getElementById("jointPrismatic").style.display = "block";
    } break;
  }
}

function showShapeOptions(shape) {
  document.getElementById('editObject').className = 'selected';
  document.getElementById('editEmitter').className = 'notSelected';
  document.getElementById('editJoint').className = 'notSelected';
  document.getElementById("frictionObject").textContent = shape.m_friction;
  document.getElementById("frictionSlider").value = shape.m_friction;
  document.getElementById("restitutionObject").textContent = shape.m_restitution;
  document.getElementById("restitutionSlider").value = shape.m_restitution;
}

function showEmitterOptions(body) {
  document.getElementById('editEmitter').className = 'selected';
  document.getElementById('editObject').className = 'notSelected';
  document.getElementById('editJoint').className = 'notSelected';
  var emitter = null;
  for(var i=0; i < emitters.length; i++) {
    if(body.m_userData.id == emitters[i].body.m_userData.id)
      emitter = emitters[i];
  }
  document.getElementById("editEmitterRadius").value = emitter.radius;
  document.getElementById("editEmitterX").value = emitter.velocity.x;
  document.getElementById("editEmitterY").value = emitter.velocity.y;
  document.getElementById("emitterEditPeriodLabel").textContent = emitter.period;
  document.getElementById("emitterEditPeriodSlider").value = emitter.period;
}

function showJointOptions(shape) {
  document.getElementById('editJoint').className = 'selected';
  document.getElementById('editEmitter').className = 'notSelected';
  document.getElementById('editObject').className = 'notSelected';
  document.getElementById("jointEnableMotor").checked = selected_joint.m_enableMotor;
  document.getElementById("editJointSpeed").value = selected_joint.m_motorSpeed;

  switch(selected_joint.m_type) {
    case b2Joint.e_revoluteJoint: {
      document.getElementById("jointForce").textContent = "Motor torque:";
      document.getElementById("editJointForce").value = selected_joint.m_maxMotorTorque;
    } break;
    case b2Joint.e_prismaticJoint: {
      document.getElementById("jointForce").textContent = "Motor force:";
      document.getElementById("editJointForce").value = selected_joint.m_maxMotorForce;
    } break;
  }

}

function updateEmitter() {
  var body = selected_shape.GetBody();
  var emitter = null;
  for(var i=0; i < emitters.length; i++) {
    if(body.m_userData.id == emitters[i].body.m_userData.id)
      emitter = emitters[i];
  }
  var radius = parseInt(document.getElementById("editEmitterRadius").value);
  var velocity = new b2Vec2(document.getElementById("editEmitterX").value, document.getElementById("editEmitterY").value);
  var period = parseFloat(document.getElementById("emitterEditPeriodLabel").textContent);
  emitter.update(velocity, radius, period);
}

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

function storeIllustration() {
  var worldJSON = worldToJSON();
  saved_world = JSON.stringify(worldJSON);
}

function resetIllustration() {
  document.getElementById('editObject').className = 'notSelected';
  document.getElementById('editEmitter').className = 'notSelected';
  document.getElementById('editJoint').className = 'notSelected';
  loadWorld(saved_world);
}







