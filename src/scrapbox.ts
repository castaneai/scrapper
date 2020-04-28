import puppeteer from "puppeteer";

// from https://scrapbox.io/scrapbox-drinkup/puppeteer%E3%81%A7scrapbox%E3%82%92%E8%87%AA%E5%8B%95%E5%8C%96%E3%81%97%E3%81%A6%E3%82%A4%E3%83%86%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E8%B3%87%E6%96%99%E3%82%92%E5%AE%A3%E8%A8%80%E7%9A%84%E3%81%AB%E5%AE%8C%E6%88%90%E3%81%95%E3%81%9B%E3%82%8B_(2019%2F9%2F5)
const openPage = async (project: string, pageName: string, sid: string) => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();

	await page.setCookie({ name: 'connect.sid', value: sid, domain: 'scrapbox.io' });
	await page.goto(`https://scrapbox.io/${project}/${encodeURIComponent(pageName)}`);

	await page.waitFor('#editor');

	await new Promise((resolve) => setTimeout(() => resolve(), 1000));
	return { browser, page };
};

const writeTextWithPage = async (page: puppeteer.Page, text: string) => {
	// lineをクリック
	await page.click(`.line-title`);
	await new Promise((resolve) => setTimeout(resolve, 200));

	// [を入力すると]が補完されるので、→とBSをエミュレートして消す
	// splitに渡す正規表現でキャプチャすると配列にそれ自体が入る
	const strings = text.split(/(\[)/);
	for (const string of strings) {
		await page.keyboard.type(string);
		if (string === '[') {
			await new Promise((resolve) => setTimeout(() => resolve(), 200));
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('Backspace');
		}
	}
	await page.keyboard.press('Enter');

	// 改行を入れる
	await page.keyboard.press('Enter');
	await new Promise((resolve) => setTimeout(resolve, 200));

	// 改行するときにインデントが補完されるので消す
	await page.keyboard.press('Backspace');
	await new Promise((resolve) => setTimeout(resolve, 1000));
};

export async function writeToScrapbox(sid: string, project: string, pageName: string, text: string) {
	const { browser, page } = await openPage(project, pageName, sid);
	await writeTextWithPage(page, text);
	await browser.close();
}