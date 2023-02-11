import nc from 'next-connect';
import ogs from 'open-graph-scraper';
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { url, token },
  } = req;
  await runMiddleware(req, res, cors);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
  const options = {
    url,
    headers: {
      'accept-language': 'en',
      Authorization: `Bearer ${token}`,
    },
    timeout: 2000,
  };

  ogs(options, function (err, results, response) {
    if (results.err) {
      res.json(results.err);
    } else {
      res.json(results);
      res.end();
    }
  });
});

export default handler;
