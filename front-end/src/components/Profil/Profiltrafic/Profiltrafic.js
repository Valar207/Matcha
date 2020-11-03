import React, { useState, useEffect } from "react";
import "./Profiltrafic.css";
import { Row, Col, Image, Container } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

// SELECT DISTINCT id_user_send from user_notifications where id_notif = 2 AND id_user_receive = 55

export const ProfilTrafic = (props) => {
  const { user } = props;

  const [tagsSort] = useState([
    { name: "Music", value: 1, actif: 0 },
    { name: "Sport", value: 2, actif: 0 },
    { name: "Games", value: 3, actif: 0 },
    { name: "Animals", value: 4, actif: 0 },
    { name: "Party", value: 5, actif: 0 },
    { name: "Arts", value: 6, actif: 0 },
    { name: "Movies", value: 7, actif: 0 },
    { name: "Travels", value: 8, actif: 0 },
    { name: "Cooking", value: 9, actif: 0 },
    { name: "Dance", value: 10, actif: 0 },
  ]);
  const [person, setPerson] = useState([]);
  const [personLike, setPersonLike] = useState([]);
  const [userVisit, setUserVisit] = useState([]);
  const [userLike, setUserLike] = useState([]);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    axios.post("/getVisitTrafic", { user }).then((res) => {
      if (isMounted)
        setUserVisit(res.data);
    });
    axios.post("/getLikeTrafic", { user }).then((res) => {
      if (isMounted)
        setUserLike(res.data);
    });
    axios.post("/getViewProfileVisit", { user, tagsSort }).then((res) => {
      if (isMounted)
        setPerson(res.data.allPersons);
    });
    axios.post("/getViewProfileLike", { user, tagsSort }).then((res) => {
      if (isMounted)
        setPersonLike(res.data.allPersons);
    });
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Container className="profilContainer">
        <h4>Trafic profil :</h4>
        <br />
        <Row>
          <Col>
            <p className="test mb-5">People who visited your profil</p>
            <Col className="profiltrafic">
              {userVisit.map((visit, i) => (
                <Row key={i} className="justify-content-md-center" style={{ marginBottom: "15px", justifyContent: "center" }}>
                  <Image
                    style={{ height: "70px", width: "70px", borderRadius: "70px", color: "white", marginRight: "15px" }}
                    src={
                      visit.imgprofil === "img1"
                        ? visit.img1
                        : visit.imgprofil === "img2"
                          ? visit.img2
                          : visit.imgprofil === "img3"
                            ? visit.img3
                            : visit.imgprofil === "img4"
                              ? visit.img4
                              : visit.imgprofil === "img5"
                                ? visit.img5
                                : visit.imgprofil
                    }
                  />

                  <div className="">
                    <p style={{ fontSize: "24px", marginBottom: "10px" }}>{visit.username}</p>

                    {person[i] ? (
                      <Link

                        to={{
                          pathname: `/profiluserpage/${person[i].match.username}`,
                          state: { match: person[i].match, tag: person[i].tag, user: user },
                        }}
                      >
                        <p className="visit-btn">View profile</p>
                      </Link>
                    ) : (
                        ""
                      )}
                  </div>
                </Row>
              ))}
            </Col>
          </Col>
          <Col>
            <p className="test mb-5">People who liked your profil</p>
            <Col className="profiltrafic">
              {userLike.map((visit, i) => (
                <Row key={i} className="justify-content-md-center" style={{ marginBottom: "15px", justifyContent: "center" }}>
                  <Image
                    style={{ float: "left", height: "70px", width: "70px", borderRadius: "70px", color: "white", marginRight: "15px" }}
                    src={
                      visit.imgprofil === "img1"
                        ? visit.img1
                        : visit.imgprofil === "img2"
                          ? visit.img2
                          : visit.imgprofil === "img3"
                            ? visit.img3
                            : visit.imgprofil === "img4"
                              ? visit.img4
                              : visit.imgprofil === "img5"
                                ? visit.img5
                                : visit.imgprofil
                    }
                  />

                  <div className="">
                    <p style={{ fontSize: "24px", marginBottom: "10px" }}>{visit.username}</p>
                    {personLike[i] ? (
                      <Link
                        to={{
                          pathname: `/profiluserpage/${personLike[i].match.username}`,
                          state: { match: personLike[i].match, tag: personLike[i].tag, user: user },
                        }}
                      >
                        <p className="visit-btn">View profile</p>
                      </Link>
                    ) : (
                        ""
                      )}
                  </div>
                </Row>
              ))}
            </Col>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
export default ProfilTrafic;
