import express from 'express';
import bodyParser from 'body-parser';
import { writeToScrapbox } from './scrapbox';
import puppeteer from "puppeteer";

const project = process.env.SCRAPBOX_PROJECT;
if (!project) {
	throw 'env SCRAPBOX_PROJECT not set';
}
const sid = process.env.SCRAPBOX_SID;
if (!sid) {
	throw 'env SCRAPBOX_SID not set';
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

type RequestBody = {
	title: string;
	text: string;
}

let browser: puppeteer.Browser | null = null;

app.post('/', async (req: express.Request, res: express.Response) => {
	const r = req.body as RequestBody;
	if (!r) {
		res.sendStatus(400);
		return;
	}

	if (browser == null) {
		browser = await puppeteer.launch({
			headless: false,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
	}

	const url = `https://scrapbox.io/${project}/${encodeURIComponent(r.title.replace(' ', '_'))}`;
	console.log(`writing to ${url}...`);
	await writeToScrapbox(browser, sid, project, r.title, r.text);
	res.send(url);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log('listening on port', port);
});