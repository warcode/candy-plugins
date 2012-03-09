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
		                return me.getNick() !== user.getNick() && !Candy.Core.getRoom(Candy.View.getCurrent().roomJid);
		            },
		            'class': 'video',
		            'label': 'Video call',
		            'callback': function(e, roomJid, user) {
						Candy.View.Pane.Room.getPane(Candy.View.getCurrent().roomJid, '.message-pane').addClass('video');
						$('#videos').addClass('active');
		                _connection.jingle.initSession(user.getJid(), 'audioVideo', 'both');
		            }
		        }
		    }
		};

		$('#candy').append('<ul id="videos">' 
					+ '<li><video width="320" height="240" id="localView" autoplay="autoplay"></video></li>'
					+ '<li><video width="320" height="240" id="remoteView" autoplay="autoplay"></video></li>'
					+ '</ul>');
		_connection.jingle.setLocalView($('#localView'));
		_connection.jingle.setRemoteView($('#remoteView'));
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
		if (action === 'session-initiate') {
			$('#videos').addClass('active');
			Candy.View.Pane.PrivateRoom.open($(stanza).attr('from'), Strophe.getResourceFromJid($(stanza).attr('from')), true, false);
			Candy.View.Pane.Room.getPane(Candy.View.getCurrent().roomJid, '.message-pane').addClass('video');
			_connection.jingle.handleSessionInit(stanza);
		} else {
			_connection.jingle.handle(stanza);
		}
		return true;
	};
	
	return self;
}(CandyShop.Jingle || {}, Candy, jQuery));
