const connection = require("../config/db");
const faker = require("faker");
const { format } = require("mysql");

const deleteFrom = () => {
    const promise = new Promise((resolve, reject) => {
        const query = "DELETE from users";
        connection.query(query, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
    return promise;
};
const reset = () => {
    const promise = new Promise((resolve, reject) => {
        const query = "ALTER TABLE users AUTO_INCREMENT = 1";
        connection.query(query, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
    return promise;
};

const updateTable = (i) => {
    const orientationlist = ["hetero", "homo", "bi"];
    const genderlist = ["male", "female"];
    const onlinelist = [1, 0];

    function randomDate(start, end) {
        var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    }

    const randomDateUnlog = (start, end) => {
        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        var dateObj = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var hours = addZero(dateObj.getHours());
        var minutes = addZero(dateObj.getUTCMinutes());
        var seconds = addZero(dateObj.getUTCSeconds());

        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    };

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    var lat = getRandomArbitrary(43, 51);
    var lon = getRandomArbitrary(-4.8, 8);

    let firstname = "";
    let lastname = faker.name.lastName();
    let email = faker.internet.email();
    let gender = genderlist[Math.floor(Math.random() * genderlist.length)];
    let orientation = orientationlist[Math.floor(Math.random() * orientationlist.length)];
    let birthday = randomDate(new Date(1920, 0, 1), new Date(2002, 0, 1));
    let pwd = "$2b$10$ICNZV9EFefVcQWgNBEPogekWExJxXnO2p0mgqi0qdIYaKNjZJJmqG";
    let latitude = lat;
    let longitude = lon;
    var pic = "";
    let online = onlinelist[Math.floor(Math.random() * onlinelist.length)];
    let fames = Math.floor(Math.random() * 1000);
    let date_unlog = randomDateUnlog(new Date(2019, 0, 1), new Date(2020, 9, 1));

    if (gender == "male") {
        firstname = faker.name.firstName("male");
        pic = "men";
    } else if (gender == "female") {
        firstname = faker.name.firstName("female");
        pic = "women";
    }

    const promise = new Promise((resolve, reject) => {
        const query =
            "INSERT INTO users SET firstname = ?, lastname = ?, email = ?, username = ?, gender = ?, orientation = ?, birthday = ?, pwd = ?, activation = 1, tokenactivation = ?,bio = ?,imgprofil = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, img5 = ?, latitude = ?, longitude = ?, online=?, popularity=?, date_unlog=?";
        connection.query(
            query,
            [
                firstname,
                lastname,
                email,
                firstname,
                gender,
                orientation,
                birthday,
                pwd,
                "",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                `img1`,
                `https://randomuser.me/api/portraits/${pic}/${i}.jpg`,
                `https://randomuser.me/api/portraits/${pic}/${i}.jpg`,
                `https://randomuser.me/api/portraits/${pic}/${i}.jpg`,
                `https://randomuser.me/api/portraits/${pic}/${i}.jpg`,
                `https://randomuser.me/api/portraits/${pic}/${i}.jpg`,
                latitude,
                longitude,
                online,
                fames,
                date_unlog,
            ],
            (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            }
        );
    });
    return promise;
};
const updateInterest = (iduser, interest) => {
    const promise = new Promise((resolve, reject) => {
        const query = "INSERT INTO user_interests SET iduser=?, interest=?";
        connection.query(query, [iduser, interest, interest], (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
    return promise;
};

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

deleteFrom();
reset();

var i = 1;
for (var iduser = 1; iduser <= 200; iduser++) {
    if (i == 100) i = 1;
    updateTable(i);
    shuffle(arr);
    i++;
    for (var j = 1; j <= Math.floor(Math.random() * 10) + 2; j++) {
        if (arr[j]) updateInterest(iduser, arr[j]);
        else break;
    }
}