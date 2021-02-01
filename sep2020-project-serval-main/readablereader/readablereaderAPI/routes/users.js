const express = require('express');
const {userMessage} = require("../functions/websocket");
const router = express.Router();

const CLIENT_ID = require('../database/config').client_id;
const {OAuth2Client} = require('google-auth-library');

const {
    Users
} = require('../database/db');

const {sendStatus} = require('./restFunctions');

module.exports = (upload) => {

    router.post('/', upload.none(), async (req, res) => {

        try {

            await Users.insertMany({
                username: req.body.username,
                pin: req.body.pin,
                google: req.body.google,
                googleUserId: req.body.googleUserId
            })

            sendStatus(res, 200);
        } catch (err) {
            sendStatus(res, 500, err);
        }
    })

    router.get('/:USER', async (req, res) => {

        const user = await Users.findOne({
                username: req.params.USER
            },
            {
                _id: 0,
                username: 1,
                google: 1,
                pin: 1,
                googleUserId: 1
            }).lean()

        if (user != undefined) {
            // put username into the session
            req.session.username = req.params.USER
            res.send({success: true, ...user});
        } else {
            sendStatus(res, 404, "User not found");
        }
	})

	router.put('/:USER/pin', upload.none(), async (req, res) => {

        try {
            if (!req.body.pin) throw new Error("No new pin found in body");

            await Users.updateOne({
                username: req.params.USER
            }, {
                pin: req.body.pin
            })

            res.send(200, {success: true, message: "Update successful"});
        } catch (err) {
            res.send(500, {success: false, message: err.message})
        }

    })

    router.post('/googlesignin', async (req, res) => {
        const token = req.query.idtoken;

        if (!token) sendStatus(res, 412, "Token is missing")

        const client = new OAuth2Client(CLIENT_ID);

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            });
            const payload = ticket.getPayload();

            return payload;
        }

        try {
            const verified = await verify();

            if (!verified) sendStatus(res, 500);

            const userExists = await getGoogleUser(verified.sub);

            if (userExists) {
                // login
                sendStatus(res, 200, "Logged in succesfully");
            } else {
                // create
                new Users({
                    username: getUsernameFromEmail(verified.email),
                    google: true,
                    googleUserId: verified.sub
                }).save();
                sendStatus(res, 200, "Created a new account");
            }

        } catch (err) {
            sendStatus(res, 500, err);
        }
        ;

    })

    router.get('/:USER/books', async (req, res) => { //gets all user's books

		const reqLimit = req.query.limit;
		const limit = (reqLimit!==undefined && reqLimit.match(/^\d+$/)) ? {books: {$slice: parseInt(reqLimit)}} : {};

		try {
			// const booksdb = (await Users.findOne({
			// 	username: req.params.USER
			// },{'books._id': 0, "books": {$slice: 1}}, {$sort: {'books.lastOpened': -1 } } ).populate('books.bookId').slice('books', 5).lean()).books

			const booksdb = (await Users.findOne({
				username: req.params.USER
			},{'books._id': 0} ).populate('books.bookId').lean()).books

			// niet werkend.
			// const booksdb = (await Users.aggregate([
			// {
			// 	$match: {
			// 		username: req.params.USER
			// 	}
			// },{
			// 	$project: {
			// 		'books': 1
			// 	}
			// },{
			// 	$lookup: {
			// 		from: "books",
			// 		localField: "books.bookId",
			// 		foreignField: "_id",
			// 		as: 'books.bookId'
			// 	}
			// }, {
			// 	$project: {
			// 		'books.currentLocation': '$books.currentLocation',
			// 		'books.bookId': {
            //             $arrayElemAt: ['$books.bookId', 0]
            //         }
			// 	}
			// }]))[0]

			// de poppulated books uitrollen in de root van het object. Dat moet denk ik ook met mongo kunnen maar weet nog niet hoe
			let books = booksdb.map(b => {
				const book = {...b};
				delete book.bookId;
				return {...book, ...b.bookId};
			})

			books = books.sort((a, b) => {
				return (Date.parse(a.lastOpened) < Date.parse(b.lastOpened)) ? 1 : -1;
			});

			res.send(books);
		} catch (err) {
			console.log(err);
			sendStatus(res, 404, "User not found");
		}
    })

    router.patch('/:USER/books/:fileId/currentLocation', async (req, res) => {
        const fileId = req.params.fileId;
        const location = req.body;
        const user = req.params.USER;
        try {
            const userdb = await getUser(user);

            userdb.books.forEach(book => {
                if (String(book.bookId) === fileId) {
                    book.currentLocation.currentPage = location.currentPage
                    book.currentLocation.totalPages = location.totalPages
                    book.currentLocation.chapterNumber = location.chapterNumber
                    book.currentLocation.epubcfi = location.epubcfi
                }
            })

            userdb.save();
            sendStatus(res, 200);
        } catch (err) {
            sendStatus(res, 500, err);
        }
    })

    router.get('/:USER/books/:fileId/currentLocation', async (req, res) => {
        const fileId = req.params.fileId;
        const user = req.params.USER;
        try {
            const book = await getBook(user, fileId);
            if (!book) sendStatus(res, 404);
            res.send(book);
        } catch (err) {
            sendStatus(res, 500, err);
        }
    })
    router.patch('/:USER/books/:fileId/lastOpened', async (req, res) => {
        const fileId = req.params.fileId;
        const user = req.params.USER;
        try {
            const userdb = await getUser(user);

            userdb.books.forEach(book => {
                if (String(book.bookId) === fileId) {
                    book.lastOpened = Date.now()
                    userdb.save()
                }
            })
            sendStatus(res, 200);
        } catch (err) {
            sendStatus(res, 500, err);
        }
    })

    router.get('/:USER/preferences', async (req, res) => {
        try {
            const username = req.params.USER;
            let data = (await Users.findOne({
                username: username
            }, {
                preferences: 1,
                readingMethod: 1,
                textToSpeech: 1,
                _id: 0
            }))
            if(!data){
                throw ('User not found')
            }
            res.status(200).send(
                data
            )
        } catch (err) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
    })
    router.put('/:USER/preferences', async (req, res) => {

        // preferences die veranderd moeten worden.
        try {
            const username = req.params.USER;
            const newPreferences = req.body;
            let preferences
            preferences = await findAndMerge(username, newPreferences, 'preferences')

            await Users.updateOne({
                    username: username
                },
                {
                    preferences: preferences
                })
            userMessage(req.webSocketServer.clients, req, 'PREFERENCES_STATUS', 'unloaded')
            res.status(200).send({
                success: true,
                preferences: preferences
            })
        } catch (err) {
            res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
    })

    router.put('/:USER/readingMethod', async (req, res) => {
        try {
            const username = req.params.USER;
            const readingMethod = req.body;
            let report = await Users.updateOne({
                    username: username
                },
                {
                    readingMethod: readingMethod.method
                })
            if(report.n === 0){
                throw('User not found')
            }
            userMessage(req.webSocketServer.clients, req, 'PREFERENCES_STATUS', 'unloaded')
            res.status(200).send({
                success: true,
                readingMethod: readingMethod.method
            })
        } catch (err) {
            res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
    })
    router.put('/:USER/tts', async (req, res) => {
        try {
            const username = req.params.USER;
            const newTts = req.body;
            let tts = await findAndMerge(username, newTts, 'textToSpeech')
            await Users.updateOne({
                    username: username
                },
                {
                    textToSpeech: tts
                })
            userMessage(req.webSocketServer.clients, req, 'PREFERENCES_STATUS', 'unloaded')
            res.status(200).send({
                success: true,
                textToSpeech: tts
            })
        } catch (err) {
            res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
    })


    return router;
}

const getBook = async (usr, bookId) => {
    const user = await getUser(usr);

    for (const book of user.books) {
        if (String(book.bookId) === bookId) return book;
    }

    return undefined;
}

const findAndMerge = async (username, newData, variable) => {
    const currentData = await Users.findOne({
            username: username
        },
        {
            [variable]: 1,
            _id: 0
        })
    return Object.assign(currentData[variable], newData)
}

const getUser = usr => {
    return Users.findOne({username: usr}, {'books._id': 0});
}

const getGoogleUser = userid => {
    return Users.findOne({googleUserId: userid}, {'books._id': 0});
}

const getUsernameFromEmail = email => email.split('@')[0];
