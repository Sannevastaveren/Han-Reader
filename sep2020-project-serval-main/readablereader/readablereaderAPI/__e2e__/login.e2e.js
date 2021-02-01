const puppeteer = require('puppeteer');
const {
    Users
} = require('../database/db')
const e2eFunctions = require('../functions/e2eFunctions')

jest.setTimeout(60000);

describe("Logging in", () => {
	let browser, page;

	beforeAll(async () => {
		// create a browser
		browser = await puppeteer.launch({
			headless: true,
			slowMo: 200,
			args: [`--window-size=768,1024`, `--window-position=0,0`],
			defaultViewport : {width: 768, height:1024}
		})
		page = await browser.newPage()

		// delete henk
		await Users.remove({
			username: "henk"
		})
	});

	afterAll(async () => {
		await browser.close()
	})

	//////////// the tests /////////////////////////////////////

	test(`create page loads in browser`, async () => {
		await page.goto(`http://localhost:3000/create`)
		await page.waitFor(`title`)
		const theTitle = await page.title()
		expect(theTitle).toBe(`Readable Reader`);
	})

	test(`creating user with illegal characters fails`, async () => {
		await e2eFunctions.createWithError(page, '0000', '1ll3g#l ch^rs')
	})

	test(`create page loads in browser`, async () => {
		await page.goto(`http://localhost:3000/create`)
		await page.waitFor(`title`)
		const theTitle = await page.title()
		expect(theTitle).toBe(`Readable Reader`);
	})

	test(`create user succesfully`, async () => {
		await e2eFunctions.create(page, '1234', 'henk')

	})

	test(`login page loads in browser`, async () => {
		await e2eFunctions.goToLogin(page)
	})

	test(`Login with user account`, async () => {
		await e2eFunctions.login(page, '1234', 'henk')
	})
})