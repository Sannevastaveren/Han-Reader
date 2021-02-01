const request = require('supertest');

const GoToLogin = async (pageOfBrowser) => {
    await pageOfBrowser.goto('http://localhost:3000/login')
    await pageOfBrowser.waitFor(`title`)
    const theTitle = await pageOfBrowser.title()
    expect(theTitle).toBe(`Readable Reader`);
}

const Create = async (pageOfBrowser, pin, username) => {
    const firstCreateButton = await pageOfBrowser.$(`#create-submit_button a`)
    expect(firstCreateButton).toBeDefined()
    await pageOfBrowser.type(`#create_username-input input`, username);
    await firstCreateButton.click()
    const secondCreateButton = await pageOfBrowser.$(`#create-submit_button a`)
    expect(secondCreateButton).toBeDefined()
    await pageOfBrowser.type(`#create_pin-input input`, pin);
    await secondCreateButton.click()
}

const Login = async (pageOfBrowser, pin, username) => {
    const firstLoginButton = await pageOfBrowser.$(`#login-submit_button a`);
    expect(firstLoginButton).toBeDefined();
    await pageOfBrowser.type(`#login_username-input input`, username);
    await firstLoginButton.click();
    const secondLoginButton = await pageOfBrowser.$(`#login-submit_button a`);
    expect(secondLoginButton).toBeDefined();
    await pageOfBrowser.type(`#login_pin-input input`, pin);
    await secondLoginButton.click();
}

const CreateWithError = async (pageOfBrowser, pin, username) => {
    const createButton = await pageOfBrowser.$(`#create-submit_button a`)
    expect(createButton).toBeDefined()
    await pageOfBrowser.type(`#create_username-input input`, username);
    await createButton.click()
    await pageOfBrowser.type(`#create_pin-input input`, pin);
    await createButton.click()
    const theDiv = await pageOfBrowser.waitFor(`.warning`)
    expect(theDiv).toBeDefined();
}

const uploadSampleBook = async (username) => {
	return request('http://localhost:3001').
	post('/api/v1/books').
	field('username', username).
	field('metadata', JSON.stringify({
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
	})).
	attach('cover', 'test/samplecover.jpg').
	attach('file', "test/sample1.epub")
}

const deleteSampleBook = async bookId => {
	return request('http://localhost:3001')
	.delete(`/api/v1/books/${bookId}`)
}

const SelectBook = async (pageOfBrowser) => {
    const bookLink = await pageOfBrowser.$(`#bookLink`);
    expect(bookLink).toBeDefined();
    await bookLink.click();
    await pageOfBrowser.waitFor(4000)
}
module.exports = {
    goToLogin: GoToLogin,
    login: Login,
    selectBook: SelectBook,
    create: Create,
	createWithError: CreateWithError,
	uploadSampleBook: uploadSampleBook,
	deleteSampleBook: deleteSampleBook
}