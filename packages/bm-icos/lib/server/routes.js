import { runCallbacksAsync } from 'meteor/vulcan:core';
import escapeStringRegexp from 'escape-string-regexp';
import { Picker } from 'meteor/meteorhacks:picker';
import ICOs from '../collection.js';

Picker.route('/out', ({ query}, req, res, next) => {
  if(query.url){ // for some reason, query.url doesn't need to be decoded
    /*
    If the URL passed to ?url= is in plain text, any hash fragment
    will get stripped out.
    So we search for any ico whose URL contains the current URL to get a match
    even without the hash
    */

    try {

      // decode url just in case
      const decodedUrl = decodeURIComponent(query.url);

      const ico = ICOs.findOne({url: {$regex: escapeStringRegexp(decodedUrl)}}, {sort: {postedAt: -1, createdAt: -1}});

      if (ico) {
        const ip = req.headers && req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        runCallbacksAsync('icos.click.async', ico, ip);

        res.writeHead(301, {'Location': query.url});
        res.end();
      } else {
        // don't redirect if we can't find a ico for that link
        res.end(`Invalid URL: ${query.url}`);
      }
    } catch (error) {
      console.log('// /out error')
      console.log(error)
      console.log(query)
    }
  } else {
    res.end("Please provide a URL");
  }
});
