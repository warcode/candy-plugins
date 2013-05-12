/*
* candy-avatar-plugin
* @version 0.5 (2013-5-8)
* @author warcode (github.com/warcode)
*
* This plugin shows XMPP avatars next to messages and in the user list.
*/

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.Avatar = (function(self, Candy, $) {
    
    var requested;
    self.init = function(options) {

        requested = {};
        $(Candy.View.Pane).on('candy:view.message.before-show', handleBeforeShow);
        $(Candy.View.Pane).on('candy:view.message.after-show', handleAfterShow);
    };

    var handleBeforeShow = function(e, args) {
        Candy.Core.log('[Avatar] handleBeforeShow');
        var jid = args.roomJid + '/' + args.name;
        var realJid = jid.replace(/[#\w\d]{1,}[@]\w{1,}[.](\w{1,}[.]\w{2,4})\/([\w -]{1,})/, '\$2@\$1');
        Candy.Core.log('[Avatar] realJid : ' + realJid);
        
        var customData = Candy.Core.getUser().getCustomData();
        Candy.Core.log('[Avatar] customData : ');
        Candy.Core.log(customData);

        if(customData['avatar'] == null) { customData['avatar'] = {}; }

        //var avatars = customData['avatar'];
        //avatars[realJid] = '';
        
        //Candy.Core.getUser().setCustomData(customData);

        if(customData['avatar'] == null & requested[realJid] == null) {
            Candy.Core.log('[Avatar] Requesting new VCard');
            Candy.Core.getConnection().send($iq({type: 'get', to: realJid, from: Candy.Core.getUser().getJid()}).c('vCard', {xmlns: 'vcard-temp', version: '2.0'}));
            requested[realJid] = '';
        }
        else {
            Candy.Core.log('[Avatar] Checking if realJid already exists');
            if(customData['avatar'][realJid] == null && requested[realJid] == null) {
                Candy.Core.log('Request new VCard');
                Candy.Core.getConnection().send($iq({type: 'get', to: realJid, from: Candy.Core.getUser().getJid()}).c('vCard', {xmlns: 'vcard-temp', version: '2.0'}));
                requested[realJid] = '';
            }
        }
        
    }

    var handleAfterShow = function(e, args) {
        Candy.Core.log('[Avatar] handleAfterShow');
        var inner = $(args.element).children('div').html();

        var url = '';
        var customData = Candy.Core.getUser().getCustomData();
        Candy.Core.log('[Avatar] customData : ');
        Candy.Core.log(customData);

        if(customData['avatar'] == null) {
            Candy.Core.log('[Avatar] No data exists. Using default.');
            url = 'https://deny.io/chat/default.jpg';
        }
        else {
            
            var jid = args.roomJid + '/' + args.name;
            var realJid = jid.replace(/[#\w\d]{1,}[@]\w{1,}[.](\w{1,}[.]\w{2,4})\/([\w -]{1,})/, '\$2@\$1');
            
            if(customData['avatar'][realJid] == null || customData['avatar'][realJid] == '') {
                url = 'https://deny.io/chat/default.jpg';
            }
            else {
                url = 'data:image/png;base64,' + customData['avatar'][realJid];
            }
        }

        var width = 25;
        var height = 25;
        $(args.element).children('div').html('<span class="avatar"><img src="' + url + '" width="' + width + '" height="' + height + '"/></span>' + inner);
    }

  return self;
}(CandyShop.Replies || {}, Candy, jQuery));
