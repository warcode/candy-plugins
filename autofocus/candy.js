/*
* candy-autofocus-plugin
* @version 0.1 (2013-5-8)
* @author warcode (github.com/warcode)
*
* This plugin puts the focus on the entry box if the user clicks in the message window.
*/

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.Autofocus = (function(self, Candy, $) {
    
    self.init = function(options) {

        $(Candy.View.Pane).on('candy:view.room.after-show', roomAfterShow);
    };

    function roomAfterShow(e, args) {
        $('.message-pane-wrapper').mousedown(function() {
            $('.message-form').children(".field")[0].focus();
            return false;
        });
    }

  return self;
}(CandyShop.Replies || {}, Candy, jQuery));
