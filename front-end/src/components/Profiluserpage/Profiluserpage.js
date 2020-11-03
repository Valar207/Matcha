import React, { useEffect, useState } from "react";
import { Container, Row, Col, Badge, Image, Button } from "react-bootstrap";
import { useLocation } from "react-router";
import Map from "../Maps/Maps";
import "./Profiluserpage.css";
import Carousel from 'react-multi-carousel'
import { Heart, HeartFill } from "react-bootstrap-icons";
import moment from "moment";
import axios from "axios";

export const ProfilUserPage = (props) => {
  const location = useLocation();
  const match = location.state.match;
  const user = location.state.user;
  const tag = location.state.tag;
  const [liked, setLiked] = useState(0);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    axios.post("/personLiked", { user, match }).then((res) => {
      if (isMounted)
        setLiked(res.data.liked);
    });
    var id = window.setTimeout(function () { }, 0);
    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const responsive = {
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const SetLike = (match) => {
    setLiked(liked === 0 ? 1 : 0);
    axios.post("/like", { user, match }).then((res) => { });
  };

  const BlockUser = () => {
    axios.post("/blockUser", { user, match }).then((res) => { });
  };

  return (
    <>
      <div>
        {props.screen.desktop && (
          <Container fluid>
            <Row>
              <Col className="left-block">
                <img
                  alt="photoprofil"
                  className="photoprofil"
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
                <Col className="online-profil">
                  <div className={match.online === 1 ? "online" : "offline"} style={{ marginRight: "10px", fontSize: "12px" }} ></div>
                  {match.online === 1 ? (
                    <p > Online </p>
                  ) : (
                      <p > Disconnected {moment(match.date_unlog).fromNow()}</p>
                    )}
                </Col>

                {/* {match.online === 0 ? [<Badge style={{ margin: "3px 0 0 10px" }}> offline </Badge>, <p>{}</p>] : ""} */}
                <p> {match.username}</p>
                <p> {match.age} ans</p>
                <p> {match.orientation}</p>
                <Map lat={match.latitude} height="400px" lon={match.longitude} />
              </Col>

              <Col className="profilnavbar">
                <Container fluid>
                  <Container className="profilContainer">
                    <Row>
                      <Col>
                        <h4>Photos :</h4>
                        <br />
                        <Col className="profilphotos">
                          <Image src={match.img1} name="img1" />
                          <Image src={match.img2} name="img2" />
                          <Image src={match.img3} name="img3" />
                          <Image src={match.img4} name="img4" />
                          <Image src={match.img5} name="img5" />
                        </Col>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h4>Description :</h4>
                        <br />
                        <Col>
                          <p> {match.bio}</p>
                        </Col>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col>
                        <h4>Interests :</h4>
                        <br />
                        <Col className="profiluserpage-badge">
                          {tag.map((tag, i) => (
                            <h3 key={i}>
                              <Badge key={i} value={tag.value} name={tag.name} actif={tag.actif} className={tag.actif === 1 ? "interestActif" : ""}>
                                {tag.name}
                              </Badge>
                            </h3>
                          ))}
                        </Col>
                      </Col>
                    </Row>
                    <Row className="text-center ">
                      <Col>
                        <Button
                          onClick={() => SetLike(match)}
                          className="button"
                          disabled={user.imgprofil === "/img/default.jpg" ? true : match.imgprofil === "/img/default.jpg" ? true : false}
                        >
                          {liked === 1 ? (
                            <HeartFill
                              style={{
                                width: "60px",
                                height: "60px",
                                color: "#f186c0",
                              }}
                            />
                          ) : (
                              <Heart style={{ width: "60px", height: "60px" }} />
                            )}
                        </Button>
                      </Col>
                      <Col >
                        <Button className="block-btn" onClick={() => BlockUser()} href="/match">
                          Bloquer
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Container>
              </Col>
            </Row>
          </Container>
        )}
        {props.screen.mobile &&
          <Container fluid>
            <Row>
              <Col className="left-block-mobile">
                <img
                  alt="photoprofil"
                  className="photoprofil-mobile"
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
                <Col className="online-profil">
                  <div className={match.online === 1 ? "online" : "offline"} style={{ marginRight: "10px" }} ></div>
                  {match.online === 1 ? (
                    <p> online </p>
                  ) : (
                      <p> Offline {moment(match.date_unlog).fromNow()}</p>
                    )}
                </Col>
                <p> {match.username}</p>
                <p> {match.age} ans</p>
                <p> {match.orientation}</p>

                <Container fluid>
                  <Container className="profilContainer-mobile">

                    <h4>Photos :</h4>
                    <br />
                    <div className="carousel-profil-user-mobile">
                      <Carousel itemClass="carousel-item-padding" responsive={responsive} showDots={true}>
                        <Image src={match.img1} name="img1" />
                        <Image src={match.img2} name="img2" />
                        <Image src={match.img3} name="img3" />
                        <Image src={match.img4} name="img4" />
                        <Image src={match.img5} name="img5" />
                      </Carousel>
                    </div>
                    <br />
                    <br />
                    <h4>Description :</h4>
                    <br />
                    <Col>
                      <p> {match.bio}</p>
                    </Col>
                    <br />
                    <br />
                    <h4>Interests :</h4>
                    <br />
                    <Col className="profiluserpage-badge-mobile">
                      {tag.map((tag, i) => (
                        <h3 key={i}>
                          <Badge key={i} value={tag.value} name={tag.name} actif={tag.actif} className={tag.actif === 1 ? "interestActif" : ""}>
                            {tag.name}
                          </Badge>
                        </h3>
                      ))}
                    </Col>
                    <br />
                    <br />
                    <h4>Location :</h4>
                    <br />
                    <Col>
                      <Map lat={match.latitude} lon={match.longitude} height="300px" />
                    </Col>
                    <Row className="text-center ">
                      <Col style={{ marginTop: "15px" }}>
                        <Button
                          onClick={() => SetLike(match)}
                          className="button"
                          disabled={user.imgprofil === "/img/default.jpg" ? true : match.imgprofil === "/img/default.jpg" ? true : false}
                        >
                          {liked === 1 ? (
                            <HeartFill
                              style={{
                                marginTop: "25px",
                                width: "80px",
                                height: "80px",
                                color: "#f186c0",
                              }}
                            />
                          ) : (
                              <Heart style={{
                                marginTop: "25px",
                                width: "80px",
                                height: "80px"
                              }} />
                            )}
                        </Button>
                      </Col>
                      <Col >
                        <Button className="block-btn-mobile" onClick={() => BlockUser()} href="/match">
                          Bloquer
                     </Button>
                      </Col>
                    </Row>
                  </Container>
                </Container>
              </Col>
            </Row>
          </Container>
        }


      </div>



    </>
  );
};

export default ProfilUserPage;
