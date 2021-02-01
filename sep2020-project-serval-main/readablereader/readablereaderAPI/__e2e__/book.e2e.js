const puppeteer = require('puppeteer')
const fetch = require('node-fetch');
const e2eFunctions = require('../functions/e2eFunctions')
const bcrypt = require('bcryptjs');

jest.setTimeout(60000)

const username = 'sanne';
const pin = '0000'

let uploadedSampleBook;

describe('Display book', () => {
    let browser, page;

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
		uploadedSampleBook = (await e2eFunctions.uploadSampleBook(username)).body.book;

        browser = await puppeteer.launch({
            headless: true,
            slowMo: 100,
            args: ['--window-size=768,1024', '--window-position = 0,0'],
            defaultViewport : {width: 768, height:1024}
        })
        page = await browser.newPage();
    })
    afterAll(async () => {
		//await browser.close()
		await e2eFunctions.deleteSampleBook(uploadedSampleBook._id);
	})
    test('Lead to home screen', async ()=>{
        await e2eFunctions.goToLogin(page)
    })
    test(`Login with user account`, async () => {
		await e2eFunctions.login(page, pin, username)
        const theDiv = await page.waitFor(`.tabbar`)
        await expect(theDiv).toBeDefined();
    })
    xtest(`Upload book`, async () => {
		const addBookButton = await page.$(`#addBookButton a`);
        expect(addBookButton).toBeDefined();
        await addBookButton.click();

        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('input')
        ]);
        await fileChooser.accept(['C:/Users/jadev/Downloads/Sway.epub']);
        const uploadBook = await page.$(`#uploadBook`);
        expect(uploadBook).toBeDefined();
        await uploadBook.click();
        // The onChange function is not called in upload.jsx
    })
    test('Select book from bookshelf', async () => {
        await e2eFunctions.selectBook(page)
    })
    test('Go to settings', async () => {
        const tabbar = await page.$(`#tabbar`)
        expect(tabbar).toBeDefined();
        await tabbar.click();

        const settings = await page.$(`#settings`)
        expect(settings).toBeDefined();
        await settings.click();
    })
    test('Change settings', async () => {
        const readingMethod = await page.$(`#readingMethod`)
        expect(readingMethod).toBeDefined();
        await readingMethod.click();

        const bladeren = await page.$(`#content`)
        expect(bladeren).toBeDefined();
        await bladeren.click();
    })
    test('Go back to book', async () => {
        const backArrow = await page.$(`a.link.back`)
        expect(backArrow).toBeDefined();
        await backArrow.click();

        const backButton = await page.$(`#backButton`)
        expect(backButton).toBeDefined();
        await backButton.click();
    })
    test('Turn pages in the book', async () => {
        await page.waitFor(3000)
        for(let i=0;i<8;i++){
            const nextButton = await page.$(`#next`);
            expect(nextButton).toBeDefined();
            await nextButton.click();
        }
        for(let i=0;i<2;i++){
            const prevButton = await page.$(`#prev`);
            expect(prevButton).toBeDefined();
            await prevButton.click();
        }
    })
    test('Open menu', async () => {
        const menu = await page.$(`#menu`)
        expect(menu).toBeDefined();
        await menu.click();
    })
    test('Change fontSize', async () => {
        for(let i=0;i<3;i++){
            const biggerFont = await page.$(`#biggerText`)
            expect(biggerFont).toBeDefined();
            await biggerFont.click();
        }
        for(let i=0;i<3;i++){
            const smallerFont = await page.$(`#smallerText`)
            expect(smallerFont).toBeDefined();
            await smallerFont.click();
        }
        const okButton = await page.$('#okButton');
        expect(okButton).toBeDefined();
        await okButton.click();
	})
	
	test('Change fontSize then cancel', async () => {
		await (await page.$(`#menu`)).click();
		
        for(let i=0;i<3;i++){
            const biggerFont = await page.$(`#biggerText`)
            expect(biggerFont).toBeDefined();
            await biggerFont.click();
        }
        for(let i=0;i<3;i++){
            const smallerFont = await page.$(`#smallerText`)
            expect(smallerFont).toBeDefined();
            await smallerFont.click();
        }
        const cancelButton = await page.$('#cancelButton');
        expect(cancelButton).toBeDefined();
        await cancelButton.click();
    })
})
