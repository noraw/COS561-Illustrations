
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
