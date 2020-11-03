import React, { useState, useEffect } from "react";
import "./Profilblocked.css";
import { Row, Col, Image, Button, Container } from "react-bootstrap";
import axios from "axios";

export const ProfilBlocked = (props) => {
  const { user } = props;

  const [profileBlocked, setProfileBlocked] = useState([]);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    axios.post("/getProfileBlocked", { user }).then((res) => {
      if (isMounted) setProfileBlocked(res.data);
    });
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  }, [user]);

  const RemoveBlock = (iduser, user) => {
    axios.post("/removeProfileBlocked", { iduser }).then((res) => {
      axios.post("/getProfileBlocked", { user }).then((res) => {
        setProfileBlocked(res.data);
      });
    });
  };

  return (
    <Container>
      <Container className="profilContainer" >
        <h4>Profil blocked :</h4>
        <br />
        <Row>
          <Col>
            <p className="mb-5">Profils blocked</p>
            <Col className="profil-blocked">
              {profileBlocked.map((profile, i) => (
                <Row key={i} className="justify-content-md-center" style={{ marginBottom: "45px", justifyContent: "center" }}>
                  <Image
                    style={{ float: "left", height: "70px", width: "70px", borderRadius: "70px", color: "white", marginRight: "15px" }}
                    src={
                      profile.imgprofil === "img1"
                        ? profile.img1
                        : profile.imgprofil === "img2"
                          ? profile.img2
                          : profile.imgprofil === "img3"
                            ? profile.img3
                            : profile.imgprofil === "img4"
                              ? profile.img4
                              : profile.imgprofil === "img5"
                                ? profile.img5
                                : profile.imgprofil
                    }
                  />
                  <div className="">
                    <p style={{ fontSize: "24px", marginBottom: "10px" }}>{profile.username}</p>
                    <Button className="unblock-btn" onClick={() => RemoveBlock(profile.iduser, user)}>Unblock</Button>
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
export default ProfilBlocked;
