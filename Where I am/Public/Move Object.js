// @input float swipeSensitivity;

    var transform = script.getTransform();
    var pos = transform.getWorldPosition();
    var rootPos = transform.getWorldPosition();

// Setup Touch gestures
var touched = false;
var touchPos = vec2.zero();

script.createEvent("TouchStartEvent").bind(function(data){
    
    rootPos = transform.getWorldPosition();
    
    touchPos = data.getTouchPosition();
    pos = transform.getWorldPosition();
    touched = true;
});

script.createEvent("TouchMoveEvent").bind(function(data) {
    if (!touched) {
        return;
    }
    var movePos = data.getTouchPosition();
    var delta = movePos.x - touchPos.x;
 
    transform.setWorldPosition(new vec3(0, 0, pos.z - delta * script.swipeSensitivity));

});

script.createEvent("TouchEndEvent").bind(function(data){

});
