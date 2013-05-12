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
                case '/join':
                    if(match[1] != null) { commandJoin(match[1]); }
                    break;
                case '/topic':
                    if(match[1] != null) { commandTopic(match[1]); }
                    break;
                case '/ban':
                    var reason = '';
                    if(match[2] != null) { reason = match[2]; }
                    commandBan(match[1], reason);
                    break;
                case '/kick':
                    var reason = '';
                    if(match[2] != null) { reason = match[2]; }
                    commandKick(match[1], reason);
                    break;
                default:
                    args.message = args.message;
            }

            function commandClear() {
                try {
                    // find the visible room, and empty the panel
                    $('.room-pane').filter(':visible').find('.message-pane').empty();
                } catch (e) {
                }
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

            function commandBan(user, reason) {
                //roomJid, userJid, type, reason
                var roomJid = '';
                var userJid = '';
                Candy.Core.Action.Jabber.Room.Admin.UserAction(roomJid, userJid, 'ban', reason);
            }

            function commandKick(user, reason) {
                var roomJid = '';
                var userJid = '';
                Candy.Core.Action.Jabber.Room.Admin.UserAction(roomJid, userJid, 'kick', reason);
            }
    }

  return self;
}(CandyShop.Replies || {}, Candy, jQuery));
