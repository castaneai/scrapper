import axios from "axios";
import puppeteer from "puppeteer";

const SID_COOKIE = 'connect.sid';
const TEXT_LENGHT_LIMIT = 8000;

export const writeToScrapbox = async (browser: puppeteer.Browser, sid: string, project: string, pageName: string, text: string) => {
	const page = await browser.newPage();
	try {

		const encodedText = encodeURIComponent(text);
		// Split long text to avoid HTTP 414 Request-URI too long
		if (encodedText.length > TEXT_LENGHT_LIMIT) {
			const lines = text.split('\n');
			const half = Math.floor(lines.length / 2);
			const head = lines.slice(0, half).join('\n');
			const tail = lines.slice(half).join('\n');
			return (async () => {
				await writeToScrapbox(browser, sid, project, pageName, head);
				await writeToScrapbox(browser, sid, project, pageName, tail);
			})();
		}

		const url = new URL(`https://scrapbox.io/${project}/${encodeURIComponent(pageName)}?body=${encodeURIComponent(text)}`);
		page.on('response', response => {
			if (response.url() == url.toString() && response.status() >= 400) {
				console.error(`${response.status()} ${response.statusText()} ${response.request().method()} ${response.url()}`);
			}
		})
		await page.setCookie({ name: SID_COOKIE, value: sid, domain: 'scrapbox.io' });
		await page.goto(url.toString());
		await page.waitFor('#editor', { timeout: 10000 });
		await new Promise((resolve) => setTimeout(resolve, 1000));
	} catch (err) {
		throw err;
	} finally {
		if (!page.isClosed()) {
			await page.close();
		}
	}
};

export const getScrapboxPageText = async (sid: string, project: string, pageName: string) => {
	const url = `https://scrapbox.io/api/pages/${project}/${encodeURIComponent(pageName)}/text`;
	const resp = await axios.get(url, { headers: { cookie: `${SID_COOKIE}=${sid}` } });
	if (resp.status >= 400) {
		throw new Error(`failed to get scrapbox page (${resp.status} ${resp.statusText} GET ${url})`);
	}
	return resp.data as string;
}
