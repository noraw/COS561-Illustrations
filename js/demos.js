var initId = 0;
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var state = false; // `true` when the simulation is running
var time_last_run;
var mouse_pressed = false;
var mouse_shape = false;
var mouse_x, mouse_y;

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

function GetShapeAtMouse(includeStatic) {
    var mouse_p = new b2Vec2(mouse_x, mouse_y);
     
    var aabb = new b2AABB();
    aabb.minVertex.Set(mouse_x - 0.001, mouse_y - 0.001);
    aabb.maxVertex.Set(mouse_x + 0.001, mouse_y + 0.001);
     
    var body = null;
     
    // Query the world for overlapping shapes.
    function GetBodyCallback(fixture) {
        var shape = fixture.GetShape();
         
        if (fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic) {
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);
             
            if (inside) {
                body = fixture.GetBody();
                return false;
            }
        }
         
        return true;
    }
    var shapes = new Array();
    world.Query(aabb, shapes, 1);
    return shapes[0];
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
      console.log("move: " + p.x + ", " + p.y);
      mouse_shape.m_position = p;
      var body = mouse_shape.GetBody();
      body.SetCenterPosition(p, 0);
    }
/*
        //if joint exists then create
        var def = new b2MouseJointDef();
         
        def.body1 = world.GetGroundBody();;
        def.body2 = body;
        def.target = p;
         
        def.collideConnected = true;
        def.maxForce = 1000;// * body.GetMass();
        def.dampingRatio = 0;
         
        mouse_joint = world.CreateJoint(def);
         
        body.WakeUp();
      }
*/
    /*
    if(mouse_joint) {
        mouse_joint.SetTarget(p);
    }*/
  });
   
	Event.observe('canvas', 'mousedown', function(e) {
    console.log("down");
    //flag to indicate if mouse is pressed or not
    mouse_pressed = true;
    var shape = GetShapeAtMouse();
    if(shape) {
      mouse_shape = shape;
    }
  });
   
  /*
      When mouse button is release, mark pressed as false and delete the mouse joint if it exists
  */
	Event.observe('canvas', 'mouseup', function(e) {
    console.log("up");
    mouse_pressed = false;
    if(mouse_shape){
        mouse_shape = false;
    }
  });

  /* Right click to change worlds
	Event.observe('canvas', 'contextmenu', function(e) {
    console.log("next");
		if (e.preventDefault) e.preventDefault();
		setupPrevWorld();
		return false;
	});
  */
	step();
});

document.getElementById( 'startStop' ).addEventListener('click', function() {
        if ( this.innerHTML === 'Start' ) {
            this.innerHTML = 'Stop';
            time_last_run = (new Date()).getTime();
            state = true;
        } else {
            this.innerHTML = 'Start';
            state = false;
        }
    }
)
