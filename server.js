var express = require('express');
var app = express();
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080

// strip port from host string
function get_ip(s) {
  return s.split(':')[0] || 'unknown';
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
function parse_headers(headers) {
  var json = {
    'ipaddress': get_ip(headers['host']),
    'language': get_language(headers['accept-language']),
    'operating system': get_os(headers['user-agent']),
  };
  return json;
}

// set the root route
app.get('/', function(req, res) {
  res.send(parse_headers(req.headers));
});

app.listen(port, function() {
  console.log('app running on port ' + port);
});
