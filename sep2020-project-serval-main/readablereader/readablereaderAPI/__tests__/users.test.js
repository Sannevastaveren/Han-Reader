/**
 * @jest-environment node
 */


const httpServer = require("../index");
const request = require('supertest');

const {
    Users
} = require('../database/db');
const mongoose = require("mongoose");

const existentUser = "testman";
const existentUserHashedPin = "8y3n3Y&*N93ny%pp(Ny2389pn.qyYp";
const nonExistentUser = "idontexistlol"
const testId = new mongoose.Types.ObjectId('5fdb1f5733561d58df242f5c');

describe('Routes in posting, getting and putting users, and getting the list of books', function () {

	afterAll(async () => {
		await Users.deleteOne({
			username: existentUser
		})
	});

    describe('POST /users/', function () {
        it('creates a new user if the user doesn\'t already exist', async function (done) {
            const response = await request(httpServer)
			.post("/api/v1/users/")
			.set('Accept', 'application/json')
			.send({
				username: existentUser,
				pin: existentUserHashedPin
			})

            expect(response.status).toBe(200)
			expect(response.body.success).toEqual(true)
			done();
		});

        it('doesn\'t create a new user if user already exists', async function (done) {
            const response = await request(httpServer)
                .post("/api/v1/users/")
                .set('Accept', 'application/json')
                .send({
					username: existentUser
				})

			expect(response.status).toBe(500)
            expect(response.body.success).toEqual(false)
            done();
        });
	});

	describe('GET /users/{USER}', function () {
		it('sends back a 404 when the user isn\'t found', async function (done) {
			const response = await request(httpServer)
			.get(`/api/v1/users/${nonExistentUser}`)

			expect(response.status).toBe(404)
            expect(response.body.success).toEqual(false)
			expect(response.body.message).toEqual("User not found")
			done();
		})
	});

	describe('GET /users/{USER}', function () {
		it('sends back the user when the user is found', async function (done) {

			const response = await request(httpServer)
			.get(`/api/v1/users/${existentUser}`)

			expect(response.status).toBe(200)
            expect(response.body.success).toEqual(true)
            expect(response.body.username).toEqual(existentUser)
			done();
		})
	});
	
	describe('PUT /users/{USER}/pin', function () {
		it('fails when no new pin is found in the body', async function (done) {
			const response = await request(httpServer)
			.put(`/api/v1/users/${existentUser}/pin`)
			.send()

			expect(response.status).toBe(500)
            expect(response.body.success).toEqual(false)
            expect(response.body.message).toEqual("No new pin found in body")
			done();
		})

		it('changes the pin and sends back a success message on success', async function (done) {
			const response = await request(httpServer)
			.put(`/api/v1/users/${existentUser}/pin`)
			.send({pin: "86d3f35a1360a4fbad296af6abc628ec"})

			expect(response.status).toBe(200)
            expect(response.body.success).toEqual(true)
            expect(response.body.message).toEqual("Update successful")
			done();
		})
	})


	describe('GET /users/{USER}/books', function () {
		it('sends back an array of the users books', async function (done) {
			const response = await request(httpServer)
			.get(`/api/v1/users/${existentUser}/books`)

			expect(response.status).toBe(200)
            expect(response.body).toEqual([]);
			done();
		})
	})

	describe('GET /users/{USER}/preferences', function () {
		test('should get preferences from the given user', async done => {
			const response = await request(httpServer).get(`/api/v1/users/${existentUser}/preferences`);
			const data = response.body;
			expect(response.status).toBe(200);
			expect(data.preferences.fontColor).toBe('black');
			done();
		})

		test('Should fail to get preferences', async done => {
			const response = await request(httpServer).get(`/api/v1/users/${nonExistentUser}/preferences`);

			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			done();
		})
	})
	describe('PUT /users/{USER}/tts', function () {
		test('should update Speed and Rate of tts', async done => {
			const newTts = {
				ttsRate: 0.5
			}

			const response = await request(httpServer)
				.put(`/api/v1/users/${existentUser}/tts`)
				.send(newTts)

			const response2 = await request(httpServer).get(`/api/v1/users/${existentUser}/preferences`);
			const updatedTts = response2.body;

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(updatedTts.textToSpeech.ttsRate).toBe(newTts.ttsRate);
			done();
		})
		test('should not update Speed and Rate of tts if user doesnt exist', async done => {
			const newTts = {
				ttsRate: 0.5
			}

			const response = await request(httpServer)
				.put(`/api/v1/users/${nonExistentUser}/tts`)
				.send(newTts)

			expect(response.status).toBe(404);

			done();
		})
	})
	describe('PUT /users/{USER}/reaadingMethod', function () {
		test('should update readingMethod', async done => {
			const newReadingMethod = {
				method: 'paginated'
			}

			const response = await request(httpServer)
				.put(`/api/v1/users/${existentUser}/readingMethod`)
				.send(newReadingMethod)

			const response2 = await request(httpServer).get(`/api/v1/users/${existentUser}/preferences`);
			const updatedTts = response2.body;

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(updatedTts.readingMethod).toBe(newReadingMethod.method);
			done();
		})
		test('should not update readingMethod if user doesnt exist', async done => {
			const newReadingMethod = {
				method: 'paginated'
			}

			const response = await request(httpServer)
				.put(`/api/v1/users/${nonExistentUser}/readingMethod`)
				.send(newReadingMethod)
			expect(response.status).toBe(404);

			done();
		})
	})
	describe('PUT /users/{USER}/preferences', function () {
		test('should update fontColor of preferences', async done => {
			const newPreferences = {
				fontColor: 'white'
			}

			const response = await request(httpServer)
			.put(`/api/v1/users/${existentUser}/preferences`)
			.send(newPreferences)

			const response2 = await request(httpServer).get(`/api/v1/users/${existentUser}/preferences`);
			const updatedPreferences = response2.body;

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(updatedPreferences.preferences.fontColor).toBe(newPreferences.fontColor);
			done();
		})

		test('should fail to update fontColor of preferences', async done => {
			const newPreferences = {
				fontColor: 'white'
			}

			const response = await request(httpServer)
			.put(`/api/v1/users/${nonExistentUser}/preferences`)
			.send(newPreferences)
			expect(response.status).toBe(404);
			expect(response.body.success).toBe(false);
			done();
		})
	})
});

//todo: make test database and a before each and after each
describe('Routes in updating and getting current location', function () {
	beforeAll(async () => {
		await Users.insertMany({
			username: 'testUser',
			google: false,
			books: [{
				bookId: testId,
				currentLocation: {
					currentPage: 0,
					chapterNumber: 0,
					totalPages: 0,
					epubcfi: 'old'
				},
				lastOpened: Date.now(),
			}]
		})
	});
	afterAll(async () => {
		await Users.deleteOne({
			username: "testUser"
		})
	});
    describe('PATCH /users/{USER}/books/{BookID}/currentLocation', function () {
        it('updates the current location of the book the logged in user is reading', async function (done) {
            const response = await request(httpServer)
                .patch(`/api/v1/users/testUser/books/${testId}/currentLocation`)
                .set('Accept', 'application/json')
                .send({
                    currentPage: 1,
                    totalPages: 10,
                    chapterNumber: 2,
					epubcfi: 'new'
                })

            expect(response.status).toBe(200)
            done()
        });
    });

    describe('GET /users/{USER}/books/{BookID}/currentLocation', function () {
        it('gets the current location of the book the logged in user is reading', async function (done) {
            const response = await request(httpServer)
                .get(`/api/v1/users/testUser/books/${testId}/currentLocation`)
				.set('Accept', 'application/json')
			
            expect(response.body.bookId).toEqual(String(testId))
            // should be in test database...
            expect(response.body.currentLocation).toEqual({chapterNumber: 2, totalPages: 10, currentPage: 1, epubcfi: 'new'})
            done()
        });
    });
});



