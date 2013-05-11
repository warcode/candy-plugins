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

        $(Candy.View.Pane).on('candy:view.message.after-show', handleAfterShow);
        $(Candy.View.Pane).on('view.roster.after-update', handleRosterAfterUpdate);
    };

    var handleAfterShow = function(e, args) {

        var inner = $(args.element).children('div').html();

        var url = '';
        var customData = Candy.Core.getUser().getCustomData();
        if(customData['avatar'] == null) {
            url = 'https://deny.io/chat/default.jpg';
        }
        else {
            url = 'data:image/png;base64,' + customData['avatar'][args.name+'@deny.io'];
            Candy.Core.log(args.message);
        }

        var width = 25;
        var height = 25;
        $(args.element).children('div').html('<span class="avatar"><img src="' + url + '" width="' + width + '" height="' + height + '"/></span>' + inner);
  };

  var handleRosterAfterUpdate = function(e, args) {
      Candy.Core.log(args.user);
      Candy.Core.getConnection().send($iq({type: 'get', to: args.user + '@deny.io', from: Candy.Core.getUser().getJid()}).c('vCard', {xmlns: 'vcard-temp', version: '2.0'}));

  };

  return self;
}(CandyShop.Replies || {}, Candy, jQuery));
