const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./mysql-db');

app.use(bodyParser.json());
app.use(express.static('frontend'));

app.get('/api/links', (req, res) => {
    db.getUrls((dbUrls) => {
        if (dbUrls) {
            res.send(dbUrls.map(element => {
                return {
                    id: element.id,
                    url: element.url,
                    alias: element.alias,
                    hitCount: element.hitCount
                }
            }));
        } else {
            res.status(500).send({
                message: 'Cannot read from database'
            });
        }
    })
});

app.get('/a/:alias', (req, res) => {
    db.incrementHitCount(req.params.alias, (url) => {
        if (url) {
            res.redirect(url);
        } else {
            res.status(404).send();
        }
    })
});

app.post('/api/links', (req, res) => {
    db.addUrls(req.body, (err, newUrl) => {
        if (newUrl) {
            res.send(newUrl);
        } else {
            res.status(400).send({
                message: err
            });
        }
    });
});

// app.delete('/api/links/:id', (req, res) => {
//     db.deleteUrl(req.params.id, req.body.secretCode, (err, result) => {
//         if (result == '204') {
//             res.status(204).send();
//         } else if (result == '403') {
//             res.status(403).send( {
//                 message: 'Provided secret code doesn\'t match'
//             });
//         } else if (result == '404') {
//             res.status(404).send( {
//                 message: `Entry with id ${req.params.id} doesn\'t exist`
//             });
//         } else if (err) {
//             res.status(500).send({ err });
//         } else {
//             res.status(500).send();
//         }
//     })
// })

app.delete('/api/links/:id', (req, res) => {
    db.deleteUrl(req.params.id, req.body.secretCode, (err, result) => {
        switch (result) {
            case '204':
                res.status(204).send();
                break;
            case '403':
                res.status(403).send({
                    message: 'Provided secret code doesn\'t match'
                });
                break;
            case '404':
                res.status(404).send({
                    message: `Entry with id ${req.params.id} doesn\'t exist`
                });
                break;
            default:
                if (err) {
                    res.status(500).send({ err });
                } else {
                    res.status(500).send();
                }
        }
    });
});

module.exports = app;