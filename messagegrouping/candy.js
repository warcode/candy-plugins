/*
* candy-messagegrouping-plugin
* @version 0.1 (2013-5-8)
* @author warcode (github.com/warcode)
*
* This plugin groups messages from the same person.
*/

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.MessageGrouping = (function(self, Candy, $) {
    
    self.init = function(options) {

        $(Candy.View.Pane).on('candy:view.message.before-show', handleBeforeShow);
        $(Candy.View.Pane).on('candy.view.message.before-render', handleBeforeRender);
        $(Candy.View.Pane).on('candy:view.message.after-show', handleAfterShow);
        
    };

    var handleBeforeShow = function(e, args) {

        //var jid = args.roomJid + '/' + args.name;
        //var realJid = jid.replace(/[\w\d]{1,}[@]\w{1,}[.](\w{1,}[.]\w{2,4})\/([\w -]{1,})/, '\$2@\$1');
        //Candy.Core.getConnection().send($iq({type: 'get', to: realJid, from: Candy.Core.getUser().getJid()}).c('vCard', {xmlns: 'vcard-temp', version: '2.0'}));
    }

    var handleBeforeRender = function(e, args) {
        Candy.Core.log(args.template);
        Candy.Core.log(args.templateData);
    }

    var handleAfterShow = function(e, args) {
        Candy.Core.log($(args.element).children('#div'));
        if(args.name == $(args.element).children('#div').previous[args.element.previous.length-1].name) {
            args.name = '';
        }


        //var inner = $(args.element).children('div').html();

        //var width = 25;
        //var height = 25;
        //$(args.element).children('div').html('<span class="avatar"><img src="' + url + '" width="' + width + '" height="' + height + '"/></span>' + inner);
    }

  return self;
}(CandyShop.MessageGrouping || {}, Candy, jQuery));
