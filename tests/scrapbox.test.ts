import puppeteer from "puppeteer";
import { v4 as uuidv4 } from 'uuid';
import { getScrapboxPageText, writeToScrapbox } from '../src/scrapbox';

const project = process.env.SCRAPBOX_PROJECT;
if (!project) {
	throw 'env SCRAPBOX_PROJECT not set';
}
const sid = process.env.SCRAPBOX_SID;
if (!sid) {
	throw 'env SCRAPBOX_SID not set';
}

jest.setTimeout(60000);

let browser: puppeteer.Browser | null;
const getBrowser = async () => {
	if (browser == null) {
		browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
	}
	return browser;
}

const assertWriteToScrapbox = async (browser: puppeteer.Browser, sid: string, project: string, pageName: string, text: string) => {
	await writeToScrapbox(browser, sid, project, pageName, text);
	const textWritten = await getScrapboxPageText(sid, project, pageName);
	expect(textWritten).toBe(pageName + '\n' + text);
};

afterAll(async () => {
	if (browser != null) {
		await browser.close()
	}
})

describe('scrapbox', () => {
	it('write text', async () => {
		const browser = await getBrowser();
		const pageName = uuidv4();
		const text = 'test-text\n[test]\n[test2]\n[test3]';
		await assertWriteToScrapbox(browser, sid, project, pageName, text);
	});

	it('write long text', async () => {
		const browser = await getBrowser();
		const pageName = uuidv4();
		let text = '';
		for (let i = 0; i < 1000; i++) {
			text += `long-long-long-text-${i}\n`;
		}
		await assertWriteToScrapbox(browser, sid, project, pageName, text);
	});
});
