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
  select_type = select_any;
  if(moveObjects) {
    document.getElementById('editObjects').className = 'notSelected';
    selected_shape = false;
  } else {
    document.getElementById('editObjects').className = 'selected';
    select_type = select_any;
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
        var scene = JSON.parse(contents);
        scene['bodyList'] = JSON.parse(scene['bodyList']);
        scene['jointList'] = JSON.parse(scene['jointList']);
        if ( loadWorld(scene) )
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

function selectAnchor2() {
  select_type = select_anchor2;
  document.getElementById("anchor2").className = "button-clicked";
  selectAny();
}

function selectAny() {
  document.getElementById("moveSelectSwitch").checked = false;
  document.getElementById('editObjects').className = 'selected';
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
  switch(select_type) {
    case select_anchor1: {
      document.getElementById("selectedAnchor1").textContent = str;
      document.getElementById("anchor1").className = "button";
    } break;
    case select_anchor2: {
      document.getElementById("selectedAnchor2").textContent = str;
      document.getElementById("anchor2").className = "button";
    } break;
  }
  select_type = select_any;
}



