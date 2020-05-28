const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'urlAliaser',
    insecureAuth: true
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getUrls(fnHandleUrls) {
    conn.query('select id, url, alias, hitCount, secretCode from urls;', (err, rows) => {
        if (err) {
            console.log(err);
            fnHandleUrls();
        } else {
            fnHandleUrls(rows);
        }
    });
}

function incrementHitCount(alias, fnRedirect) {
    getUrls((rows) => {
        if (rows && rows.map(element => element.alias).includes(alias)) {
            conn.query('update urlAliaser.urls set hitCount = (select hitCount from (select * from urlAliaser.urls) as temporaryUrls where alias = ?) + 1 where alias = ?;', [alias, alias], (error) => {
                if (error) {
                    fnRedirect();
                } else {
                    fnRedirect(rows.filter(element => element.alias == alias)[0].url);
                }
            })
        } else {
            fnRedirect();
        }
    })
}

function addUrls(url, fnHandleNewUrl) {
    secretCode = getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString() + getRandomInt(10).toString();
    conn.query('INSERT INTO urlAliaser.urls(url, alias, secretCode) VALUES(?, ?, ?);', [url.url, url.alias, secretCode], (error, result) => {
        if (error) {
            console.log(error);
            if (error.sqlMessage.includes('secretCode')) {
                fnHandleNewUrl('Secret code already exists. Try again!');
            } else if (error.sqlMessage.includes('alias')) {
                fnHandleNewUrl('Your alias already in use!');
            }

        } else {
            let res = {                       //replace with geturl!!!!
                id: result.insertId,
                url: url.url,
                alias: url.alias,
                hitCount: 0,
                secretCode: secretCode
            }
            fnHandleNewUrl(undefined, res);
        }
    });
}

function deleteUrl(id, secretCode, fnHandleDeletion) {
    getUrls((rows) => {
        if (rows && rows.filter(element => element.id == id && element.secretCode == secretCode).length != 0) {
            conn.query('DELETE FROM urlAliaser.urls WHERE id = ? AND secretCode = ?', [id, secretCode], (error, result) => {
                if (error) {
                    console.log(error);
                    fnHandleDeletion(error);
                } else {
                    fnHandleDeletion(undefined, '204');
                }
            })
        } else if (rows && rows.filter(element => element.id == id).length != 0) {
            fnHandleDeletion(undefined, '403')
        } else {
            fnHandleDeletion(undefined, '404')
        }
    });
}

module.exports = {
    getUrls,
    addUrls,
    incrementHitCount,
    deleteUrl
}