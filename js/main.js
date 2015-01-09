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

function fixObject() {
  var value = document.getElementById('fixObject').value;
  var body = selected_shape.GetBody();
  if(value == 'Fix') {
    body.m_flags = 17;
    body.m_mass = 0;
    body.m_invMass = 0;
    body.mI = 0;
    body.invI = 0;
    selected_shape.m_friction = 0.2;
    selected_shape.m_resitution = 0;
    document.getElementById('fixObject').value = 'UnFix';
  } else {
    body.m_flags = 20;
    body.m_mass = 0;
    body.m_invMass = 0;
    document.getElementById('fixObject').value = 'Fix';
  }
  var stat = body.IsStatic();
  var i = 1;
}

function loadPolygon() {
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
          createPoly(world, 30, 30, pointsArray, true);
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
