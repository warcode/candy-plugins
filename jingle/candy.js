var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.Jingle = (function(self, Candy, $) {
	var _connection = null;

	self.init = function(srv) {
		Candy.Core.Event.addObserver(Candy.Core.Event.KEYS.CHAT, self.ChatObserver);
		_connection = Candy.Core.getConnection();
		_connection.jingle.setServer(srv);
		Candy.View.Event.Roster.onContextMenu = function(args) {
		    return {
		        'video': {
		            requiredPermission: function(user, me) {
		                return me.getNick() !== user.getNick()
		            },
		            'class': 'video',
		            'label': 'Video call',
		            'callback': function(e, roomJid, user) {
		                _connection.jingle.initSession(user.getJid(), 'audioVideo', 'both');
		            }
		        }
		    }
		};

		$('#candy').append('<div id="videos"></div>');
		$('#videos').append('<video width="320" height="240" id="localView" autoplay="autoplay"></video>');
		$('#videos').append('<video width="320" height="240" id="remoteView" autoplay="autoplay"></video>');
		_connection.jingle.setLocalView($('#localView'));
		_connection.jingle.setRemoteView($('#remoteView'));
		$('#videos').css('position', 'absolute');
		$('#remoteView').css('-webkit-transform', 'rotateY(180deg)');
		$('#localView').css('-webkit-transform', 'rotateY(180deg)');

	};

	self.ChatObserver = {
		update: function(obj, args) {
			if(args.type === 'connection') {
				switch(args.status) {
					case Strophe.Status.CONNECTING:
						Candy.Core.addHandler(self.delegateJingleIq, Strophe.NS.JINGLE, 'iq', 'set');
						break;
				}
			}
		}
	};

    self.delegateJingleIq = function(stanza) {
        var action = $(stanza).children('jingle').attr('action');
		console.log(action);
        if (action === 'session-initiate') {
            return _connection.jingle.handleSessionInit(stanza);
		} else if (action === 'session-info') {
			return _connection.jingle.handleSessionInfo(stanza);
        } else if (action === 'session-accept') {
			console.log('AACCEEEPT');
            return _connection.jingle.handleSessionAccept(stanza);
        }       
    };
	
	return self;
}(CandyShop.Jingle || {}, Candy, jQuery));
