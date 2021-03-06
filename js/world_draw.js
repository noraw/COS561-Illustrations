function drawWorld(world, context) {
    var fillColor, strokeColor;
    var strokeWidth = '2px';

    for (var b = world.m_bodyList; b; b = b.m_next) {
        var isStatic = b.IsStatic();
        if(b.m_userData.id in emitterBodies) {
            fillColor = '#A66500';
            strokeColor = '#04346C';
            strokeWidth = '15px';
        } else if (isStatic) {
            fillColor = '#FF9C00';
            strokeColor = '#A66500';
        } else {
            fillColor = '#6899D3';
            strokeColor = '#04346C';
        }

        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            if(s == selected_shape) {
                fillColor = '#F55423';
            }
            drawShape(s, fillColor, strokeColor, strokeWidth, context);
        }
    }
    for (var j = world.m_jointList; j; j = j.m_next) {
        drawJoint(j, context);
    }
}

function drawJoint(joint, context) {
    var b1 = joint.m_body1;
    var b2 = joint.m_body2;
    var x1 = b1.m_position;
    var x2 = b2.m_position;
    var p1 = joint.GetAnchor1();
    var p2 = joint.GetAnchor2();

    context.fillStyle = '#FFC973';
    context.strokeStyle = '#FF9C00';
    context.lineWdith = '2px';

    drawCircleOutline(p1, 3, context);
    context.beginPath();
    switch (joint.m_type) {
        case b2Joint.e_distanceJoint:
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            break;

        case b2Joint.e_pulleyJoint:
            // TODO
            break;

        default:
            if (b1 == world.m_groundBody) {
                context.moveTo(p1.x, p1.y);
                context.lineTo(x2.x, x2.y);
            }
            else if (b2 == world.m_groundBody) {
                context.moveTo(p1.x, p1.y);
                context.lineTo(x1.x, x1.y);
            }
            else {
                context.moveTo(x1.x, x1.y);
                context.lineTo(p1.x, p1.y);
                context.lineTo(x2.x, x2.y);
                context.lineTo(p2.x, p2.y);
            }
            break;
    }
    context.stroke();
}

function drawCircleOutline(pos, r, context) {
    context.beginPath();
    var segments = 2*r;
    var theta = 0.0;
    var dtheta = 2.0 * Math.PI / segments;
    // draw circle
    context.moveTo(pos.x + r, pos.y);
    for (var i = 0; i < segments; i++) {
        var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
        var v = b2Math.AddVV(pos, d);
        context.lineTo(v.x, v.y);
        theta += dtheta;
    }
    context.lineTo(pos.x + r, pos.y);
    context.stroke();
    context.fill();
}

function drawShape(shape, fillColor, strokeColor, strokeWidth, context) {
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.lineWdith = strokeWidth;
    context.beginPath();
    switch (shape.m_type) {
        case b2Shape.e_circleShape: {
            var circle = shape;
            var pos = circle.m_position;
            var r = circle.m_radius;
            drawCircleOutline(pos, r, context);
        } break;
        case b2Shape.e_polyShape: {
            var poly = shape;
            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
            context.moveTo(tV.x, tV.y);
            for (var i = 0; i < poly.m_vertexCount; i++) {
                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                context.lineTo(v.x, v.y);
            }
            context.lineTo(tV.x, tV.y);
        } break;
    }
    context.stroke();
    context.fill();
}

