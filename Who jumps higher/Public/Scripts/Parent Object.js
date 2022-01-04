// @input SceneObject camera

var transform = script.getTransform();

var difPos = vec3.zero;
var difRot = quat.zero;

script.createEvent("TouchStartEvent").bind(function(data){
    script.getSceneObject().setParentPreserveWorldTransform(script.camera);
});


script.createEvent("TouchEndEvent").bind(function(data){
    
    difPos = transform.getWorldPosition();
    difRot = transform.getWorldRotation();
    
    script.getSceneObject().removeParent(); 

    transform.setWorldRotation(difRot);
    transform.setWorldPosition(difPos);
});
