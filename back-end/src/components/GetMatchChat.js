const { selectinTable, selectinTableAnd } = require("./Queries");
const { getMessage } = require("./Tools");

const getMatchChat = async (req, res) => {
    var i = 0;
    var j = 0;
    var iduserMatch = [];
    var matchChat = [];

    const match = await selectinTable("user_liked", "likes", "iduser", req.body.iduser);
    while (match[i]) {
        const profil = await selectinTableAnd("iduser", "likes", "iduser", match[i].user_liked, "user_liked", req.body.iduser);
        if (profil[0]) {
            iduserMatch[j] = profil[0].iduser;
            j++;
        }
        i++;
    }
    i = 0;
    j = 0;

    while (iduserMatch[i]) {
        var iduserBlocked = await selectinTable("idReceiverBlock", "user_blocked", "idSenderBlock", req.body.iduser);
        var iduserSendBlock = await selectinTable("idSenderBlock", "user_blocked", "idReceiverBlock", req.body.iduser);

        const profil = await selectinTable("*", "users", "iduser", iduserMatch[i]);

        if (profil[0]) {
            if (iduserBlocked[0] && iduserBlocked[0].idReceiverBlock === profil[0].iduser) {
            } else if (iduserSendBlock[0] && iduserSendBlock[0].idSenderBlock === profil[0].iduser) {
            } else if (
                iduserBlocked[0] &&
                iduserSendBlock[0] &&
                iduserBlocked[0].idReceiverBlock === profil[0].iduser &&
                iduserSendBlock[0].idSenderBlock === profil[0].iduser
            ) {
            } else {
                matchChat[j] = profil[0];
                j++;
            }
        }
        i++;
    }
    var contact = 0;
    if (matchChat[0]) contact = 1;

    res.send({
        matchChat: matchChat,
        contact: contact,
    });
};

module.exports = { getMatchChat };