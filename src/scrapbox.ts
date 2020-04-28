import puppeteer from "puppeteer";

export const writeToScrapbox = async (sid: string, project: string, pageName: string, text: string) => {
	const url = new URL(`https://scrapbox.io/${project}/${encodeURIComponent(pageName)}?body=${encodeURIComponent(text)}`);
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();

	await page.setCookie({ name: 'connect.sid', value: sid, domain: 'scrapbox.io' });
	await page.goto(url.toString());

	await page.waitFor('#editor');
	await new Promise((resolve) => setTimeout(() => resolve(), 1000));

	await browser.close();
};
