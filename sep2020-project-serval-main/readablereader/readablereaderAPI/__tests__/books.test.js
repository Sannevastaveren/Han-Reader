/**
 * @jest-environment node
 */

'use strict';

const {
    Book
} = require('../database/db');

const httpServer = require("../index");
const request = require('supertest');

let book_id;

const sampleMetadata = {
	"title": "Famous Paintings",
	"creator": "Infogrid Pacific",
	"description": "",
	"pubdate": "2012",
	"publisher": "Infogrid Pacific",
	"identifier": "FamousPaintings",
	"language": "en",
	"rights": "",
	"modified_date": "2012-12-28T06:29:41Z",
	"layout": "pre-paginated",
	"orientation": "landscape",
	"flow": "",
	"viewport": "",
	"media_active_class": "",
	"spread": "none",
	"direction": "ltr"
}

describe('Boek model test', () => {

	describe('POST /books', () => {
		it('Should upload a book', async done => {
			const response = await uploadSampleBook();
			book_id = response.body.book._id;
			expect(response.status).toBe(200);
			done();
		})

		it('Should give status 412 because no book supplied', async done => {
			const response = await request(httpServer).post('/api/v1/books');
			expect(response.status).toEqual(412);
			expect(response.body.success).toEqual(false)
			done();
		});
	});

	describe('GET /books', function () {
		it('Should return the specified epub', async done => {;

			const response = await 	request(httpServer).
									get(`/api/v1/books/${book_id}`);
	
			expect(response.status).toBe(200);
			done();
		})
	
		it('Should give 404 cause epub file doesnt exist', async done => {
			const response = await request(httpServer).get(`/api/v1/books/niks`);
			
			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			done();
		})
	});

	describe('GET /books/{BOOK_ID}/data', function () {
		it('Should return the specified bookd data', async done => {;

			const response = await 	request(httpServer).
									get(`/api/v1/books/${book_id}/data`);
	
			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.message.metadata).toMatchObject(sampleMetadata);
			done();
		})
	
		it('Should give 404 cause book doesnt exist', async done => {
			const response = await request(httpServer).get(`/api/v1/books/niks/data`);
			
			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			done();
		})
	});

	describe('GET /books/file/{BOOK_ID}', function () {
		test('Should give information about the supplied book', async done => {
			const response = await 	request(httpServer).
									get(`/api/v1/books/file/${book_id}`);

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({file: {}})
			done();
		})

		test('Should give 404 because book is not found', async done => {
			const response = await request(httpServer).get(`/api/v1/books/file/niks`);
			
			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			done();
		})
	})

	describe('GET /books/{BOOK_ID}/cover', function () {
		test('Should return the specifiedbook\'s cover', async done => {
			const response = await request(httpServer).get(`/api/v1/books/${book_id}/cover`);

			expect(response.status).toBe(200);
			done();
		})

		test('Should give 404 because cover for specifiedbook doesnt exist' , async done => {
			const response = await request(httpServer).get(`/api/v1/books/boek/cover`);

			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			done();
		})
	})

	describe('DELETE /books/{BOOK_ID}', function() {
		test('Should delete the given book', async done => {
			const response = await request(httpServer).delete(`/api/v1/books/${book_id}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			done();
		})

		test('Should fail to delete a book', async done => {
			const response = await request(httpServer).delete(`/api/v1/books/boek`);

			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			done()
		})
	})
})

const uploadSampleBook = async () => {
	return request(httpServer).
	post('/api/v1/books').
	field('username', 'testpersoon').
	field('metadata', JSON.stringify(sampleMetadata)).
	attach('cover', 'test/samplecover.jpg').
	attach('file', "test/famouspaintings.epub")
}
