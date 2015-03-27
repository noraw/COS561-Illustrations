
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


function canvasMouseMove(e) {
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
}

function mouseAddJointClicks(shape, point) {
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
        return true;
    // if you are picking a point for the anchor for the joint
    } else if (select_type == select_anchor1 || select_type == select_anchor2) {
        saveSelectedPoint(point);
        return true;
    }
    return false;
}


function canvasMouseDown(e) {
    var shape = GetShapeAtMouse();
    var point = new b2Vec2(Event.pointerX(e) - canvasLeft, Event.pointerY(e) - canvasTop);
    //if in simulate mode
    if (state) {
        // if can move the selected object around
        mouse_pressed = true;
        if(shape) {
            mouse_shape = shape;
            mouse_old_position = point;
        }
    // if in edit mode
    } else {
        // if can move the selected object around
        if(moveObjects) {
            mouse_pressed = true;
            if(shape) {
                mouse_shape = shape;
                mouse_old_position = point;
            }
        // highlights the selected object
        } else {
            if(mouseAddJointClicks(shape, point)) return;
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
}
