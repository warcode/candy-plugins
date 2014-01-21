/*
* candy-avatar-plugin
* @version 0.5 (2013-5-8)
* @author warcode (github.com/warcode)
*
* This plugin shows XMPP avatars next to messages and in the user list.
*/

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.Avatar = (function(self, Candy, $) {
    
    var defaultAvatarData = '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';



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
            url = 'data:image/png;base64,' + defaultAvatarData;
        }
        else {
            
            var jid = args.roomJid + '/' + args.name;
            var realJid = jid.replace(/[#\w\d]{1,}[@]\w{1,}[.](\w{1,}[.]\w{2,4})\/([\w -]{1,})/, '\$2@\$1');
            
            if(customData['avatar'][realJid] == null || customData['avatar'][realJid] == '') {
                url = 'data:image/png;base64,' + defaultAvatarData;
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
}(CandyShop.Avatar || {}, Candy, jQuery));
