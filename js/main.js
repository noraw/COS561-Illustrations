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
    document.getElementById('editObjects').className = 'notSelected';
    document.getElementById("frictionObject").textContent = "";
    document.getElementById("frictionSlider").value = 0;
    document.getElementById("restitutionObject").textContent = "";
    document.getElementById("restitutionSlider").value = 0;
  } else {
    document.getElementById("sidebar1Div").className = 
      document.getElementById("sidebar1Div").className.replace( /(?:^|\s)notSelected(?!\S)/g , '' );
    document.getElementById("sidebar2Div").className = 
      document.getElementById("sidebar1Div").className.replace( /(?:^|\s)notSelected(?!\S)/g , '' );
    document.getElementById("sidebar1Div").className += " selected";
    document.getElementById("sidebar2Div").className += " selected";
    if(moveObjects) {
      document.getElementById('editObjects').className = 'notSelected';
    } else {
      document.getElementById('editObjects').className = 'selected';
    }
  }
});

document.getElementById( 'moveSelectSwitch' ).addEventListener('click', function() {
  moveObjects = !moveObjects;
  if(moveObjects) {
    document.getElementById('editObjects').className = 'notSelected';
    selected_shape = false;
  } else {
    document.getElementById('editObjects').className = 'selected';
  }
});

function deleteObject() {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			if(s == selected_shape) {
        world.DestroyBody(b);
        selected_shape = false;
        return;
      }
		}
	}
}

function loadPolygon() {
  var fixed = document.getElementById("fixed").checked;
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
        }
      } else { 
        alert("Failed to load file");
      }
  }
}

function addCircle() {
  var r = document.getElementById("radius").value;
  r = parseInt(r);
  createBall(world, 30, 30, r, true);
}

function addRectangle() {
  var w = parseInt(document.getElementById("rectWidth").value);
  var h = parseInt(document.getElementById("rectHeight").value);
  createBox(world, 30, 30, w, h, true);
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







