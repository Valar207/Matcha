const fs = require("fs");
const connection = require("../config/db");
const bcrypt = require("bcrypt");
const { resolve } = require("path");

// ---------------- SELECT ----------------

const selectinTable = (select, from, where, whereVal) => {
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT ${select} FROM ${from} WHERE ${where} = '${whereVal}'`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

const selectinTableWherenotAnd = (select, from, where, whereVal, where2, whereval2) => {
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT ${select} FROM ${from} WHERE ${where} != '${whereVal}' AND ${where2} = '${whereval2}'`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

const selectinTableOr = (select, from, where, whereVal, where2, whereVal2) => {
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT ${select} FROM ${from} WHERE ${where} = "${whereVal}" OR ${where2} = "${whereVal2}"`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

const selectinTableAndOrAnd = (select, from, where1, whereVal1, andwhere1, andwhereVal1, where2, whereVal2, andwhere2, andwhereVal2) => {
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT ${select} FROM ${from} WHERE (${where1} = "${whereVal1}" AND ${andwhere1} = ${andwhereVal1}) OR (${where2} = "${whereVal2}" AND ${andwhere2} = ${andwhereVal2}) ORDER BY id_message asc`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

const selectinTableAnd = (select, from, where, whereVal, where2, whereVal2) => {
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT ${select} FROM ${from} WHERE ${where} = "${whereVal}" AND ${where2} = "${whereVal2}"`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

const selectAge = (select, birthday, age) => {
  const date = new Date(birthday).toISOString().replace(/T/, " ").replace(/\..+/, ""); //convert into correct date
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT ${select} FROM users WHERE TIMESTAMPDIFF(YEAR, "${date}", CURRENT_DATE) = ${age}`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

const selectMatch = async (user) => {
  const promise = new Promise((resolve, reject) => {
    if (user.orientation === "hetero") {
      const query_if_interests = `SELECT count(*) AS cntinterests, b.*
      from user_interests a INNER JOIN users b ON b.iduser = a.iduser
      WHERE a.interest IN (SELECT interest FROM user_interests WHERE iduser = '${user.iduser}') 
      AND a.iduser != '${user.iduser}' 
      AND b.gender != '${user.gender}'
      AND b.orientation != 'homo'
      GROUP BY a.iduser
      ORDER BY cntinterests DESC`;

      connection.query(query_if_interests, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    } else if (user.orientation === "homo") {
      const query_if_interests = `SELECT count(*) AS cntinterests, b.*
      from user_interests a INNER JOIN users b ON b.iduser = a.iduser
      WHERE a.interest IN (SELECT interest FROM user_interests WHERE iduser = '${user.iduser}') 
      AND a.iduser != '${user.iduser}' 
      AND b.gender = '${user.gender}'
      AND b.orientation != 'hetero'
      GROUP BY a.iduser
      ORDER BY cntinterests DESC`;

      connection.query(query_if_interests, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    } else if (user.orientation === "bi") {
      const query_if_interests = `SELECT count(*) AS cntinterests, b.*
      from user_interests a INNER JOIN users b ON b.iduser = a.iduser
      WHERE a.interest IN (SELECT interest FROM user_interests WHERE iduser = '${user.iduser}') 
      AND a.iduser != '${user.iduser}'
      AND ((b.gender = '${user.gender}' AND b.orientation != 'hetero') 
      OR (b.gender != '${user.gender}' AND  b.orientation != 'homo'))  
      GROUP BY a.iduser
      ORDER BY cntinterests DESC`;

      connection.query(query_if_interests, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    }
  });
  return promise;
};

const selectRand = async (select, from) => {
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT ${select} FROM ${from} ORDER BY RAND() LIMIT 10`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

// ---------------- UPDATE ----------------

const updateTable = (update, set, setVal, where, whereVal) => {
  const promise = new Promise((resolve, reject) => {
    const query = `UPDATE ${update} SET ${set} = ${setVal} WHERE ${where} = '${whereVal}'`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};
const updateTableModifprofil = (user, iduser) => {
  const promise = new Promise((resolve, reject) => {
    const query = `UPDATE users SET gender = ?, orientation = ?, lastname = ?, firstname = ?, username = ?, email = ?, bio = ? WHERE iduser = '${iduser}'`;
    connection.query(query, [user.gender, user.orientation, user.lastname, user.firstname, user.username, user.email, user.bio], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};
const updateC1toC2 = (c1, c2) => {
  const promise = new Promise((resolve, reject) => {
    const query = `UPDATE users SET ${c1} = ${c2}`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// ---------------- INTEREST ----------------

const insertInterests = (iduser, value_interest) => {
  const promise = new Promise((resolve, reject) => {
    const query = "INSERT INTO user_interests SET iduser = ?, interest = ?";
    connection.query(query, [iduser, value_interest], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const removeInterests = (iduser, value_interest) => {
  const promise = new Promise((resolve, reject) => {
    const query = "DELETE FROM `user_interests` WHERE `iduser` = ? AND `interest` = ?";
    connection.query(query, [iduser, value_interest], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// ---------------- LIKE ----------------

const insertLikes = async (iduser, user_liked) => {
  const isMatch = await selectinTableAnd("*", "likes", "iduser", user_liked, "user_liked", iduser);
  if (isMatch[0]) {
    const promise = new Promise((resolve, reject) => {
      const query =
        "INSERT INTO likes SET iduser = ?, user_liked = ?; INSERT INTO user_notifications SET id_notif = 4, id_user_receive = ?, id_user_send = ? ; INSERT INTO user_notifications SET id_notif = 4, id_user_receive = ?, id_user_send = ?";
      connection.query(query, [iduser, user_liked, user_liked, iduser, iduser, user_liked], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  } else {
    const promise = new Promise((resolve, reject) => {
      const query =
        "INSERT INTO likes SET iduser = ?, user_liked = ?; INSERT INTO user_notifications SET id_notif = 1, id_user_receive = ?, id_user_send = ?";
      connection.query(query, [iduser, user_liked, user_liked, iduser], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
};

const removeLikes = async (iduser, user_liked) => {
  const isMatch = await selectinTableAnd("*", "likes", "iduser", user_liked, "user_liked", iduser);
  if (isMatch[0]) {
    const promise = new Promise((resolve, reject) => {
      const query =
        "DELETE FROM likes WHERE iduser = ? AND user_liked = ?; DELETE FROM user_notifications WHERE id_user_receive = ? AND id_user_send = ? AND id_notif = 1; INSERT INTO user_notifications SET id_notif = 5, id_user_receive = ?, id_user_send = ?";
      connection.query(query, [iduser, user_liked, user_liked, iduser, user_liked, iduser], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  } else {
    const promise = new Promise((resolve, reject) => {
      const query =
        "DELETE FROM likes WHERE iduser = ? AND user_liked = ?; DELETE FROM user_notifications WHERE id_user_receive = ? AND id_user_send = ? AND id_notif = 1";
      connection.query(query, [iduser, user_liked, user_liked, iduser], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
};

// ---------------- BLOCK ----------------

const insertBlock = (idSenderBlock, idReceiverBlock) => {
  const promise = new Promise((resolve, reject) => {
    const query = "INSERT INTO user_blocked SET idSenderBlock = ?, idReceiverBlock = ?";
    connection.query(query, [idSenderBlock, idReceiverBlock], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const removeBlock = (idReceiverBlock) => {
  const promise = new Promise((resolve, reject) => {
    const query = "DELETE FROM `user_blocked` WHERE `idReceiverBlock` = ?";
    connection.query(query, [idReceiverBlock], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// ---------------- VISIT NOTIF ----------------

const insertVisit = (iduser, user_liked) => {
  const promise = new Promise((resolve, reject) => {
    const query = "INSERT INTO user_notifications SET id_notif = 2, id_user_receive = ?, id_user_send = ?";
    connection.query(query, [iduser, user_liked, user_liked, iduser], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// ---------------- POPULARITY ----------------

const addPopularity = (iduser, nb) => {
  const promise = new Promise((resolve, reject) => {
    const query = `UPDATE users SET popularity = popularity + ${nb} WHERE iduser = ${iduser}`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const removePopularity = (iduser, nb) => {
  const promise = new Promise((resolve, reject) => {
    const query = `UPDATE users SET popularity = popularity - ${nb} WHERE iduser = ${iduser}`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// ---------------- CREATE USER ----------------

const createUser = (users, activationToken) => {
  const saltRounds = 10;
  bcrypt.hash(users.pwd, saltRounds, (err, hash) => {
    const promise = new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users SET firstname = ?, lastname = ?, email = ?, username = ?, gender = ?, orientation = ?, birthday = ?, pwd = ?, tokenactivation = ?,bio = ?,imgprofil = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, img5 = ?, latitude = ?, longitude = ?,online = ?, popularity = ?";
      connection.query(
        query,
        [
          users.firstname,
          users.lastname,
          users.email,
          users.username,
          users.gender,
          users.orientation,
          users.birthday,
          hash,
          activationToken,
          "",
          "/img/default.jpg",
          "/img/default.jpg",
          "/img/default.jpg",
          "/img/default.jpg",
          "/img/default.jpg",
          "/img/default.jpg",
          0,
          0,
          0,
          0,
        ],
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
    return promise;
  });
};

// ---------------- MESSAGE ----------------

const insertMessage = (iduserSend, iduserReceive, message, date) => {
  const promise = new Promise((resolve, reject) => {
    const query =
      "INSERT INTO messages SET user_send = ?, user_receive = ?, message = ?, date = ?; INSERT INTO user_notifications SET id_notif = 3, id_user_receive = ?, id_user_send = ?";
    connection.query(query, [iduserSend, iduserReceive, message, date, iduserReceive, iduserSend], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// ---------------- TRAFIC ----------------

const getTraficId = (idnotif, iduser) => {
  const promise = new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT id_user_send, username,birthday,bio,latitude,longitude, imgprofil,img1,img2,img3,img4,img5,iduser,firstname,lastname,gender,orientation  from user_notifications as un inner join users as u on un.id_user_send =u.iduser  where id_notif = ${idnotif}  AND id_user_receive = ${iduser}`;
    connection.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
  return promise;
};

module.exports = {
  selectMatch,
  selectinTable,
  selectinTableOr,
  selectinTableAnd,
  selectinTableWherenotAnd,
  createUser,
  insertInterests,
  insertLikes,
  removeInterests,
  updateTable,
  selectAge,
  updateC1toC2,
  updateTableModifprofil,
  removeLikes,
  removePopularity,
  addPopularity,
  insertVisit,
  selectinTableAndOrAnd,
  insertMessage,
  insertBlock,
  removeBlock,
  getTraficId,
  selectRand,
};
