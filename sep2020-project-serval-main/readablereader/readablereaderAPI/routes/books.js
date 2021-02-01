const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {url, Users, Book} = require('../database/db');
const uploadsFiles = mongoose.model('uploads.files', new mongoose.Schema({}, {strict:false}))

const {sendStatus} = require('./restFunctions');

let gfs;

module.exports = (upload) => {

	const connection = mongoose.createConnection(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});


	connection.once('open', () => {
		// initialize streama
		// connecting gridFS with db
		gfs = new mongoose.mongo.GridFSBucket(connection.db, {
			bucketName: "uploads"
		});
	});

	router.route('/')
		.post(upload.fields([{
			name: 'file',
			maxCount: 1
		}, {
			name: 'cover',
			maxCount: 1
		}]), async (req, res, next) => {

			if (req.body === undefined) {
				sendStatus(res, 412, "No body present!");
				return;
			}
			if (req.files === undefined) {
				sendStatus(res, 412, "No file present!"); 
				return;
			}

			let newBook;

			let exists = false;
			try {
				// Book document in the db 
				exists = await Book.findOne({filename: req.files.file[0].filename}, {})
			} catch (err) {}

			// Get the size of the saved book
			let fileLength;
			if (exists) fileLength = await uploadsFiles.findById(exists.fileId).lean();
			
			// Check if the book already exists and check if the size is the same
			if (exists && req.files.file[0].size===fileLength['length']) {
				// Delete de book because that just got uploaded
				gfs.delete(new mongoose.Types.ObjectId(req.files.file[0].id), (err, data) => {
					if (err) {
						sendStatus(res, 500, err)
						return;
					}		
				})				

				// Delete de cover because that just got uploaded
				gfs.delete(new mongoose.Types.ObjectId(req.files.cover[0].id), (err, data) => {
					if (err) {
						sendStatus(res, 500, err)
						return;
					}		
				})

				// Reference the old book so that it can be linked
				newBook = exists;
			} else {
				// Create the book object because it doesnt exist
				newBook = new Book({
					metadata: JSON.parse(req.body.metadata),
					filename: req.files.file[0].filename,
					fileId: req.files.file[0].id,
					cover: {
						filename: req.files.cover[0].filename,
						fileId: req.files.cover[0].id
					}
				})
			}

			// Only add the book to the user if its not yet added
			if ((await Users.countDocuments({username: req.body.username, 'books.bookId':newBook._id}).lean())===0) {
				try {
					await Users.updateOne({
						username: req.body.username
					}, {
						$push: {
							books: {
								bookId: newBook._id,
								lastOpened: Date.now(),
								currentLocation: {
									currentPage: 0,
									chapterNumber: 0,
									totalPages: 0
								}
							}
						}
					})
				} catch (err) {
					console.log(err)
				}
			}

			// boekgegevens opslaan
			try {
				// Save the book
				const book = await newBook.save();
				// send the saved book object back
				res.status(200).json({
					success: true,
					book,
				})
			} catch (err) {
				sendStatus(res, 500, err)
			}
		})

	// deletes a book
	router.delete('/:fileId', async (req, res) => {
		const fileId = req.params.fileId;

		let book;

		try {
			book = await Book.findById(fileId);
			if (!book) {
				sendStatus(res, 404);
				return;
			}
		} catch(err) {
			sendStatus(res, 404);
			return;
		}

		// // for some reason it only works like the below and not just `book.fileId`
		// gfs.delete(new mongoose.Types.ObjectId(book.fileId), (err, data) => {
		// 	if (err) {
		// 		sendStatus(res, 500, err)
		// 		return;
		// 	}		
		// 	// sendStatus(res, 200, `File with name "${book.metadata.title}" has been deleted.`)
		// })				
		
		// gfs.delete(new mongoose.Types.ObjectId(book.cover.fileId), (err, data) => {
		// 	if (err) {
		// 		sendStatus(res, 500, err)
		// 		return;
		// 	}		
		// 	// sendStatus(res, 200, `File with name "${book.metadata.title}" has been deleted.`)
		// })

		// await book.delete();

		// await Users.updateMany({'books.bookId': fileId},{$pull: {'books.bookId': fileId}});
		try {
			await Users.updateMany({'books.bookId': fileId},{$pull: {'books': {bookId: fileId}}});
		} catch (err) {
			sendStatus(res, 500);
			return;
		}

		sendStatus(res, 200);
	})


	// epub bestand informatie verkrijgen
	router.get('/file/:fileId', async (req, res) => {
		const fileId = req.params.fileId;
		const bookFileName = await getFilename(Book, fileId);

		gfs.find({
			filename: bookFileName
		}).toArray((err, files) => {

			if (!files[0] || files.length === 0) {
				return sendStatus(res, 404, 'No files available');
			}

			res.status(200).json({
				success: true,
				file: files[0],
			});
		});
	})

	router.get('/:fileId/data', async (req, res) => {
		const fileId = req.params.fileId;

		try {
			const bookData = await Book.findById(fileId);
			sendStatus(res, 200, bookData);
		} catch (err) {
			sendStatus(res, 404);
		}
	})

	// epub epub bestand ophalen.
	router.get('/:fileId', async (req, res) => {
		const fileId = req.params.fileId;
		const bookFileName = await getFilename(Book, fileId);

		streamFile(bookFileName, res);
	});

	router.get('/:fileId/cover', async (req, res) => {
		const fileId = req.params.fileId;
		try {
			const bookCoverName = (await Book.findById(fileId)).cover.filename;
			streamFile(bookCoverName, res);
		} catch(err) {
			return sendStatus(res, 404, 'No files available');
			
		}
	})

	return router;
}

const streamFile = (filename, res) => {
	gfs.find({
		filename: filename
	}).toArray((err, files) => {
		if (!files[0] || files.length === 0) {
			return sendStatus(res, 404, 'No files available');
		}
		gfs.openDownloadStreamByName(filename).pipe(res);
	});
}

const getFilename = async (Book, fileId) => {
	try {
		return (await Book.findById(fileId)).filename;
	} catch (err) {
		return "";
	}
}
