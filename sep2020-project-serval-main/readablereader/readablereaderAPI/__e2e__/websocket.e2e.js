const puppeteer = require('puppeteer')
const fetch = require('node-fetch');
const e2eFunctions = require('../functions/e2eFunctions')
const bcrypt = require('bcryptjs');

jest.setTimeout(60000)

describe('Change preferences with websockets for another person live', () => {
    let browserA, pageA;
    let browserB, pageB

    // Initialization of test user and url
    const username = 'Sannevs'
	const pin = '0408'
    const urlBase = `http://localhost:3001/api/v1/users/${username}/`

    beforeAll(async () => {

		await fetch(`http://localhost:3001/api/v1/users/`, {
			method: "POST",
			body: JSON.stringify({
				username: username,
				pin: bcrypt.hashSync(pin, 12),
				google: false
			}),
			headers: {'Content-Type': 'application/json'}
		});

		await e2eFunctions.uploadSampleBook(username);

        browserA = await puppeteer.launch({
            headless: true,
            slowMo: 100,
            args: ['--window-size=768,1024', '--window-position = 0,0'],
            defaultViewport : {width: 768, height:1024}
        })
        pageA = await browserA.newPage();

        browserB = await puppeteer.launch({
          headless: true,
          slowMo: 20,
          args: [`--window-size=768,1024`,`--window-position=350,0`],
            defaultViewport : {width: 768, height:1024}
        })
        pageB = await browserB.newPage()
    })
    afterAll(async () => {
        await browserA.close()
        await browserB.close()
    })
    test('Can goto login screen in browser A', async ()=>{
       await e2eFunctions.goToLogin(pageA)
    })

    test(`Can login with user account in browser A`, async () => {
        await e2eFunctions.login(pageA, pin, username )
    })

    test(`Can go to login page in browser B`, async ()=>{
        await e2eFunctions.goToLogin(pageB)
    })
    test(`Can login with user account in browser B`, async ()=>{
        await e2eFunctions.login(pageB, pin, username )
    })

    test('Select book from bookshelf in browser A', async () => {
        await e2eFunctions.selectBook(pageA)
    })

    test('Select book from bookshelf in browser B', async () => {
        await e2eFunctions.selectBook(pageB)
    })
    test('Open preferences menu in Browser B', async () => {
        const menu = await pageB.$(`#menu`)
        expect(menu).toBeDefined();
        await menu.click();
    })
    let prefChange = {}
    test('Change fontSize in Browser B sends PUT request to server', async () => {
        pageB.on('request', async (request) => {
            if (request.url() === urlBase + 'preferences') {
                if(request.method() === 'PUT'){
                    expect(request.postData).toBeDefined()
                    let data = request.postData()
                    prefChange = JSON.parse(data)
                }
            }
        })
        for(let i=0;i<5;i++){
            const biggerFont = await pageB.$(`#smallerText`)
            expect(biggerFont).toBeDefined();
            await biggerFont.click();
        }
        const okButton = await pageB.$('#okButton');
        expect(okButton).toBeDefined();
        await okButton.click();
        await pageB.waitFor(1000)
    })
    test('Preferences changed in Browser A with a GET request', async () => {
        pageA.on('request', (request) => {
            expect(request.url()).toEqual(urlBase + 'preferences')
            expect(request.method()).toEqual('GET')
        })
        pageA.on('response', async (response) => {
            if (response.url() === urlBase + 'preferences'){
                let responseJson = await response.json()
                expect(responseJson).toEqual(prefChange)
                await pageA.waitFor(1000)
            }
        })
        await pageA.waitFor(4000)
    })
})



