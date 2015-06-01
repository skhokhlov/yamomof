'use strict';

var app = require('express')(),
    yr = require(__dirname + '/node_modules/yate/lib/runtime.js');

//Set port for listening
app.set('port', process.env.PORT || 3000);

//Setup serving static files
app.use('/public', express.static(__dirname + '/public', {
    index: false,
    maxAge: ((process.env.DEBUG === 'false') ? 15552000000 : 15000)
}));


app.get('/', function (req, res) {
    if (req.query._escaped_fragment_ == '') {
        res.send(render.js.home);

    } else if (req.query.nojs == 'true') {
        res.send(render.nojs.home);

    } else {
        res.status(200).sendFile(__dirname + '/public/app.html');
    }
});

app.get('/assest/data.json', function (req, res) {
    res.status(200).set('cache-control', 'public, max-age=120').json(getData());
});

app.get('/favicon.ico', function (req, res) {
    res.status(200).sendFile(__dirname + '/public/images/favicon.ico');
});

app.get('/robots.txt', function (req, res) {
    if (process.env.DEBUG === 'false') {
        res.set('Content-type', 'text/plain').sendFile(__dirname + '');

    } else {
        res.set('Content-type', 'text/plain').send('User-Agent: *\nDisallow: /');
    }
});

app.get('/sitemap.xml', function (req, res) {
    res.set('Content-type', 'application/xml').sendFile(__dirname + '');
});

//Serving error page of HTTP 404 status
app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + '/public/404.html');
});


require('http').createServer(app).listen(app.get('port'), function () {
    console.info('DEBUG environment is set to ' + (!!((process.env.DEBUG === 'true') || (process.env.DEBUG == null))));
    console.log('Server listening on port ' + app.get('port'));
});


//Server-based template rendering
require(__dirname + '/public/app.yate.js');
var render = {
    "nojs": {
        "home": yr.run('app', getData('nojs').home),
        "projects": yr.run('app', getData('nojs').projects)
    },
    "js": {
        "home": yr.run('app', getData().home),
        "projects": yr.run('app', getData().projects)
    }
};


function getData(env) {
    var _data = {
        "year": new Date().getFullYear(),
        "nojs": (env === 'nojs' ? "true" : "false"),
        "debug": process.env.DEBUG
    };
    return {
        "home": {
            "data": _data,
            "page": {
                "page-blocks": {
                    "header": {
                        "logo": true
                    },
                    "footer": true
                },
                "page-params": {
                    "_page": "home",
                    "title": "Homepage of Yamomof"
                }
            }
        }
    }
}