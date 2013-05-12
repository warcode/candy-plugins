/*
* candy-slashcommand-plugin
* @version 0.1 (2013-5-8)
* @author warcode (github.com/warcode)
*
* This plugin shows XMPP avatars next to messages and in the user list.
*/

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.SlashCommand = (function(self, Candy, $) {
    
    self.init = function(options) {

        $(Candy.View.Pane).on('candy:view.message.before-send', handleBeforeSend);
    };

    var handleBeforeSend = function(e, args) {
            // (strip colors)
            // if it matches '/clear', clear the chat window and don't send anything
            var command = args.message.replace(/\|c:\d+\|/, '').toLowerCase();
            
            var regexp = /^(\/[\w]{1,})[ ]?([\w]{1,})?$/g;
            var match = regexp.exec(command);
            
            switch(match[0]) {
                case '/clear':
                    commandClear();
                    break;
                case '/join'
                    commandJoin(match[1]);
                    break;
                case '/topic'
                    commandTopic(match[1]);
            }

            function commandClear() {
                self.clearCurrentTab();
                args.message = '';
            }

            function commandJoin(room) {
                Candy.Core.Action.Jabber.Room.Join(room);
                args.message = '';
            }

            function commandTopic(topic) {
                //Verify that the user is a moderator before calling
                Candy.Core.Action.Jabber.Room.Admin.SetSubject('public@conference.deny.io', topic);
            }
    }

  return self;
}(CandyShop.Replies || {}, Candy, jQuery));
