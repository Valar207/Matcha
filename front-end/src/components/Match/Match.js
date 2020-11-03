import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Image, Modal, Badge, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Match.css";
import axios from "axios";
import { Heart, HeartFill, TrophyFill, Sliders } from "react-bootstrap-icons";
import { Filter } from "../Filter/Filter";
import moment from "moment";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const Match = (props) => {

  const user = props.user;
  const tag = props.usersTag;

  const [tags, setTags] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    data: {},
  });
  const [profilmatch, setProfilmatch] = useState([]);
  const [filter, setFilter] = useState({ age: [18, 100], km: 500 });
  const [ageSort, setAgeSort] = useState({ value: null });
  const [interestSort, setInterestSort] = useState({ value: null });
  const [distanceSort, setDistanceSort] = useState({ value: null });
  const [fameSort, setFameSort] = useState({ value: null });
  const [tagsSort, setTagsSort] = useState([
    { name: "Music", value: 1, actif: 1 },
    { name: "Sport", value: 2, actif: 1 },
    { name: "Games", value: 3, actif: 1 },
    { name: "Animals", value: 4, actif: 1 },
    { name: "Party", value: 5, actif: 1 },
    { name: "Arts", value: 6, actif: 1 },
    { name: "Movies", value: 7, actif: 1 },
    { name: "Travels", value: 8, actif: 1 },
    { name: "Cooking", value: 9, actif: 1 },
    { name: "Dance", value: 10, actif: 1 },
  ]);
  const responsive = {
    mobile: {
      breakpoint: { max: 525, min: 0 },
      items: 1,
    }
  };

  useEffect(() => {
    let isMounted = true
    axios
      .post("/match", {
        user,
        tag,
        filter,
        ageSort,
        distanceSort,
        tagsSort,
        interestSort,
        fameSort,
      })
      .then((res) => {
        if (isMounted) {
          setTags(res.data.interestsByProfile);
          setProfilmatch(res.data.profiles);
        }
      });
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted

  }, [ageSort, distanceSort, tagsSort, interestSort, fameSort, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const SetLike = (match) => {
    setProfilmatch(profilmatch.map((x) => (x.iduser === match.iduser ? (x.liked === 0 ? { ...x, liked: 1 } : { ...x, liked: 0 }) : x)));
    axios.post("/like", { user, match }).then((res) => { });
  };

  const handleShow = (match) => {
    setModal({
      show: true,
      data: match,
    });
  };
  const handleClose = () => {
    setModal({
      show: false,
      data: {},
    });
  };

  const ViewProfil = (person) => {
    axios.post("/visit", { user, person }).then((res) => { });
  };


  return (
    <div>
      {props.screen.desktop &&
        <Container fluid>
          <Row>
            <Col className="left-block">
              <Filter
                tags={tag}
                filter={filter}
                setFilter={setFilter}
                ageSort={ageSort}
                setAgeSort={setAgeSort}
                distanceSort={distanceSort}
                setDistanceSort={setDistanceSort}
                fameSort={fameSort}
                setFameSort={setFameSort}
                tagsSort={tagsSort}
                setTagsSort={setTagsSort}
                interestSort={interestSort}
                setInterestSort={setInterestSort}
              />
            </Col>


            <Col className="">
              <div className="profils">
                {profilmatch.map((match, i) => (
                  <Card key={i} className={match.gender === "male" ? "male" : "female"}>
                    <Card.Img
                      className="profils-match"
                      variant="top"
                      onClick={() => {
                        handleShow(match);
                      }}
                      style={{ cursor: "pointer" }}
                      src={
                        match.imgprofil === "img1"
                          ? match.img1
                          : match.imgprofil === "img2"
                            ? match.img2
                            : match.imgprofil === "img3"
                              ? match.img3
                              : match.imgprofil === "img4"
                                ? match.img4
                                : match.imgprofil === "img5"
                                  ? match.img5
                                  : match.imgprofil
                      }
                    />
                    <Card.Body style={{ paddingTop: "15px" }}>
                      <Card.Title>
                        <Col className="online-profil">
                          <div className={match.online === 1 ? "online" : "offline"} style={{ marginRight: "10px", fontSize: "12px" }} ></div>
                          {match.online === 1 ? (
                            <p style={{ fontSize: "12px" }}> Online </p>
                          ) : (
                              <p style={{ fontSize: "12px" }}> Disconnected {moment(match.date_unlog).fromNow()}</p>
                            )}
                        </Col>
                        {match.username}
                      </Card.Title>

                      <Card.Text>
                        {match.popularity >= 0 && match.popularity <= 300 ? (
                          <TrophyFill style={{ color: "#cd7f32", marginRight: "10px" }} />
                        ) : match.popularity > 300 && match.popularity <= 600 ? (
                          <TrophyFill style={{ color: "#C0C0C0", marginRight: "10px" }} />
                        ) : (
                              <TrophyFill style={{ color: "#FFD700", marginRight: "10px" }} />
                            )}
                        {match.popularity}{" "}
                      </Card.Text>
                      <Card.Text>
                        {match.age} ans - {Math.ceil(match.distance)} km - {match.orientation}{" "}
                      </Card.Text>

                      <Card.Text className="match-badge">
                        {tags[i]
                          ? tags[i].map((tag, i) => (
                            <Badge key={i} value={tag.value} name={tag.name} actif={tag.actif} className={tag.actif === 1 ? "interestActif" : ""}>
                              {tag.name}
                            </Badge>
                          ))
                          : ""}
                      </Card.Text>
                      <Card.Text>
                        <Button
                          onClick={() => SetLike(match)}
                          disabled={user.imgprofil === "/img/default.jpg" ? true : match.imgprofil === "/img/default.jpg" ? true : false}
                        >
                          {match.liked === 1 ? (
                            <HeartFill
                              style={{
                                width: "45px",
                                height: "45px",
                                color: "#f186c0",
                              }}
                            />
                          ) : (
                              <Heart style={{ width: "45px", height: "45px" }} />
                            )}
                        </Button>
                      </Card.Text>
                    </Card.Body>
                    <Link
                      onClick={() => ViewProfil(match)}
                      className="viewprofil-btn"
                      to={{
                        pathname: `/profiluserpage/${match.username}`,
                        state: { match, tag: tags[i], user },
                      }}
                    >
                      {" "}
                  View profil{" "}
                    </Link>
                  </Card>
                ))}
                <Modal show={modal.show} onHide={handleClose} className="modal-match" size="xl">
                  <Modal.Title>{modal.data.username} Photos</Modal.Title>
                  <Modal.Body>
                    <Image src={modal.data.img1} />
                    <Image src={modal.data.img2} />
                    <Image src={modal.data.img3} />
                    <Image src={modal.data.img4} />
                    <Image src={modal.data.img5} />
                  </Modal.Body>
                </Modal>
              </div>
            </Col>
          </Row>
        </Container>
      }

      {props.screen.mobile &&
        <Container fluid>
          <Row>
            <Accordion defaultActiveKey="0" className="filter-mobile">
              <Card>
                <Card.Header>
                  <Accordion.Toggle variant="link" eventKey="1">
                    Settings :   <Sliders style={{ marginLeft: "10px", color: "white", height: "30px", width: "30px", right: "0" }} />
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>

                    <Filter
                      className=""
                      tags={tag}
                      filter={filter}
                      setFilter={setFilter}
                      ageSort={ageSort}
                      setAgeSort={setAgeSort}
                      distanceSort={distanceSort}
                      setDistanceSort={setDistanceSort}
                      fameSort={fameSort}
                      setFameSort={setFameSort}
                      tagsSort={tagsSort}
                      setTagsSort={setTagsSort}
                      interestSort={interestSort}
                      setInterestSort={setInterestSort}
                    />

                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <Col>
              <div className="profils-mobile">
                {profilmatch.map((match, i) => (
                  <Card key={i} className={match.gender === "male" ? "male" : "female"}>
                    <Card.Img
                      className="profils-match-mobile"
                      variant="top"
                      onClick={() => {
                        handleShow(match);
                      }}
                      style={{ cursor: "pointer" }}
                      src={
                        match.imgprofil === "img1"
                          ? match.img1
                          : match.imgprofil === "img2"
                            ? match.img2
                            : match.imgprofil === "img3"
                              ? match.img3
                              : match.imgprofil === "img4"
                                ? match.img4
                                : match.imgprofil === "img5"
                                  ? match.img5
                                  : match.imgprofil
                      }
                    />

                    <Card.Body>
                      <Card.Title>
                        <Col className="online-profil">
                          <div className={match.online === 1 ? "online" : "offline"} style={{ marginRight: "10px" }} ></div>
                          {match.online === 1 ? (
                            <p> Online </p>
                          ) : (
                              <p> Disconnected {moment(match.date_unlog).fromNow()}</p>
                            )}
                        </Col>
                        <h1>{match.username}</h1>
                      </Card.Title>

                      <Card.Text>
                        {match.popularity >= 0 && match.popularity <= 300 ? (
                          <TrophyFill style={{ color: "#cd7f32", marginRight: "10px" }} />
                        ) : match.popularity > 300 && match.popularity <= 600 ? (
                          <TrophyFill style={{ color: "#C0C0C0", marginRight: "10px" }} />
                        ) : (
                              <TrophyFill style={{ color: "#FFD700", marginRight: "10px" }} />
                            )}
                        {match.popularity}{" "}
                      </Card.Text>
                      <Card.Text>
                        {match.age} ans - {Math.ceil(match.distance)} km - {match.orientation}{" "}
                      </Card.Text>

                      <Card.Text className="match-badge">
                        {tags[i]
                          ? tags[i].map((tag, i) => (
                            <Badge key={i} value={tag.value} name={tag.name} actif={tag.actif} className={tag.actif === 1 ? "interestActif" : ""}>
                              {tag.name}
                            </Badge>
                          ))
                          : ""}
                      </Card.Text>
                      <Card.Text>
                        <Button
                          onClick={() => SetLike(match)}
                          disabled={user.imgprofil === "/img/default.jpg" ? true : match.imgprofil === "/img/default.jpg" ? true : false}
                        >
                          {match.liked === 1 ? (
                            <HeartFill
                              style={{
                                width: "45px",
                                height: "45px",
                                color: "#f186c0",
                              }}
                            />
                          ) : (
                              <Heart style={{ width: "45px", height: "45px" }} />
                            )}
                        </Button>
                      </Card.Text>
                    </Card.Body>
                    <Link
                      style={{ padding: "17px 20px ", margin: "0px 15px 30px 15px" }}
                      onClick={() => ViewProfil(match)}
                      className="viewprofil-btn"
                      to={{
                        pathname: `/profiluserpage/${match.username}`,
                        state: { match, tag: tags[i], user },
                      }}
                    >
                      {" "}
                      View profil{" "}
                    </Link>
                  </Card>
                ))}
                <Modal show={modal.show} onHide={handleClose} className="modal-match" style={{ marginTop: "150px" }} size="xl">
                  <Modal.Title>{modal.data.username} Photos</Modal.Title>
                  <Modal.Body>
                    <div className="carousel-profil-user-mobile">
                      <Carousel itemClass="carousel-item-padding" responsive={responsive} showDots={true}>

                        <Image style={{ height: "300px", width: "300px" }} src={modal.data.img1} />
                        <Image style={{ height: "300px", width: "300px" }} src={modal.data.img2} />
                        <Image style={{ height: "300px", width: "300px" }} src={modal.data.img3} />
                        <Image style={{ height: "300px", width: "300px" }} src={modal.data.img4} />
                        <Image style={{ height: "300px", width: "300px" }} src={modal.data.img5} />

                      </Carousel>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </Col>
          </Row>
        </Container>
      }


    </div >

  );
};
export default Match;
