function deleteObject() {
    for (var b = world.m_bodyList; b; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            if(s == selected_shape) {
        world.DestroyBody(b);
        //b.Destroy();
        selected_shape = false;
        document.getElementById('editObject').className = 'notSelected';
        return;
      }
        }
    }
}

function deleteEmitter() {
  var body = selected_shape.GetBody();
  var emitter = null;
  for(var i=0; i < emitters.length; i++) {
    if(body.m_userData.id == emitters[i].body.m_userData.id) {
      emitters.splice(i);
      delete emitterBodies[body.m_userData.id];
      break;
    }
  }
  deleteObject();
  document.getElementById('editEmitter').className = 'notSelected';
}

function deleteJoint() {
    for (var j = world.m_jointList; j; j = j.m_next) {
    if(j == selected_joint) {
      world.DestroyJoint(j);
      //j.Destory();
      selected_joint = false;
      document.getElementById('editJoint').className = 'notSelected';
      return;
    }
  }
}
