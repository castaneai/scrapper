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
	if (!r || !r.title || !r.text) {
		console.log(`invalid request body: ${r}`);
		res.sendStatus(400);
		return;
	}

	try {
		if (browser == null) {
			browser = await puppeteer.launch({
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			});
		}

		const encodedTitle = encodeURIComponent(r.title.replace(' ', '_'));
		const url = `https://scrapbox.io/${project}/${encodedTitle}`;
		console.log(`started writing to ${url}...`);
		await writeToScrapbox(browser, sid, project, r.title, r.text);
		console.log(`finished writing to ${url}`);
		res.send(url);
	} catch (err) {
		console.error(`error occured: ${err}`)
		res.sendStatus(500);
	}
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log('listening on port', port);
});