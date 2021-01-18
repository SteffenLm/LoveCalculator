const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const secretKey = require('./src/secret.json');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

//init database
const dbPath = path.resolve(__dirname, 'lovecalculator.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }

    const userTableQuery = `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        mail TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password char(255) NOT NULL
    );`;
    db.run(userTableQuery);
    const matchTableQuery = `CREATE TABLE IF NOT EXISTS match (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userid INTEGER NOT NULL,
        firstname TEXT NOT NULL,
        secondname TEXT NOT NULL,
        result INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
        CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES user (id),
        CONSTRAINT UQ_match UNIQUE(userid, firstname, secondname)
    );`;
    // const matchTableQuery = `DROP TABLE IF EXISTS match`;
    db.run(matchTableQuery);
    const horoscopeTableQuery = `CREATE TABLE IF NOT EXISTS horoscope (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        horoscope_text TEXT NOT NULL
    );`;
    db.run(horoscopeTableQuery);
    const horoscopeTableData = `INSERT INTO horoscope (horoscope_text)
    VALUES 
    ('In Ihren Beziehungen dürfte heute einiges los sein. Vielleicht haben Sie eine festgefahrene Situation zu bereinigen.'),
    ('Eventuell eskalieren Unstimmigkeiten auch in einem Streit. Falls Sie bereits reinen Tisch gemacht haben, besteht die Chance, einen tollen und lebhaften Tag zu zweit zu verbringen.'),
    ('Sorgen Sie diesen Nachmittag für Ihr Wohlbefinden und fordern Sie nicht zu viel von sich selbst! '),
    ('Sie dürften leicht ungehalten reagieren, wenn jemand Erwartungen an Sie stellt. '),
    ('Was Sie jetzt brauchen, sind ein paar Streicheleinheiten.Der Tag mag mit allerlei Alltäglichem beginnen. '),
    ('Im Laufe des Tages wechselt die sachlich-bodenständige Stimmung mehr in ein Bedürfnis nach Stil, Genuss und Kontakt. Die Mitmenschen werden wichtig.'),
    ('Beziehungen sind nicht immer vernünftig und heute dürfte der Verstand ein besonders kühles Licht auf Liebe, Nähe und Gemeinsamkeit werfen.'),
    ('Sind Sie schon am frühen Morgen sauer, weil Sie sich zu viel aufgeladen haben? Verantwortung kann ganz schön drücken. '),
    ('Nehmen Sie sich trotzdem Zeit, für Ihr eigenes Wohlbefinden zu sorgen. Je besser es Ihnen geht, desto leistungsfähiger sind Sie.'),
    ('Falls Sie erwarten, dass andere sich diesen Vormittag um Ihr Wohlbefinden kümmern, könnten Sie enttäuscht werden. Sorgen Sie selbst dafür, dass es Ihnen gut geht! '),
    ('Wenn Sie sich wohlfühlen, fühlen sich auch andere mit Ihnen wohl. Einem gemütlichen Beisammensein steht dann nichts mehr im Wege.'),
    ('Sich schöpferisch zum Ausdruck zu bringen ist Aufforderung und Chance dieses Tages. Lassen Sie sich nicht von Selbstzweifeln daran hindern! '),
    ('Sie sind ein Individuum und haben als solches einmalige Ausdrucksformen. Wenn Sie andere nachahmen, sind Sie auf dem falschen Weg.'),
    ('Heute möchte Ihre verspielte, erotische Seite zum Zuge kommen. Flirten Sie aber nicht am Arbeitsplatz! Sie riskieren sonst Ihren Ruf. '),
    ('Am Abend macht Flirten mehr Spaß und birgt keine beruflichen Risiken. Bleiben Sie möglichst wenig allein und starten Sie doch z.B. einfach einen Chat.'),
    ('Sie sprechen heute eine deutlichere Sprache als sonst, denn Ihr Geist und Verstand sind besonders angeregt. '),
    ('So können Sie einerseits Ihren Willen klar äußern, rufen jedoch gerade dadurch auch den Widerstand der Mitmenschen auf den Plan. '),
    ('Eine Tendenz, mehr zu sagen, als Sie eigentlich beabsichtigen, könnte Sie jetzt in unangenehme Situationen bringen.'),
    ('Sind Sie voller Selbstvertrauen und Optimismus? Heute neigen Sie dazu, Ihre Möglichkeiten zu überschätzen. Nur das Beste scheint gut genug. '),
    ('Sie sollen zwar gebotene Chancen nutzen. Vergessen Sie jedoch nicht, ein paar kritische Fragen nach den Konsequenzen zu stellen! '),
    ('Sie können sich so vor folgenschwerem Übertreiben bewahren.'),
    ('Heute dürfen Sie das Leben in vollen Zügen genießen. Doch aufgepasst, dass die Freude über die Fülle des Daseins Sie nicht das Maß vergessen lässt! '),
    ('Wenn Sie aus dem Vollen schöpfen, ist auch die Versuchung zum Übertreiben nah. '),
    ('Nicht nur zu viele Süßigkeiten schaffen es jetzt, Ihnen gründlich den Magen und die Lebensfreude zu verderben, wenn Sie sich nicht vorsehen.'),
    ('Schwächen haben - wie alles im Leben - zwei Seiten. '),
    ('Es ist unbefriedigend, anerkennen zu müssen, dass einem dieses oder jenes fehlt und man gewisse Dinge nicht erreichen oder sich aneignen kann. '),
    ('Es sind gerade die Erkenntnisse von Grenzen und Unzulänglichkeiten, die das Verständnis für andere Menschen mit ähnlichen Schwierigkeiten wecken.'),
    ('In Ihren Beziehungen dürfte heute einiges los sein. Vielleicht haben Sie eine festgefahrene Situation zu bereinigen. '),
    ('Eventuell eskalieren Unstimmigkeiten auch in einem Streit. Falls Sie bereits reinen Tisch gemacht haben, besteht die Chance, einen tollen Tag zu zweit zu verbringen.'),
    ('Sorgen Sie diesen Nachmittag für Ihr Wohlbefinden und fordern Sie nicht zu viel von sich selbst! '),
    ('Sie dürften leicht ungehalten reagieren, wenn jemand Erwartungen an Sie stellt. Was Sie jetzt brauchen, sind ein paar ruhige Minuten.'),
    ('Das Blut pulsiert jetzt gleichsam schneller durch die Adern. Energisch und tatkräftig treten Sie der Welt entgegen. '),
    ('Wer Sie in Ihrem Freiraum einschränkt, Ihnen Unrecht tut oder Ihnen sonst zu nahe tritt, muss mit einer heftigen Reaktion rechnen. '),
    ('Sie wollen Ihren Weg gehen und nicht daran gehindert werden. Was die anderen denken, kümmert Sie heute weniger als sonst.'),
    ('Mit gestärktem Selbstvertrauen treten Sie der Umwelt entgegen, packen die Herausforderungen des Lebens tatkräftig an, vollbringen viel und bleiben doch stets guter Dinge. Man könnte sagen, dass Hindernisse wie Schnee in der Sonne schmelzen. Sie schaffen alles!'),
    ('Sie finden jetzt nahezu überall einen Weg, legen aktiv Hand an und fühlen sich dabei lebendig und sich selbst nahe.'),
    ('Da Sie ein entspanntes Klima verbreiten, begegnen Ihnen die Mitmenschen mit Wohlwollen. Beziehungen gedeihen auf diesem liebevollen Boden besonders gut. '),
    ('Wenn Sie Konflikte auszutragen haben, so eignet sich die Zeit gut dafür. Aber bleiben Sie kompromissbereit.'),
    ('Sie sind bereit, sowohl auf die Anliegen des Gegenübers einzugehen als auch sich selbst klar zum Ausdruck zu bringen.'),
    ('Beziehungen sind manchmal schwierig. Sie erleben heute möglicherweise die weniger erfreulichen Aspekte des Zusammenseins. '),
    ('Vielleicht haben Sie den Eindruck, kaum beziehungsfähig zu sein. Lassen Sie sich nicht entmutigen und gehen Sie auf andere Menschen zu!'),
    ('Heute werden Sie belohnt, der passende Mensch wird bald in Ihr Leben treten, egal ob in der Liebe oder beruflich.'),
    ('Sie handeln heute, insbesondere am Nachmittag und Abend, spontaner, direkter und gefühlvoller als üblich. '),
    ('Je mehr das Kind in Ihnen zum Zuge kommt, umso mehr Spaß können Sie haben.'),
    ('Nicht nur Sie, sondern auch Ihre Mitmenschen sind heute besonders freundlich. Ein nettes Wort tut gut, vorausgesetzt, es ist ehrlich gemeint. '),
    ('Sie sind kaum zum Streiten aufgelegt. Damit wächst die Gefahr, Konflikte zu beschönigen, anstatt sie auszutragen.'),
    ('Heute kommen Sie mit Alltagstrott nicht so gut klar. Sie brauchen die Möglichkeit, mal aus dem Gewohnten auszubrechen und Neuland zu betreten. '),
    ('Machen Sie selbst den ersten Schritt und warten Sie nicht, bis jemand anderes Sie dazu animiert.'),
    ('Heute könnte etwas passieren, was Ihnen stärker zusetzt, als Sie vielleicht zugeben möchten. '),
    ('Ein Ereignis bringt Ihre Gefühle durcheinander und macht Sie sehr emotional. '),
    ('Versuchen Sie nicht, alles von sich zu schieben und zu verdrängen, sondern überlegen Sie sich, was es damit auf sich hat und ob Sie nicht vielleicht handeln sollten.'),
    ('Sie würden heute Nachmittag am liebsten ein paar völlig unbeschwerte Stunden verbringen. '),
    ('Ihre Gefühle und Bedürfnisse nach Zuneigung und Umsorgtwerden melden sich und lassen Sie die Pflichten des Tages als Last empfinden. '),
    ('Gönnen Sie sich etwas Ruhe. Sie haben es verdient.'),
    ('Nehmen Sie sich Zeit zum Träumen! '),
    ('Jetzt sind Ihrer Fantasie in kreativer und künstlerischer Richtung kaum Grenzen gesetzt. '),
    ('Wichtige Entscheidungen verschieben Sie jedoch besser.'),
    ('Sich einer romantischen Stimmung hinzugeben und ein bisschen von der großen Liebe zu träumen, dürfte heute eine besondere Wohltat sein. '),
    ('Nehmen Sie sich die Zeit für einen kritischen Blick auf Ihre Woche.'),
    ('Sie arbeiten zu viel, machen Sie langsam und nehmen Sie eine wohltuende Auszeit.'),
    ('Heute sind es die kleinen Dinge im Leben, die Ihnen Freude und Kraft schenken können. '),
    ('Öffnen Sie sich dafür und genießen Sie den Augenblick. Unliebsame Aufgaben oder Tätigkeiten, die eine hohe Konzentration erfordern, dürfen Sie verschieben.'),
    ('Ziehen Sie Bilanz! Was haben Sie in den letzten Jahren solide aufgebaut, was haben Sie versäumt? '),
    ('Heute werden Sie mit den Konsequenzen konfrontiert. Übernehmen Sie die Verantwortung! Sie können jetzt vieles verbessern.'),
    ('Diesen Nachmittag oder Abend dürften Ihnen ein paar Stunden zu zweit sehr gelegen kommen. '),
    ('Das Zusammensein mit einem lieben Menschen kann Ihnen jetzt das Wohlbefinden vermitteln, das Sie brauchen. '),
    ('Auch wenn Sie nicht zu Taten aufgelegt sind, müssen Sie eventuell doch den ersten Schritt dazu unternehmen.'),
    ('Nehmen Sie sich für heute nicht zu viel vor. Es fällt schwer, sich zu motivieren, wenn die To-do-Liste zu lang ist. '),
    ('Besser ist, Sie genießen Ihre Freizeit und unternehmen dann etwas, das Ihnen Freude bereitet.'),
    ('In Diskussionen und Streitgesprächen sind Sie heute besonders stark. '),
    ('Sie vermögen die Unterschiede und Ungereimtheiten klar beim Namen zu nennen und Ihre Argumente mit Nachdruck zu vertreten.'),
    ('Ein Telefon, das dauernd klingelt, anregende Diskussionen, neue Interessen oder eine gute Nachricht sind einige der vielen Facetten der Informationswelle.'),
    ('Auch Ihr Rat wird gern von anderen angenommen. Sie sind der Champion!'),
    ('Am liebsten würden Sie vermutlich ein paar Stunden zusammen mit Ihren Lieben mit Nichtstun verbringen. '),
    ('Aber selbst dies vermag Ihre innere Spannung nicht ganz zu lösen. Gönnen Sie sich eine Kleinigkeit, um Ihr Wohlbefinden zu steigern!'),
    ('Es muss nicht gerade ein neuer Liebhaber auf der Bildfläche erscheinen, aber Sie dürften feststellen, wie Sie verstärkt auf Charme und Charisma reagieren. '),
    ('Partnerschaft ist nicht einfach eine klare, sachliche Abmachung, sondern eine tiefgründige, emotionale Herzensangelegenheit.'),
    ('Heute mag Ihnen nur das Beste gut genug sein. Sie sind sehr optimistisch und voller Selbstvertrauen, neigen allerdings auch dazu, zu viel zu wollen. '),
    ('Das Vertrauen in Ihre Möglichkeiten verleiht Ihnen enorme Kräfte. Es verführt Sie aber auch zu Arroganz. '),
    ('Sie können jetzt Großes erreichen, vorausgesetzt Sie übertreiben nicht.'),
    ('Sie handeln überlegt, gründlich und zuverlässig und haben gute praktische Fähigkeiten. '),
    ('Heute mischen sich Gefühle in Ihr solides Vorgehen und bringen Farbe in den gewohnten Alltag. '),
    ('Sind Sie ungeduldig, kritisch oder gar zum Nörgeln bereit? Sie könnten Ihr umsichtiges Vorgehen und Ihren optimalen Kräfteeinsatz auch einfach nur genießen.'),
    ('Es wird aufregend! Pluto lässt die Urgewalt der Gefühle los und löst damit eine Dynamik aus, die Ihre Vernunft und Disziplin komplett unterlaufen kann. '),
    ('Wahre Liebe, Lust und Hingabe sind nur möglich, wenn man sich zeigt: offen, ohne Absicherung, mit allem, was man hat. '),
    ('Laufe langsam, und du findest zu dir zurück: ein schönes Mantra.'),
    ('Mit Achtsamkeit gelänge alles viel eher, andere zu Verbündeten zu machen. '),
    ('Sie wollen viel und springen auch auf Erwartungen von außen sofort an. '),
    ('Bitte denken Sie daran, dass es zwar ehrenvoll ist, für andere Sorge zu tragen, es aber nicht auf Ihre Kosten gehen darf.'),
    ('Behalten Sie sich gut im Blick, zumal Sie auch dazu neigen, die Hilferufe Ihres Körpers auszublenden.'),
    ('Achten Sie auf Ihre Träume: In denen sendet das Unbewusste Botschaften, die Ihnen helfen, wieder ins Lot zu kommen. '),
    ('Hürden und Stolpersteine auf Ihrem Weg können wichtige Hinweise sein – auf innere Blockaden, die gelöst, und Muster, die geändert werden sollten.'),
    ('Unter Jupiter und Saturn wechseln Sie die Umlaufbahn: Glauben Sie an Wunder – das lockt sie an!'),
    ('Sie brauchen jemanden, die/der Sie spürt, aber nicht alles kommentiert. Brauchen Tiefe, aber auch Raum, keine Klette, die sich an Sie hängt.'),
    ('Was Beziehungen in Ihnen auslösen, gehört zu Ihnen – versuchen Sie, achtsam damit umzugehen.'),
    ('Sie stehen in der Gunst der Sterne und können Liebe in ihrer schönsten Form erleben. '),
    ('Leere schafft Platz für Gedanken und Kreativität. Also lassen Sie sich nicht ablenken, bleiben Sie bei sich, um zu klären: Was kann ich, was macht mich aus, was will ich?'),
    ('In der Ruhe liegt die Kraft: Das sollten Sie sich an den Spiegel pinnen.'),
    ('Gib deiner Größe Raum! Uranus mischt ebenfalls mit, sorgt für Abwechslung und ermutigt Sie, neue Wege zu gehen – und etwas plakativer aufzutreten.');`;
    db.run(horoscopeTableData);
});

app.use(express.json());
app.post('/api/register', function (req, res, next) {
    const name = req.body.name;
    const password = req.body.password;
    const username = req.body.username;
    const mail = req.body.mail;
    const isValidMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail);
    if (name != null && name != '' && name.length >= 3
        && password != null && password != '' && password.length >= 8
        && username != null && username != '' && username.length >= 3
        && isValidMail) {
        //check if mail is already used
        const countQuery = `SELECT COUNT(*) AS NoOfMails
        FROM user
        WHERE mail = ?`;
        db.get(countQuery, [mail], (err, row) => {
            if (row.NoOfMails === 0) {
                //check if username is already used
                const countUsernameQuery = `SELECT COUNT(*) as NoOfUsernames
                FROM user
                WHERE username = ?`;
                db.get(countUsernameQuery, [username], function (err, row) {
                    if (row.NoOfUsernames === 0) {
                        db.run(`INSERT INTO user(name, mail, username, password) VALUES(?, ?, ?, ?)`, [name, mail, username, password], function (err) {
                            if (err) {
                                res.status(400).end();
                            } else {
                                res.status(200).end();
                            }
                        });
                    } else {
                        res.status(400).end();
                    }
                });
            } else {
                res.status(400).end();
            }
        });
    } else {
        res.status(400).end();
    }
});

app.post('/api/login', function (req, res, next) {
    const password = req.body.password;
    const username = req.body.username;
    if (password != null && password != '' && password.length >= 8 && username != null && username != '' && username.length >= 3) {
        //check if mail is already used
        const countQuery = `SELECT *
        FROM user
        WHERE username = ?`;
        db.get(countQuery, [username], (err, row) => {
            if (row.username == username && row.password === password) {
                const payload = {
                    sub: row.id
                };
                const token = jwt.sign(payload, secretKey.secret);
                res.status(200).send(token);
            } else {
                res.status(400).end();
            }
        });
    } else {
        res.status(400).end();
    }
});

app.post('/api/match', function (req, res, next) {
    const token = req.headers.authorization.slice(7)
    if ((token !== undefined || token !== null) &&
        (req.body.firstname !== null && req.body.firstname !== undefined && req.body.firstname.length >= 3) &&
        (req.body.secondname !== null && req.body.secondname !== undefined && req.body.secondname.length >= 3) &&
        (req.body.result !== null && req.body.result !== undefined && req.body.result >= 0 && req.body.result <= 100)) {
        const payload = jwt.verify(token, secretKey.secret);
        const userid = payload.sub;
        const insertMatchQuery = `INSERT INTO match (userid, firstname, secondname, result) VALUES (?, ?, ?, ?)`;
        db.run(insertMatchQuery, [userid, req.body.firstname, req.body.secondname, req.body.result], function (err) {
            if (err) {
                if (err.errno === 19) {
                    res.status(400).send({ msg: 'Match already saved!' });
                } else {
                    res.status(400).end();
                }
            } else {
                res.status(201).send();
            }
        });

    } else {
        res.status(401).end();
    }
});

app.get('/api/match', function (req, res, next) {
    const token = req.headers.authorization.slice(7)
    if (token !== undefined && token !== null) {
        const payload = jwt.verify(token, secretKey.secret);
        const userid = payload.sub;
        const selectMatchQuery = `
        SELECT firstname, secondname, result, created_at
        FROM match
        WHERE userid = ?`;
        db.all(selectMatchQuery, [userid], function (err, rows) {
            res.status(200).send(rows);
        });
    } else {
        res.status(401).end();
    }
});

app.get('/api/user', function (req, res, next) {
    const token = req.headers.authorization.slice(7)
    if (token !== undefined && token !== null) {
        const payload = jwt.verify(token, secretKey.secret);
        const userid = payload.sub;
        const selectUserQuery = `
        SELECT username, mail
        FROM user
        WHERE id = ?`;
        db.all(selectUserQuery, [userid], function (err, rows) {
            res.status(200).send(rows[0]);
        });
    } else {
        res.status(401).end();
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTwelveRandomUniqueIntForHoroscope() {
    const randomInts = [];
    while (randomInts.length < 12) {
        const generatedInt = getRandomInt(1, 99);
        if (!randomInts.includes(generatedInt)) {
            randomInts.push(generatedInt);
        }
    }
    return randomInts;
}

app.get('/api/horoscope', function (req, res, next) {
    const token = req.headers.authorization.slice(7)
    if (token !== undefined && token !== null) {
        const payload = jwt.verify(token, secretKey.secret);
        const selectMatchQuery = `
        SELECT horoscope_text
        FROM horoscope
        WHERE id IN (?,?,?,?,?,?,?,?,?,?,?,?)`;
        db.all(selectMatchQuery, getTwelveRandomUniqueIntForHoroscope(), function (err, rows) {
            res.status(200).send(rows.map((element) => { return element.horoscope_text }));
        });
    } else {
        res.status(401).end();
    }
});

const port = 8080;
app.listen(port, function () {
    console.log('app listening on port ' + port);
});