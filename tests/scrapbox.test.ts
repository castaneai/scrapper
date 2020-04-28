import { v4 as uuidv4 } from 'uuid';
import { writeToScrapbox } from '../src/scrapbox';


const project = process.env.SCRAPBOX_PROJECT;
if (!project) {
	throw 'env SCRAPBOX_PROJECT not set';
}
const sid = process.env.SCRAPBOX_SID;
if (!sid) {
	throw 'env SCRAPBOX_SID not set';
}

describe('scrapbox', () => {
	it('write text to new page', async () => {
		jest.setTimeout(10000);
		const pageName = 'test-title';
		const text = 'test-text\n[test]\n[test2]\n[test3]';
		await writeToScrapbox(sid, project, pageName, text);
	})
})