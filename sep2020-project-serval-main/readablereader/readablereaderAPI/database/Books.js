const mongoose = require('mongoose');
const Users = require('./Users.js');

const book_schema = new mongoose.Schema({
	metadata: {
		type: Object
	},
	cover: {
		filename: {
			type: String
		},
		fileId: {
			type: String
		}
	},
	filename: {
		// required: true,
		type: String,
	},
	fileId: {
		// required: true,
		type: String,
	},
	createdAt: {
		default: Date.now(),
		type: Date,
	},
})

book_schema.methods.delete = async function (cb) {
	this.remove();

	const bookId = this._id;

	const usersWithBook = await Users.find({
		books: new mongoose.Types.ObjectId(bookId)
	}, {
		books: 1,
		_id: 1
	});

	for (const user of usersWithBook) {
		await Users.updateOne({
			_id: new mongoose.Types.ObjectId(user._id)
		}, {
			$pull: {
				books: new mongoose.Types.ObjectId(bookId)
			}
		})
	}
}

const Book = mongoose.model('Books', book_schema);

module.exports = Book;