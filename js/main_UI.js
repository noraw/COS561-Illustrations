
// switch between different modes
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


// selecting points/objects functions
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



// show the options available for adding objects 
function showAddJointOptions() {
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
    document.getElementById("bodyId").textContent = shape.GetBody().m_userData.id;
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
    document.getElementById("bodyId").textContent = emitter.body.m_userData.id;
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

// update UI with slider info
function changeAddEmitterPeriod(currPeriod) {
    document.getElementById("emitterPeriodLabel").textContent = 
        document.getElementById("emitterPeriodSlider").value;
}

function changeEditEmitterPeriod(currPeriod) {
    document.getElementById("emitterEditPeriodLabel").textContent = 
        document.getElementById("emitterEditPeriodSlider").value;
}


// functions dealing with the whole state of the illustration
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




