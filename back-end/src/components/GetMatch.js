const { getAge, getDistance } = require("./Tools");
const { selectMatch, selectinTable, selectinTableAnd } = require("./Queries");

const getMatch = async (req, res) => {
  var { user, tag, ageSort, distanceSort, interestSort, tagsSort, fameSort } = req.body;
  var { age, km } = req.body.filter;
  var ageMin = age[0];
  var ageMax = age[1];

  var iduserBlocked = await selectinTable("idReceiverBlock", "user_blocked", "idSenderBlock", user.iduser);
  var iduserSendBlock = await selectinTable("idSenderBlock", "user_blocked", "idReceiverBlock", user.iduser);

  const allProfiles = await selectMatch(user);
  var Tags = [];

  var i = 0;
  var j = 0;

  var profilesWithFilters = [];

  while (allProfiles[i]) {
    const islike = await selectinTableAnd("*", "likes", "iduser", user.iduser, "user_liked", allProfiles[i].iduser);
    if (islike[0]) {
      allProfiles[i].liked = 1;
    } else {
      allProfiles[i].liked = 0;
    }

    // FILTERING BY AGE BETWEEN
    allProfiles[i].age = getAge(allProfiles[i].birthday);
    allProfiles[i].distance = getDistance(user.latitude, user.longitude, allProfiles[i].latitude, allProfiles[i].longitude);

    if (ageMin <= allProfiles[i].age && allProfiles[i].age <= ageMax && allProfiles[i].distance <= km) {
      profilesWithFilters[j] = allProfiles[i];
      j++;
    }
    i++;
  }

  // FUNCTION POUR RANGER ORDRE CROISSANT ET DECROISSANT AGE ET DISTANCE
  function AgeCroissant(a, b) {
    if (a.age < b.age) return -1;
    if (a.age > b.age) return 1;
    return 0;
  }
  function AgeDecroissant(a, b) {
    if (a.age > b.age) return -1;
    if (a.age < b.age) return 1;
    return 0;
  }

  function DistanceCroissant(a, b) {
    if (a.distance < b.distance) return -1;
    if (a.distance > b.distance) return 1;
    return 0;
  }
  function DistanceDecroissant(a, b) {
    if (a.distance > b.distance) return -1;
    if (a.distance < b.distance) return 1;
    return 0;
  }

  function FameCroissant(a, b) {
    if (a.popularity < b.popularity) return -1;
    if (a.popularity > b.popularity) return 1;
    return 0;
  }
  function FameDecroissant(a, b) {
    if (a.popularity > b.popularity) return -1;
    if (a.popularity < b.popularity) return 1;
    return 0;
  }

  function InterestCroissant(a, b) {
    if (a.cntinterests < b.cntinterests) return -1;
    if (a.cntinterests > b.cntinterests) return 1;
    return 0;
  }
  function InterestDecroissant(a, b) {
    if (a.cntinterests > b.cntinterests) return -1;
    if (a.cntinterests < b.cntinterests) return 1;
    return 0;
  }

  // FILTER BY AGE ASC OR DESC
  if (ageSort.value) {
    distanceSort.value = null;
    interestSort.value = null;
    if (ageSort.value === "asc") {
      profilesWithFilters.sort(AgeCroissant);
    } else if (ageSort.value === "desc") {
      profilesWithFilters.sort(AgeDecroissant);
    }
  }

  // FILTER BY DISTANCE ASC OR DESC
  if (distanceSort.value) {
    ageSort.value = null;
    interestSort.value = null;
    if (distanceSort.value === "asc") {
      profilesWithFilters.sort(DistanceCroissant);
    } else if (distanceSort.value === "desc") {
      profilesWithFilters.sort(DistanceDecroissant);
    }
  }

  // FILTER BY FAME ASC OR DESC
  if (fameSort.value) {
    ageSort.value = null;
    interestSort.value = null;
    if (fameSort.value === "asc") {
      profilesWithFilters.sort(FameCroissant);
    } else if (fameSort.value === "desc") {
      profilesWithFilters.sort(FameDecroissant);
    }
  }

  // FILTER BY INTERESTS ASC OR DESC
  if (interestSort.value) {
    ageSort.value = null;
    distanceSort.value = null;
    if (interestSort.value === "asc") {
      profilesWithFilters.sort(InterestCroissant);
    } else if (interestSort.value === "desc") {
      profilesWithFilters.sort(InterestDecroissant);
    }
  }

  // GET INTERESTS IN USERS CARDS BY USER ALREADY FILTERED
  i = 0;
  while (profilesWithFilters[i]) {
    const interests = await selectinTable("interest", "user_interests", "iduser", profilesWithFilters[i].iduser);

    var nb_interest = 0;
    var tags = [...tag];

    while (interests[nb_interest]) nb_interest++;

    // iduserBlocked.forEach((element) => {
    //   if (profilesWithFilters[i].iduser === element.idReceiverBlock) {
    //     profilesWithFilters.splice(i, 1);
    //   }
    // });

    profilesWithFilters[i].interests = [];

    tag.map((tag) => {
      for (var j = 0; j < nb_interest; j++) {
        if (tag.value === interests[j].interest) {
          tags[tag.value - 1] = {
            name: tag.name,
            value: tag.value,
            actif: 1,
          };
          profilesWithFilters[i].interests[j] = tag.value;
        }
      }
    });
    Tags[i] = tags;

    i++;
  }

  let profilesByInterest = profilesWithFilters.filter((person) => {
    return person.interests.every((interest) => {
      const tag = tagsSort.find((elem) => elem.value === interest);
      return tag.actif;
    });
  });

  let TagsByInterest = Tags.filter((personnalInterrests) => {
    return personnalInterrests.every((interest) => {
      if (interest.actif) {
        const tag = tagsSort.find((elem) => {
          return elem.value === interest.value;
        });
        if (!tag.actif) {
          return false;
        }
      }
      return true;
    });
  });

  iduserBlocked.forEach((blocked) => {
    for (var i = 0; i < profilesByInterest.length; i++) {
      if (profilesByInterest[i].iduser === blocked.idReceiverBlock) {
        profilesByInterest.splice(i, 1);
        TagsByInterest.splice(i, 1);
      }
    }
  });

  iduserSendBlock.forEach((blocked) => {
    for (var i = 0; i < profilesByInterest.length; i++) {
      if (profilesByInterest[i].iduser === blocked.idSenderBlock) {
        profilesByInterest.splice(i, 1);
        TagsByInterest.splice(i, 1);
      }
    }
  });

  if (profilesByInterest) {
    res.send({
      profiles: profilesByInterest,
      interestsByProfile: TagsByInterest,
      status: "success",
    });
  } else res.send({ error: "fail" });
};

module.exports = {
  getMatch,
};