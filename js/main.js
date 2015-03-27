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

function setUpCanvas() {
	ctx = $('canvas').getContext('2d');
	var canvasElm = $('canvas');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.style.top);
	canvasLeft = parseInt(canvasElm.style.left);
}

function setUpUI() {
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
}


Event.observe(window, 'load', function() {
    setUpCanvas();
    setUpUI();

    //If mouse is moving over the thing
    Event.observe('canvas', 'mousemove', function(e) {
        canvasMouseMove(e);
    });
   
	Event.observe('canvas', 'mousedown', function(e) {
        canvasMouseDown(e);
    });
   
    //When mouse button is release, mark pressed as false and delete the mouse joint if it exists
    Event.observe('canvas', 'mouseup', function(e) {
        mouse_pressed = false;
        if(mouse_shape){
            mouse_shape = false;
        }
    });

    // Right click to add boxes and balls to scene
	Event.observe('canvas', 'contextmenu', function(e) {
        //if in simulate mode
        if (e.preventDefault) e.preventDefault();
        if (state) {
            if (Math.random() < 0.5) 
                createBall(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, false);
            else 
                createBox(world, Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop, 10, 10, false);
        }
        return false;
	});
	step();
});









