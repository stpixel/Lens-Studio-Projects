// -----JS CODE-----
// @input SceneObject camera
// @input SceneObject level
// @input SceneObject maxReference
// @input Component.Text curText;
// @input Component.Text maxText;


var posCam = script.camera.getTransform().getWorldPosition();
var posLev = script.level.getTransform().getWorldPosition();

diff = posCam.y - posLev.y;

if (maxDif <= diff){
    maxDif = diff;    
    posCam = script.camera.getTransform().getWorldPosition();
    script.maxReference.getTransform().setWorldPosition(posCam);
};
    


print(maxDif);
script.curText.text = diff.toFixed(0).toString();
script.maxText.text = maxDif.toFixed(0).toString();
