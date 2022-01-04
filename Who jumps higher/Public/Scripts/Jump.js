// -----JS CODE-----
// @input SceneObject camera


var transform = script.getTransform();
var pos = transform.getWorldPosition();

script.createEvent("TouchStartEvent").bind(function(data){
    posCam = script.camera.getTransform().getWorldPosition();
    transform.setWorldPosition(posCam);
    maxDif = 0;
});


