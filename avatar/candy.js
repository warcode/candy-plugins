/*
* candy-avatar-plugin
* @version 0.1 (2013-5-8)
* @author warcode (github.com/warcode)
*
* This plugin shows XMPP avatars next to messages and in the user list.
*/

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.Avatar = (function(self, Candy, $) {

  self.init = function(options) {

    $(Candy.View.Pane).on('candy:view.message.before-show', handleBeforeShow);
  };

  var handleBeforeShow = function(e, args) {
        var message = args.message;
        args.message = processed;
        return processed;
  };

  return self;
}(CandyShop.Replies || {}, Candy, jQuery));