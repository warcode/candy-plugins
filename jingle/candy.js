var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.Jingle = (function(self, Candy, $) {
	var _connection = null;

	self.init = function(srv) {
		self.applyTranslations();
		
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
						Candy.View.Pane.Chat.Modal.show($.i18n._('calling'), false, true);
		                _connection.jingle.initSession(user.getJid(), 'audioVideo', 'both', function() {
							Candy.View.Pane.Chat.Modal.hide();
						});
		            }
		        }
		    }
		};

		$('#candy').append('<div id="videos">' 
					+ '<video width="140" height="100" id="localView" autoplay="autoplay"></video>'
					+ '<video width="230" height="150" id="remoteView" autoplay="autoplay"></video>'
					+ '</div>');
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
		var action = $(stanza).children('jingle').attr('action');
		if (action === 'session-initiate') {
			var from = $(stanza).attr('from'),
				nickname = Candy.Core.getRoom(Candy.View.getCurrent().roomJid).getRoster().get(from).getNick();
			Candy.View.Pane.Chat.Modal.show(Mustache.to_html(self.Template.callConfirm, {
				_label: $.i18n._('labelCallConfirm', [nickname]),
				_labelYes: $.i18n._('labelYes'),
				_labelNo: $.i18n._('labelNo')
			}));
			$('#chat-modal').on('click', '#call-confirm-yes', function(e) {
				$('#videos').addClass('active');
				Candy.View.Pane.PrivateRoom.open(from, nickname, true, false);
				Candy.View.Pane.Room.getPane(Candy.View.getCurrent().roomJid, '.message-pane').addClass('video');
				_connection.jingle.handleSessionInit(stanza);

				Candy.View.Pane.Chat.Modal.show($.i18n._('calling'), false, true);
				return false;
			});
			$('#chat-modal').on('click', '#call-confirm-no', function(e) {
				Candy.View.Pane.Chat.Modal.hide();
				return false;
			});
		} else {
			_connection.jingle.handle(stanza);
			if (action === 'session-accept') {
				Candy.View.Pane.Chat.Modal.hide();
			} else if (action === 'session-terminate') {
				Candy.View.Pane.Chat.Modal.show($.i18n._('callTerminated'), true);
			}
		}
		return true;
	};
	
	self.applyTranslations = function() {
		Candy.View.Translation.en.labelCallConfirm = '"%s" want\'s a video call with you, accept?';
		Candy.View.Translation.en.labelYes = 'Yes';
		Candy.View.Translation.en.labelNo = 'No';
		Candy.View.Translation.en.calling = 'Establishing video call...';
		Candy.View.Translation.en.callTerminated = 'Recipient terminated the call.';
	};
	
	
	self.Template = {
		callConfirm: '<strong>{{_label}}</strong>'
			+ '<p><button class="button" id="call-confirm-yes">{{_labelYes}}</button> '
			+ '<button class="button" id="call-confirm-no">{{_labelNo}}</button></p>'
	};
	
	return self;
}(CandyShop.Jingle || {}, Candy, jQuery));
