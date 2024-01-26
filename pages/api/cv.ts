import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer, { Browser } from 'puppeteer';
import ReactDOMServer from 'react-dom/server';

import { CV1 } from '../../components/CV';
import { data } from '../../data/cv_data';


const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  // const args = ['--no-sandbox', '--disable-setuid-sandbox'];
  const args = ['--no-sandbox', '--disable-dev-shm-usage'];

  let browser;
  try {
    // browser = await puppeteer.launch({ args, pipe: true });
    browser = await puppeteer.launch({ args, headless: true });
    const page = await browser.newPage();
    const resumeData = _.body['resumeData'] ? _.body['resumeData'] : data;
    const html = `
      <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Revanth Madasu - CV</title>
            <link rel="stylesheet" href="http://localhost:3000/build.css" />
          </head>
          <body style="padding: 40px 60px;">
            ${ReactDOMServer.renderToStaticMarkup(CV1(resumeData))}
          </body>
        </html>`;
    await page.setContent(html);
    const pdf = await page.pdf({
      scale: 0.85,
      pageRanges: '1-2',
    });
    if (_.query['download']) {
        const fileName = _.query['fileName'] || 'revanth_madasu.pdf';
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
    // res.status(200).json({ name: 'John Doe' })
  } catch (err) {
    const e = err as Error;
    console.log(`Error: ${e?.message}`);
    res.statusCode = 500;
    return res.json({ error: e?.message });
  } finally {
    if (browser) await browser.close();
    console.log('closed');
  }
};

export default handler;
