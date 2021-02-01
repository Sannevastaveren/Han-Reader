const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users_schema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	books: [{
		bookId: {
			type: Schema.Types.ObjectId,
			ref: 'Books',
		},
		currentLocation: {
			currentPage: {
				type: Number,
				default: 0
			},
			chapterNumber: {
				type: Number,
				default: 0
			},
			totalPages: {
				type: Number,
				default: 0
			},
			epubcfi: {
				type: String,
				default: ""
			}
		},
		lastOpened: {
			default: Date.now(),
			type: Date
		},
	}],
  pin: {
        type: String,
        default: 'none'
  },
	google: {
		type: Boolean,
		default: false
	},
	googleUserId: {
		type: String
	},
	readingMethod: {
		type: String,
		default: 'scrolled'
	},
	textToSpeech: {
		tts: {
			type: Boolean,
			default: false
		},
		ttsRate: {
			type: Number,
			default: 0.8
		},
	},
	preferences: {
		backgroundColor: {
			type: String,
			default: 'white'
		},
		fontColor: {
			type: String,
			default: 'black'
		},
		fontFamily: {
			type: String,
			default: 'Arial'
		},
		fontSize: {
			type: Number,
			default: 40
		},
		letterSpacing: {
			type: Number,
			default: 2
		},
		lineHeight: {
			type: Number,
			default: 2
		}
	}
})

const Users = mongoose.model('Users', users_schema);

module.exports = Users;
