import React, { useState } from "react";
import { Row, Col, Form, Image, Button, Container } from "react-bootstrap";
import "./Profiluser.css";
import axios from "axios";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Map from "../../Maps/Maps";

export const Profiluser = (props) => {
  const lat = props.user.latitude;
  const lon = props.user.longitude;
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 426 });
  const isMobile = useMediaQuery({ maxWidth: 425, minWidth: 0 });

  var id = window.setTimeout(function () { }, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
  const responsive = {
    mobile: {
      breakpoint: { max: 525, min: 0 },
      items: 1,
    }
  };

  const user = props.user;
  const tag = props.activeTag;
  const [activeTag, setActivetag] = useState(tag);
  const [delImg, setDelimg] = useState();

  const setInterest = (e, tag, index) => {
    var value_interest = tag.value;
    var value_actif = tag.actif;

    var newArr = [...activeTag];
    if (tag.actif === 0) {
      newArr[index] = { name: tag.name, value: tag.value, actif: 1 };
      setActivetag(newArr);
    } else if (tag.actif === 1) {
      newArr[index] = { name: tag.name, value: tag.value, actif: 0 };
      setActivetag(newArr);
    }
    axios.post("/setinterest", { user, value_interest, value_actif });
  };

  const uploadImg = (e) => {
    const formData = new FormData();

    formData.append("img", e.target.files[0]);
    formData.append("iduser", user.iduser);
    formData.append("idimg", e.target.id);

    axios.post("/upload", formData).then((res) => {
      if (res.data.status === "success") {
        window.location.reload();
        // NotificationManager.success("Your profil picture has been changed", "Success", 5000)
      } else if (res.data.status === "wrongformat") {
        NotificationManager.error("Please upload a jpg or png files", "Error", 5000);
      }
    });
  };
  const handleDelete = (e) => {
    setDelimg({
      iduser: user.iduser,
      img: e.target.id,
    });
  };
  if (delImg)
    axios.post("delete", delImg).then((res) => {
      if (res.data.status === "success") window.location.reload();
      // else if (res.data.status === "error")
      //   NotificationManager.error("error", "Error", 5000)
    });

  return (
    <Container fluid>
      <NotificationContainer />
      {isDesktopOrLaptop && (
        <Container className="profilContainer">
          <Row>
            <Col>
              <h4>Photos :</h4>
              <br />
              <Col className="profilphotos">
                <Form.Group>
                  <Form.Label htmlFor="img1">
                    <Image src={user.img1} />
                  </Form.Label>
                  <Form.Control id="img1" style={{ display: "none" }} type="file" onChange={uploadImg} />
                  {props.user.img1 === "/img/default.jpg" ? (
                    ""
                  ) : (
                      <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img1" className="delete" onClick={handleDelete}>
                        {" "}
                      X
                      </motion.button>
                    )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="img2">
                    <Image src={user.img2} />
                  </Form.Label>
                  <Form.Control id="img2" style={{ display: "none" }} type="file" onChange={uploadImg} />
                  {props.user.img2 === "/img/default.jpg" ? (
                    ""
                  ) : (
                      <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img2" className="delete" onClick={handleDelete}>
                        X{" "}
                      </motion.button>
                    )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="img3">
                    <Image src={user.img3} />
                  </Form.Label>
                  <Form.Control id="img3" style={{ display: "none" }} type="file" onChange={uploadImg} />
                  {props.user.img3 === "/img/default.jpg" ? (
                    ""
                  ) : (
                      <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img3" className="delete" onClick={handleDelete}>
                        {" "}
                      X
                      </motion.button>
                    )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="img4">
                    <Image src={user.img4} />
                  </Form.Label>
                  <Form.Control id="img4" style={{ display: "none" }} type="file" onChange={uploadImg} />
                  {props.user.img4 === "/img/default.jpg" ? (
                    ""
                  ) : (
                      <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img4" className="delete" onClick={handleDelete}>
                        {" "}
                      X{" "}
                      </motion.button>
                    )}
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="img5">
                    <Image src={user.img5} />
                  </Form.Label>
                  <Form.Control id="img5" style={{ display: "none" }} type="file" onChange={uploadImg} />
                  {props.user.img5 === "/img/default.jpg" ? (
                    ""
                  ) : (
                      <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img5" className="delete" onClick={handleDelete}>
                        {" "}
                      X{" "}
                      </motion.button>
                    )}
                </Form.Group>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Description :</h4>
              <br />
              <Col>
                <p> {props.user.bio} </p>
              </Col>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h4>Interests (please choose at least 3 interests):</h4> <br />
              <Col className="interest">
                {activeTag.map((tag, index) => (
                  <Button
                    key={index}
                    value={tag.value}
                    name={tag.name}
                    actif={tag.actif}
                    className={tag.actif === 1 ? "interestActif" : ""}
                    onClick={(e) => setInterest(e, tag, index)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </Col>
            </Col>
          </Row>
        </Container>
      )}

      {isMobile && (
        <Container className="profilContainer-mobile">
          <h4>Photos :</h4>
          <br />
          <div className="carousel-profil-user-mobile">
            <Carousel itemClass="carousel-item-padding" responsive={responsive} showDots={true}>
              <Form.Group>
                <Form.Label htmlFor="img1">
                  <Image src={user.img1} />
                </Form.Label>
                <Form.Control id="img1" style={{ display: "none" }} type="file" onChange={uploadImg} />
                {props.user.img1 === "/img/default.jpg" ? (
                  ""
                ) : (
                    <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img1" className="delete" onClick={handleDelete}>
                      {" "}
                    X
                    </motion.button>
                  )}
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="img2">
                  <Image src={user.img2} />
                </Form.Label>
                <Form.Control id="img2" style={{ display: "none" }} type="file" onChange={uploadImg} />
                {props.user.img2 === "/img/default.jpg" ? (
                  ""
                ) : (
                    <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img2" className="delete" onClick={handleDelete}>
                      X{" "}
                    </motion.button>
                  )}
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="img3">
                  <Image src={user.img3} />
                </Form.Label>
                <Form.Control id="img3" style={{ display: "none" }} type="file" onChange={uploadImg} />
                {props.user.img3 === "/img/default.jpg" ? (
                  ""
                ) : (
                    <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img3" className="delete" onClick={handleDelete}>
                      {" "}
                    X
                    </motion.button>
                  )}
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="img4">
                  <Image src={user.img4} />
                </Form.Label>
                <Form.Control id="img4" style={{ display: "none" }} type="file" onChange={uploadImg} />
                {props.user.img4 === "/img/default.jpg" ? (
                  ""
                ) : (
                    <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img4" className="delete" onClick={handleDelete}>
                      {" "}
                    X{" "}
                    </motion.button>
                  )}
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="img5">
                  <Image src={user.img5} />
                </Form.Label>
                <Form.Control id="img5" style={{ display: "none" }} type="file" onChange={uploadImg} />
                {props.user.img5 === "/img/default.jpg" ? (
                  ""
                ) : (
                    <motion.button whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} id="img5" className="delete" onClick={handleDelete}>
                      {" "}
                    X{" "}
                    </motion.button>
                  )}
              </Form.Group>
            </Carousel>
          </div>
          <br />
          <br />
          <h4>Description :</h4>
          <br />
          <Col>
            <p> {props.user.bio} </p>
          </Col>
          <br />
          <br />
          <h4>Interests (please choose at least 3 interests):</h4> <br />
          <Col className="interest">
            {activeTag.map((tag, index) => (
              <Button
                key={index}
                value={tag.value}
                name={tag.name}
                actif={tag.actif}
                className={tag.actif === 1 ? "interestActif" : ""}
                onClick={(e) => setInterest(e, tag, index)}
              >
                {tag.name}
              </Button>
            ))}
          </Col>
          <br />
          <br />
          <h4>Location :</h4>
          <br />
          <Col>
            <Map lat={lat} lon={lon} height="300px" />
          </Col>


        </Container>
      )}
    </Container>
  );
};
export default Profiluser;
