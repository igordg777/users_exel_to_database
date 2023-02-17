const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser');
const pg = require('pg')

const config = {
    user: 'postgres',
    database: 'users_from_exel',
    password: 'postgres',
    port: 5432
};

const pool = new pg.Pool(config);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.get('/', function (req, res) {
    res.send('Hello World!!!')
})

app.post('/users_to_database', function (req, res) {
    // console.log(req.body.users)

    let result_str = "INSERT INTO users (fio, position, salary, education) VALUES "


    let arr_users = req.body.users;

    for (let i = 1; i < arr_users.length; i++) {
        result_str += `('${arr_users[i][0]}', '${arr_users[i][1]}', '${arr_users[i][2]}', '${arr_users[i][3]}'), `
    }

    console.log(result_str.substring(0, result_str.length - 2) + ';');

    // INSERT INTO users ('fio', 'position', 'salary', 'education') VALUES ('Иванов В.В.', 'Начальник', '150000', 'Высшее'), ('Петров А.А.', 'Заместитель', '130000', 'Высшее'), ('Сидоров Б.Б.', 'Специалист', '80000', 'Среднее специальное');

    let result_str_to_save = result_str.substring(0, result_str.length - 2) + ';'

    pool.connect(function (err, client, done) {

        if (err) {
            console.log("Can not connect to the DB" + err);
        }


        client.query(result_str_to_save, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            console.log(result.rows);

            res.status(200).json({ respone: "Пользователи успешно сохранены" })
        })
    })



})


app.listen(5000, console.log('сервер запущен на порту 5000'))