var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    fileupload = require('express-fileupload'),
    AWS = require('aws-sdk'),
    cors = require('cors'),
    app = express(),
    configDB = require('./config').configDB,
    service = require('./service');
app.listen(3000, () => console.log('Super Hero API listening on port 3000!'))
AWS.config.update(configDB);
app.use(cors());
app.use(
    fileupload({
        createParentPath: true,
    }),
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(cookieParser());
app.set('view engine', 'jade');
app.get('/', function (req, res) {
    res.send({ title: "Super Hero API Entry Point" })
})
app.post("/super-heros", service.updateSuperHero)
app.get('/super-heros', service.getSuperHeros)
app.get('/super-heros/:id', service.getSuperHeroById)

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
