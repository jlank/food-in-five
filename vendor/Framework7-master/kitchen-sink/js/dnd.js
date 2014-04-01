// http://jqueryui.com/droppable/#default
$(function() {
  $( "#draggable" ).draggable();
  $( "#droppable" ).droppable({
    drop: function( event, ui ) {
      $( this )
        .addClass( "ui-state-highlight" )
        .find( "p" )
          .html( "Dropped!" );
          console.log('dropped');
    }
  });
});

// http://jsfiddle.net/529KH/
$(function() {
  var w_height = $(window).height();
  var w_width = $(window).width();
  console.log({"height": w_height, "width": w_width });
  var rest = [ {"name": "Circa", "img": "http://www.circaatfoggybottom.com/media/images/photos/DSC_8863.jpg"},
               {"name": "Ted's Bulletin", "img": "https://lh4.googleusercontent.com/-1QyWMN6ripk/Ur_EXqkG6_I/AAAAAADDzpw/t7NJwf25YAk/s203/photo.jpg"}]

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }

  var do_the_drag = function (div_id) {
    //var $d = $("#draggable");
    var $d = $("#" + div_id);

    var x1, x2,
        y1, y2,
        t1, t2;  // Time

    var minDistance = 40; // Minimum px distance object must be dragged to enable momentum.

    var onMouseMove = function(e) {
        var mouseEvents = $d.data("mouseEvents");
        if (e.timeStamp - mouseEvents[mouseEvents.length-1].timeStamp > 40) {
            mouseEvents.push(e);
            if (mouseEvents.length > 2) {
                mouseEvents.shift();
            }
        }
    }

    var onMouseUp = function() {
        $(document).unbind("mousemove mouseup");
    }

    $d.draggable({
        start: function(e, ui) {
            $d.data("mouseEvents", [e]);
            $(document)
                .mousemove(onMouseMove)
                .mouseup(onMouseUp);
        },
        stop: function(e, ui) {
            $d.stop();
            $d.css("text-indent", 100);

            var lastE = $d.data("mouseEvents").shift();

            x1 = lastE.pageX;
            y1 = lastE.pageY;
            t1 = lastE.timeStamp;
            x2 = e.pageX;
            y2 = e.pageY;
            t2 = e.timeStamp;

            // Deltas
            var dX = x2 - x1,
                dY = y2 - y1,
                dMs = Math.max(t2 - t1, 1);

            // Speeds
            var speedX = Math.max(Math.min(dX/dMs, 1), -1),
                speedY = Math.max(Math.min(dY/dMs, 1), -1);

            // Distance moved (Euclidean distance)
            var distance = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));

            if (distance > minDistance) {
                // Momentum
                var lastStepTime = new Date();
                $d.animate({ textIndent: 0 }, {
                    duration: Math.max(Math.abs(speedX), Math.abs(speedY)) * 900,
                    step: function(currentStep){
                        speedX *= (currentStep / 80);
                        speedY *= (currentStep / 80);

                        console.log($d.position());
                        if (Math.max(Math.abs(speedX), Math.abs(speedY)) * 900 === 0) {
                          console.log('its over!');
                          $('.food_title').text(rest.pop().name)
                          var id = makeid();
                          $('.food_images').append('<div id="drag' + id + '" class="ui-draggable food_circle"></div>');

                          $("#" + div_id).remove();
                          do_the_drag('drag' + id);
                        }
                        var now = new Date();
                        var stepDuration = now.getTime() - lastStepTime.getTime();

                        lastStepTime = now;

                        var position = $d.position();

                        var newLeft = (position.left + (speedX * stepDuration / 4)),
                            newTop = (position.top + (speedY * stepDuration / 4));

                        $d.css({
                            left: newLeft+"px",
                            top: newTop+"px"
                        });
                    }
                });
            }
        }
    });
  }
  do_the_drag('draggable');
});
