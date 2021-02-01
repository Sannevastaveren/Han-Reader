const express = require('express');
const router = express.Router();

const route_books = require('./books');
const route_users = require('./users');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const {url} = require('../database/db');

// create storage engine
const storage = new GridFsStorage({
    url: url,
    file: (req, file) => {
		return {
			filename: file.originalname,
			bucketName: 'uploads'
		};
    }
});

const upload = multer({ storage });

router.use("/books", route_books(upload));
router.use("/users", route_users(upload));

module.exports = router;