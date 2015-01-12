var initId = 0;
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var state = false; // `true` when the simulation is running
var moveObjects = true; // lets you move objects, when false you can edit objects
var time_last_run;
var mouse_pressed = false;
var mouse_shape = false;
var mouse_old_position = null;
var mouse_x, mouse_y;
var selected_shape = false;
var numBodies = 0;

var density = 1.0;
var restitution = 0.8;
var friction = 0.3;
var time_step_ms = 1.0;

var select_any = 0;
var select_body1 = 1;
var select_body2 = 2;
var select_anchor1 = 3;
var select_anchor2 = 4;

var select_type = select_any;
var emitters = new Array();
var emitterBodies = {};

var saved_world = "";

function setupWorld(did) {
	if (!did) did = 0;
	world = createWorld();
	initId += did;
	initId %= demos.InitWorlds.length;
	if (initId < 0) initId = demos.InitWorlds.length + initId;
	demos.InitWorlds[initId](world);
}
function setupNextWorld() { setupWorld(1); }
function setupPrevWorld() { setupWorld(-1); }

function step(cnt) {
  if(state){
	  var stepping = false;
	  var timeStep = time_step_ms/60;
	  var iteration = 1;
	  world.Step(timeStep, iteration);
    //emitter stuff
    for(var i=0; i < emitters.length; i++) {
      emitters[i].createBall();
    }
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawWorld(world, ctx);
	setTimeout('step(' + (cnt || 0) + ')', 10);
}

function GetShapeAtMouse() {
    var aabb = new b2AABB();
    aabb.minVertex.Set(mouse_x - 0.001, mouse_y - 0.001);
    aabb.maxVertex.Set(mouse_x + 0.001, mouse_y + 0.001);
     
    var shapes = new Array();
    world.Query(aabb, shapes, 1);
    return shapes[0];
}

function GetJointAtMouse() {
  var mouse = new b2Vec2(mouse_x, mouse_y);
	for (var j = world.m_jointList; j; j = j.m_next) {
    var a1 = new b2Vec2(j.m_localAnchor1.x, j.m_localAnchor1.y);
    a1.Subtract(mouse);
    var a2 = new b2Vec2(j.m_localAnchor2.x, j.m_localAnchor2.y);
    a2.Subtract(mouse);

    if(a1.Length() < 5 || a2.Length() < 5)
      return j;
  }
  return null;
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

Event.observe(window, 'load', function() {
	setupWorld();
	ctx = $('canvas').getContext('2d');
	var canvasElm = $('canvas');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.style.top);
	canvasLeft = parseInt(canvasElm.style.left);
  document.getElementById("gravityX").value = world.m_gravity.x;
  document.getElementById("gravityY").value = world.m_gravity.y;
  document.getElementById("timeStep").textContent = time_step_ms;
  document.getElementById("timeStepSlider").value = time_step_ms;
  var fieldsetContents = document.getElementsByClassName('fieldsetContent');
  for(var i = 0; i < fieldsetContents.length; i++) {
    fieldsetContents[i].hide();
  }
  Event.observe('legend1', 'click', function(e) {
      this.nextElementSibling.toggle();
  });
  Event.observe('legend2', 'click', function(e) {
      this.nextElementSibling.toggle();
  });
  Event.observe('legend3', 'click', function(e) {
      this.nextElementSibling.toggle();
  });
  Event.observe('legend4', 'click', function(e) {
      this.nextElementSibling.toggle();
  });

  //If mouse is moving over the thing
  Event.observe('canvas', 'mousemove', function(e) {
    var p = new b2Vec2(Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
     
    mouse_x = p.x;
    mouse_y = p.y;
     
    if(mouse_pressed && mouse_shape) {
      var offset = new b2Vec2(p.x, p.y);
      offset.Subtract(mouse_old_position);

      mouse_shape.m_position.Add(offset);
      var shape = mouse_shape;
      var body = mouse_shape.GetBody();
      var rotation = body.GetRotation();
      var center = body.GetCenterPosition();
      var origin = body.GetOriginPosition();
      center.Add(offset);
      origin.Add(offset);
      body.SetCenterPosition(center, rotation);
      body.SetOriginPosition(origin, rotation);
      UpdateJointPosition(body);
      mouse_old_position = p;
    }
  });
   
	Event.observe('canvas', 'mousedown', function(e) {
    //if in simulate mode
    if (state) {
		  if (Math.random() < 0.5) 
			  createBall(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, false);
		  else 
			  createBox(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, 10, false);
    // if in edit mode
    } else {
      var shape = GetShapeAtMouse();
      // if can move the selected object around
      if(moveObjects) {
        mouse_pressed = true;
        if(shape) {
          mouse_shape = shape;
          mouse_old_position = new b2Vec2(Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
        }
      // highlights the selected object
      } else {
        // if you are picking an object for the joint body
        if(select_type == select_body1 || select_type == select_body2) {
          var body = world.GetGroundBody();
          if(shape) {
            body = shape.GetBody();
            if(!body.IsStatic()) {
              selected_shape = shape;
              saveSelectedBody(body);
            }
          } else {
            saveSelectedBody(body);
          }
          return;
        // if you are picking a point for the anchor for the joint
        } else if (select_type == select_anchor1 || select_type == select_anchor2) {
          var point = new b2Vec2(Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
          saveSelectedPoint(point);
          return;
        }
        // try to see if the point is actuallly near a joint and select that instead
        selected_joint = GetJointAtMouse();
        if(selected_joint) {
          showJointOptions();
          selected_shape = false;
          return;
        }
        // otherwise selecting an object for editing
        if(shape) {
          selected_shape = shape;
          var body = shape.GetBody();
          if(body.m_userData.id in emitterBodies) {
            showEmitterOptions(body);
          } else {
            showShapeOptions(shape);
          }
        } else {
          selected_shape = false;
        }
      }
    }
  });
   
  //When mouse button is release, mark pressed as false and delete the mouse joint if it exists
	Event.observe('canvas', 'mouseup', function(e) {
    mouse_pressed = false;
    if(mouse_shape){
        mouse_shape = false;
    }
  });

  // Right click to change worlds
	Event.observe('canvas', 'contextmenu', function(e) {
    /*
    console.log("next");
		if (e.preventDefault) e.preventDefault();
		setupPrevWorld();
		return false;
    */
	});
	step();
});









