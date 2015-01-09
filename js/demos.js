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
var mouse_x, mouse_y;
var selected_shape = false;

var density = 1.0;
var restitution = 0.8;
var friction = 0.3;


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
	  var timeStep = 1.0/60;
	  var iteration = 1;
	  world.Step(timeStep, iteration);
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

function UpdateJointPosition(body) {
	for (var j = world.m_jointList; j; j = j.m_next) {
    var b1 = j.GetBody1();
    var b2 = j.GetBody2();
    if(b1 == body) {
      j.m_localAnchor2.x = body.m_position.x;
      j.m_localAnchor2.y = body.m_position.y;
    } else if(b2 == body) {
      j.m_localAnchor1.x = body.m_position.x;
      j.m_localAnchor1.y = body.m_position.y;
    }
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
  /*
	Event.observe('canvas', 'click', function(e) {
    console.log("click");
		//setupNextWorld();
    if ( !state ) return;
		if (Math.random() < 0.5) 
			demos.top.createBall(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
		else 
			createBox(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, 10, false);
	});
  */
  //If mouse is moving over the thing
  Event.observe('canvas', 'mousemove', function(e) {
	//Event.observe('canvas', 'mousemove', function(e) {
    var p = new b2Vec2(Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
     
    mouse_x = p.x;
    mouse_y = p.y;
     
    if(mouse_pressed && mouse_shape) {
      mouse_shape.m_position = p;
      var shape = mouse_shape;
      var body = mouse_shape.GetBody();
      var rotation = body.GetRotation();
      body.SetCenterPosition(p, rotation);
      body.SetOriginPosition(p, rotation);
      UpdateJointPosition(body);
    }
  });
   
	Event.observe('canvas', 'mousedown', function(e) {
    console.log("down");
    //flag to indicate if mouse is pressed or not
    if (state) {
		  if (Math.random() < 0.5) 
			  createBall(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, false);
		  else 
			  createBox(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, 10, false);
    } else {
      if(moveObjects) {
        mouse_pressed = true;
        var shape = GetShapeAtMouse();
        if(shape) {
          mouse_shape = shape;
        }
      } else {
        var shape = GetShapeAtMouse();
        if(shape) {
          var body = shape.GetBody();
          selected_shape = shape;
          if(body.IsStatic()) {
            document.getElementById('fixObject').value = 'UnFix';
          } else {
            document.getElementById('fixObject').value = 'Fix';
          }
        } else {
          selected_shape = false;
        }
      }
    }
  });
   
  //When mouse button is release, mark pressed as false and delete the mouse joint if it exists
	Event.observe('canvas', 'mouseup', function(e) {
    console.log("up");
    mouse_pressed = false;
    if(mouse_shape){
        mouse_shape = false;
    }
  });

  // Right click to change worlds
	Event.observe('canvas', 'contextmenu', function(e) {
    console.log("click");
    /*
    console.log("next");
		if (e.preventDefault) e.preventDefault();
		setupPrevWorld();
		return false;
    */
	});
	step();
});

