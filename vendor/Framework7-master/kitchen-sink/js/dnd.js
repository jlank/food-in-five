// http://jqueryui.com/droppable/#default
$(function() {
/* to prevent scrolling
  document.ontouchstart = function(e){
      e.preventDefault();
  }
*/
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
        //$(document).unbind("mousemove mouseup");
        $($d).unbind("mousemove mouseup");
    }

    $d.draggable({
        start: function(e, ui) {
            $d.data("mouseEvents", [e]);
            $($d)
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
                          var new_spot = rest.pop();
                          $('.food_title > p').text(new_spot.name)
                          var id = makeid();
                          $('.food_images').append('<div id="drag' + id + '" class="ui-draggable food_circle"></div>');
                          $('.food_circle').css("background-image", "url(" + new_spot.img + ")");

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

// http://stackoverflow.com/questions/2890361/disable-scrolling-in-an-iphone-web-application
// breaks scrolling
(function registerScrolling($) {
    var prevTouchPosition = {},
        scrollYClass = 'scroll-y',
        scrollXClass = 'scroll-x',
        searchTerms = '.' + scrollYClass + ', .' + scrollXClass;

    $('body').on('touchstart', function (e) {
        var $scroll = $(e.target).closest(searchTerms),
            targetTouch = e.originalEvent.targetTouches[0];

        // Store previous touch position if within a scroll element
        prevTouchPosition = $scroll.length ? { x: targetTouch.pageX, y: targetTouch.pageY } : {};
    });

$('body').on('touchmove', function (e) {
    var $scroll = $(e.target).closest(searchTerms),
        targetTouch = e.originalEvent.targetTouches[0];

    if (prevTouchPosition && $scroll.length) {
        // Set move helper and update previous touch position
        var move = {
            x: targetTouch.pageX - prevTouchPosition.x,
            y: targetTouch.pageY - prevTouchPosition.y
        };
        prevTouchPosition = { x: targetTouch.pageX, y: targetTouch.pageY };

        // Check for scroll-y or scroll-x classes
        if ($scroll.hasClass(scrollYClass)) {
            var scrollHeight = $scroll[0].scrollHeight,
                outerHeight = $scroll.outerHeight(),

                atUpperLimit = ($scroll.scrollTop() === 0),
                atLowerLimit = (scrollHeight - $scroll.scrollTop() === outerHeight);

            if (scrollHeight > outerHeight) {
                // If at either limit move 1px away to allow normal scroll behavior on future moves,
                // but stop propagation on this move to remove limit behavior bubbling up to body
                if (move.y > 0 && atUpperLimit) {
                    $scroll.scrollTop(1);
                    e.stopPropagation();
                } else if (move.y < 0 && atLowerLimit) {
                    $scroll.scrollTop($scroll.scrollTop() - 1);
                    e.stopPropagation();
                }

                // If only moving right or left, prevent bad scroll.
                if(Math.abs(move.x) > 0 && Math.abs(move.y) < 3){
                  e.preventDefault()
                }

                // Normal scrolling behavior passes through
            } else {
                // No scrolling / adjustment when there is nothing to scroll
                e.preventDefault();
            }
        } else if ($scroll.hasClass(scrollXClass)) {
            var scrollWidth = $scroll[0].scrollWidth,
                outerWidth = $scroll.outerWidth(),

                atLeftLimit = $scroll.scrollLeft() === 0,
                atRightLimit = scrollWidth - $scroll.scrollLeft() === outerWidth;

            if (scrollWidth > outerWidth) {
                if (move.x > 0 && atLeftLimit) {
                    $scroll.scrollLeft(1);
                    e.stopPropagation();
                } else if (move.x < 0 && atRightLimit) {
                    $scroll.scrollLeft($scroll.scrollLeft() - 1);
                    e.stopPropagation();
                }
                // If only moving up or down, prevent bad scroll.
                if(Math.abs(move.y) > 0 && Math.abs(move.x) < 3){
                  e.preventDefault();
                }

                // Normal scrolling behavior passes through
            } else {
                // No scrolling / adjustment when there is nothing to scroll
                e.preventDefault();
            }
        }
    } else {
        // Prevent scrolling on non-scrolling elements
        e.preventDefault();
    }
});
})(jQuery);
