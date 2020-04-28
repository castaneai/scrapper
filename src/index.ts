import express from 'express';
import bodyParser from 'body-parser';
import { writeToScrapbox } from './scrapbox';

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

app.post('/', async (req: express.Request, res: express.Response) => {
	const r = req.body as RequestBody;
	if (!r) {
		res.sendStatus(400);
		return;
	}
	console.log(r);
	console.log(`writing to scrapbox.io/${project}/${r.title}...`);
	await writeToScrapbox(sid, project, r.title, r.text);
	console.log('finish write')
	res.sendStatus(200).send();
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log('listening on port', port);
});