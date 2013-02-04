/*
 * JQuery.Swipe.js
 * author: Branko Sekulic
 *
 * Detecting if scroll is horizontal or vertical, and calculating deltaX.
 * Event object is enhanced with two additional params:
 *  e.isScrolling - true is scroll is vertical
 *  e.deltaX - difference between start and end X coordinate
 *
 * @example:
 * $('#swipe-area').on('touchstart', function(e){
 *      // do some initialization here
 * });
 *
 * $('#swipe-area').on('touchmove', function(e){
 *      console.log(e.isScrolling);
 *      console.log(e.deltaX);
 * });
 *
 * $('#swipe-area').on('touchend', function(e){
 *      console.log(e.isScrolling);
 *      console.log(e.deltaX);
 * });
 *
 * Copyright Vast.com
 */
(function($) {

    var events = ['touchstart', 'touchmove', 'touchend'],
        Swipe  = function() {};

    Swipe.prototype = {

        touchstart: function(e) {

            var originalEvent = e.originalEvent;

            this.start = {
                // get touch coordinates for delta calculations in onTouchMove
                pageX: originalEvent.touches[0].pageX,
                pageY: originalEvent.touches[0].pageY,
                // set initial timestamp of touch sequence
                time: Number( new Date() )
            };

            // used for testing first onTouchMove event
            this.isScrolling = undefined;
            // reset deltaX
            this.deltaX = 0;

            e.isScrolling = this.isScrolling;
            e.deltaX = this.deltaX;

            return e;
        },

        touchmove: function(e) {

            var originalEvent = e.originalEvent;

            // ensure swiping with one touch and not pinching
            if(originalEvent.touches.length > 1 || originalEvent.scale && originalEvent.scale !== 1) return;

            this.deltaX = originalEvent.touches[0].pageX - this.start.pageX;

            // determine if scrolling test has run - one time test
            if ( typeof this.isScrolling == 'undefined') {
                this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(originalEvent.touches[0].pageY - this.start.pageY) );
            }

            e.isScrolling = this.isScrolling;
            e.deltaX = this.deltaX;

            return e;
        },

        touchend: function(e) {

            e.isScrolling = this.isScrolling;
            e.deltaX = this.deltaX;

            return e;
        }
    };

    $.each(events, function(i, value){

        $.event.special[value] = {

            add: function( handleObj ) {

                var $target = $(this),
                    swipe = $target.data('swipe'),
                    old_handler,
                    new_handler;

                // Allpying Swipe instance to element
                if(!swipe){
                    swipe = new Swipe();
                    $target.data('swipe', swipe);
                }

                // This will reference the bound event handler.
                old_handler = handleObj.handler;
                new_handler = function(event) {
                    // Modify event object here!
                    event = swipe[value](event);
                    // Call the originally-bound event handler and return its result.
                    return old_handler.apply( this, arguments );
                };

                handleObj.handler = new_handler;
            }
        };
    });
})(jQuery);