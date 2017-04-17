var express = require('express');
var app = express();
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080

// return client ip address
function get_ip_from_request(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

// stip additional languages from header string
function get_language(s) {
  var lang = s.split(';')[0] || 'unknown';
  if (lang.indexOf(',') !== -1) {
    lang = lang.split(',')[0];
  }
  return lang;
}

// find OS identifier in user-agent string
function get_os(s) {
  var re = /\(([^)]+)\)/;
  matches = re.exec(s);
  if (matches.length) {
    return matches[0];
  }
  return 'unknown';
}

// get IP, language and OS from request headers
function parse_request(req) {
  var json = {
    'ipaddress': get_ip_from_request(req),
    'language': get_language(req.headers['accept-language']),
    'operating system': get_os(req.headers['user-agent']),
  };
  return json;
}

// set the root route
app.get('/', function(req, res) {
  res.send(parse_request(req));
});

app.listen(port, function() {
  console.log('app running on port ' + port);
});
