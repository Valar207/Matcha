import React, { useState } from "react";
import { Container, Row, Col, Modal, Image } from "react-bootstrap";
import { PersonFill, GearFill, DashCircleFill, LockFill, GraphUp } from 'react-bootstrap-icons'
import "./ProfilPage.css";
import { Route, Switch } from "react-router-dom";
import { NavTab } from "react-router-tabs";
import Profiluser from "../Profiluser/Profiluser";
import Profilmodif from "../Profilmodif/Profilmodif";
import Profilpwd from "../Profilpwd/Profilpwd";
import Profiltrafic from "../Profiltrafic/Profiltrafic";
import Profilblocked from "../Profilblocked/Profilblocked";
import Error from "../../Error/Error";
import axios from "axios";
import "react-notifications/lib/notifications.css";
import { AnimatePresence } from "framer-motion";
import Map from "../../Maps/Maps";

export const Profil = (props) => {
  const lat = props.user.latitude;
  const lon = props.user.longitude;

  const [imgprofil, setImgprofil] = useState();
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const src = props.user.imgprofil;
  const activeTag = props.activeTag;
  const selectImg = (e) => {
    setImgprofil({
      id: props.user.iduser,
      img: e.target.name,
    });
  };
  if (imgprofil)
    axios.post("/imgprofil", imgprofil).then((res) => {
      window.location.reload();
    });

  if (props.logged)
    return (
      <div>
        {props.screen.desktop && (
          <Container fluid>
            <Row>
              <Col className="left-block">
                <img
                  alt="photoprofil"
                  className="photoprofil"
                  src={
                    src === "img1"
                      ? props.user.img1
                      : src === "img2"
                        ? props.user.img2
                        : src === "img3"
                          ? props.user.img3
                          : src === "img4"
                            ? props.user.img4
                            : src === "img5"
                              ? props.user.img5
                              : props.user.imgprofil
                  }
                  onClick={handleShow}
                />
                <br />
                <p> {props.user.username}</p>
                <p> {props.user.birthday} Years old</p>
                <p> {props.user.orientation}</p>
                <Map lat={lat} lon={lon} height="400px" />
              </Col>

              <Modal show={show} onHide={handleClose} className="modalprofilimg" size="xl">
                <Modal.Title className="modaltitle">Select your profil picture</Modal.Title>
                <Modal.Body className="modalphotoprofil">
                  {props.user.img1 !== "/img/default.jpg" ? <Image src={props.user.img1} id={props.user.img1} name="img1" onClick={selectImg} /> : ""}
                  {props.user.img2 !== "/img/default.jpg" ? <Image src={props.user.img2} id={props.user.img2} name="img2" onClick={selectImg} /> : ""}
                  {props.user.img3 !== "/img/default.jpg" ? <Image src={props.user.img3} id={props.user.img3} name="img3" onClick={selectImg} /> : ""}
                  {props.user.img4 !== "/img/default.jpg" ? <Image src={props.user.img4} id={props.user.img4} name="img4" onClick={selectImg} /> : ""}
                  {props.user.img5 !== "/img/default.jpg" ? <Image src={props.user.img5} id={props.user.img5} name="img5" onClick={selectImg} /> : ""}
                </Modal.Body>
              </Modal>

              <Col className="profilnavbar">
                {/* <Row> */}
                <NavTab to="/profil/user" activeClassName="selected">
                  Your profile
                </NavTab>
                <NavTab to="/profil/modifierprofil" activeClassName="selected">
                  Modify profile
                </NavTab>
                <NavTab to="/profil/modifiermotdepasse" activeClassName="selected">
                  Modify password
                </NavTab>
                <NavTab to="/profil/traficprofil" activeClassName="selected">
                  Profile trafic
                </NavTab>
                <NavTab to="/profil/profilblocked" activeClassName="selected">
                  Profile blocked
                </NavTab>
                {/* </Row> */}
                <AnimatePresence>
                  <Switch>
                    <Route path={`${props.path}/user/`} component={() => <Profiluser user={props.user} activeTag={activeTag} screen={props.screen} />} />
                    <Route path={`${props.path}/modifierprofil`} component={() => <Profilmodif user={props.user} screen={props.screen} />} />
                    <Route path={`${props.path}/modifiermotdepasse`} component={() => <Profilpwd user={props.user} screen={props.screen} />} />
                    <Route path={`${props.path}/traficprofil`} component={() => <Profiltrafic user={props.user} screen={props.screen} />} />
                    <Route path={`${props.path}/profilblocked`} component={() => <Profilblocked user={props.user} screen={props.screen} />} />
                  </Switch>
                </AnimatePresence>
              </Col>
            </Row>
          </Container>
        )}

        {props.screen.mobile && (
          <Container fluid>
            <Row>
              <Col className="left-block-mobile">
                <img
                  alt="photoprofil"
                  className="photoprofil-mobile"
                  src={
                    src === "img1"
                      ? props.user.img1
                      : src === "img2"
                        ? props.user.img2
                        : src === "img3"
                          ? props.user.img3
                          : src === "img4"
                            ? props.user.img4
                            : src === "img5"
                              ? props.user.img5
                              : props.user.imgprofil
                  }
                  onClick={handleShow}
                />
                <br />
                <p> {props.user.username}</p>
                <p> {props.user.birthday} Years old</p>
                <p> {props.user.orientation}</p>

                <Modal show={show} onHide={handleClose} className="modalprofilimg" size="xl">
                  <Modal.Title className="modaltitle">Select your profil picture</Modal.Title>
                  <Modal.Body className="modalphotoprofil">
                    {props.user.img1 !== "/img/default.jpg" ? (
                      <Image src={props.user.img1} id={props.user.img1} name="img1" onClick={selectImg} />
                    ) : (
                        ""
                      )}
                    {props.user.img2 !== "/img/default.jpg" ? (
                      <Image src={props.user.img2} id={props.user.img2} name="img2" onClick={selectImg} />
                    ) : (
                        ""
                      )}
                    {props.user.img3 !== "/img/default.jpg" ? (
                      <Image src={props.user.img3} id={props.user.img3} name="img3" onClick={selectImg} />
                    ) : (
                        ""
                      )}
                    {props.user.img4 !== "/img/default.jpg" ? (
                      <Image src={props.user.img4} id={props.user.img4} name="img4" onClick={selectImg} />
                    ) : (
                        ""
                      )}
                    {props.user.img5 !== "/img/default.jpg" ? (
                      <Image src={props.user.img5} id={props.user.img5} name="img5" onClick={selectImg} />
                    ) : (
                        ""
                      )}
                  </Modal.Body>
                </Modal>

                <Col className="profilnavbar-mobile">
                  <NavTab to="/profil/user" activeClassName="selected-mobile">
                    < PersonFill style={{ height: "25px", width: "25px" }} />
                  </NavTab>
                  <NavTab to="/profil/modifierprofil" activeClassName="selected-mobile">
                    < GearFill style={{ height: "25px", width: "25px" }} />
                  </NavTab>
                  <NavTab to="/profil/modifiermotdepasse" activeClassName="selected-mobile">
                    < LockFill style={{ height: "25px", width: "25px" }} />
                  </NavTab>
                  <NavTab to="/profil/traficprofil" activeClassName="selected-mobile">
                    < GraphUp style={{ height: "20px", width: "20px" }} />
                  </NavTab>
                  <NavTab to="/profil/profilblocked" activeClassName="selected-mobile">
                    < DashCircleFill style={{ height: "25px", width: "25px" }} />
                  </NavTab>
                </Col>
                <AnimatePresence>
                  <Switch>
                    <Route path={`${props.path}/user/`} component={() => <Profiluser user={props.user} activeTag={activeTag} screen={props.screen} />} />
                    <Route path={`${props.path}/modifierprofil`} component={() => <Profilmodif user={props.user} screen={props.screen} />} />
                    <Route path={`${props.path}/modifiermotdepasse`} component={() => <Profilpwd user={props.user} screen={props.screen} />} />
                    <Route path={`${props.path}/traficprofil`} component={() => <Profiltrafic user={props.user} screen={props.screen} />} />
                    <Route path={`${props.path}/profilblocked`} component={() => <Profilblocked user={props.user} screen={props.screen} />} />
                  </Switch>
                </AnimatePresence>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  else return <Error />;
};

export default Profil;
