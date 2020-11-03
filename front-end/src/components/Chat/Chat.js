import React, { useState, useEffect } from "react";
import { Container, Col, Image, Row, Button, Form, Badge, Accordion, Card } from "react-bootstrap";
import { PeopleFill } from 'react-bootstrap-icons'
import "./Chat.css";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import moment from "moment";

export const Chat = (props) => {
  // const socket = socketIOClient("http://localhost:8081");
  const socket = props.socket;
  const [allMessage, setAllMessage] = useState([]);
  const [message, setMessage] = useState([]);
  const userSend = props.user;
  const [contact, setContact] = useState([]);
  //   const [userReceive, setUserReceive] = useState();
  const [profilUserMatched, setProfilUserMatched] = useState({});
  var disable = true;

  useEffect((e) => {
    let isMounted = true; // note this flag denote mount status

    axios.post("/chat", userSend).then((res) => {
      if (isMounted) {
        setProfilUserMatched(res.data.matchChat[0]);
        setContact(res.data.matchChat);
      }

      if (res.data.matchChat[0]) {
        axios.post("/loadMessage", [res.data.matchChat[0], userSend]).then((res) => {
          if (isMounted) setAllMessage(res.data.allMessage);
        });
      }
    });

    socket.on("chat-message", ({ usersend, userReceive, message, fullDate }) => {
      if (isMounted) {
        setAllMessage((allMessage) => [
          ...allMessage,
          {
            user_send: usersend,
            user_receive: userReceive,
            message: message,
            date: fullDate,
          },
        ]);
      }
    });
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const usersend = userSend.iduser;
  const user_receive = profilUserMatched;
  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      socket.emit("send-chat-message", { usersend, user_receive, message });
      setMessage("");
    }
  };

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const getIdMatch = (index) => {
    const formData = new FormData();
    // setUserReceive(contact[index].iduser);
    formData.append("userReceive", contact[index].iduser);
    formData.append("userSend", userSend.iduser);

    axios.post("/message", formData).then((res) => {
      setAllMessage(res.data.allMessage);
      setProfilUserMatched(res.data.ProfilUserMatched);
    });
  };

  if (message.length > 0) disable = false;
  else disable = true;

  if (!profilUserMatched) return null;

  return (

    <Container fluid>
      {props.screen.desktop &&
        <Row>
          <Col className="left-block">
            <h4 style={{ margin: "30px 0" }}> Contacts</h4>
            {contact.map((contact, index) => (
              <Row className="contact" key={index} onClick={(e) => getIdMatch(index)}>
                <Col>
                  <Image
                    style={{ float: "left", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                    src={
                      contact.imgprofil === "img1"
                        ? contact.img1
                        : contact.imgprofil === "img2"
                          ? contact.img2
                          : contact.imgprofil === "img3"
                            ? contact.img3
                            : contact.imgprofil === "img4"
                              ? contact.img4
                              : contact.imgprofil === "img5"
                                ? contact.img5
                                : contact.imgprofil
                    }
                  />
                  <Row>{contact.username}</Row>
                  <Row>
                    <div className={contact.online === 1 ? "chat-online" : "chat-offline"}></div>
                    {contact.online === 1 ? (
                      <Badge style={{ margin: "3px 0 0 10px" }}> online </Badge>
                    ) : (
                        <Badge style={{ margin: "3px 0 0 10px" }}> offline </Badge>
                      )}
                  </Row>
                </Col>
              </Row>
            ))}
          </Col>
          <Col className="chat-area">
            <Row className="chat-area-match">
              {/* <PersonCircle style={{ height: "50px", width: "50px", color: "white", marginRight: "15px" }} /> */}
              <Image
                style={{ float: "left", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                src={
                  profilUserMatched.imgprofil === "img1"
                    ? profilUserMatched.img1
                    : profilUserMatched.imgprofil === "img2"
                      ? profilUserMatched.img2
                      : profilUserMatched.imgprofil === "img3"
                        ? profilUserMatched.img3
                        : profilUserMatched.imgprofil === "img4"
                          ? profilUserMatched.img4
                          : profilUserMatched.imgprofil === "img5"
                            ? profilUserMatched.img5
                            : profilUserMatched.imgprofil
                }
              />
              <Col>
                <Row>{profilUserMatched.username}</Row>
                <Row>
                  <div className={profilUserMatched.online === 1 ? "chat-online" : "chat-offline"}></div>
                  {profilUserMatched.online === 1 ? (
                    <Badge style={{ margin: "3px 0 0 10px" }}> online </Badge>
                  ) : (
                      <Badge style={{ margin: "3px 0 0 10px" }}> offline </Badge>
                    )}
                </Row>
              </Col>
            </Row>

            <Row className="chat-area-text">
              <Col>
                {allMessage.map((message, index) => (
                  <Row key={index} style={{ marginBottom: "40px" }}>
                    {allMessage[index].user_send !== userSend.iduser ? (
                      <Image
                        style={{ float: "left", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                        src={
                          profilUserMatched.imgprofil === "img1"
                            ? profilUserMatched.img1
                            : profilUserMatched.imgprofil === "img2"
                              ? profilUserMatched.img2
                              : profilUserMatched.imgprofil === "img3"
                                ? profilUserMatched.img3
                                : profilUserMatched.imgprofil === "img4"
                                  ? profilUserMatched.img4
                                  : profilUserMatched.imgprofil === "img5"
                                    ? profilUserMatched.img5
                                    : profilUserMatched.imgprofil
                        }
                      />
                    ) : (
                        ""
                      )}
                    <Col>
                      {/* {allMessage.user_receive === profilUserMatched ? } */}
                      <div className={allMessage[index].user_send === userSend.iduser ? "message-right" : "message-left"}>
                        <div>{allMessage[index].message}</div>
                        <div style={{ margin: "5px 0 0 0", textAlign: "end", fontSize: "12px" }}>{moment(`${allMessage[index].date}`).fromNow()}</div>
                      </div>
                    </Col>
                    {allMessage[index].user_send === userSend.iduser ? (
                      <Image
                        style={{ float: "right", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                        src={
                          userSend.imgprofil === "img1"
                            ? userSend.img1
                            : userSend.imgprofil === "img2"
                              ? userSend.img2
                              : userSend.imgprofil === "img3"
                                ? userSend.img3
                                : userSend.imgprofil === "img4"
                                  ? userSend.img4
                                  : userSend.imgprofil === "img5"
                                    ? userSend.img5
                                    : userSend.imgprofil
                        }
                      />
                    ) : (
                        ""
                      )}
                  </Row>
                ))}
              </Col>
            </Row>
            <Row className="chat-area-input">
              <Form className="chat-input" onSubmit={(e) => sendMessage(e)}>
                <Form.Control
                  onChange={(e) => onChangeMessage(e)}
                  value={message}
                  type="text"
                  placeholder="Enter your message"
                  as="textarea"
                  name="message-input"
                />
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#cda7ff",
                    color: "black",
                    border: "none",
                  }}
                  disabled={disable}
                >
                  <SendIcon style={{ height: "30px", width: "50px", color: "white" }} />
                </Button>
              </Form>
            </Row>
          </Col>
        </Row>
      }


      {props.screen.mobile &&

        <Row>
          <Accordion defaultActiveKey="0" className="filter-mobile">
            <Card>
              <Card.Header>
                <Accordion.Toggle variant="link" eventKey="1">
                  Contact :   <PeopleFill style={{ marginLeft: "10px", color: "white", height: "30px", width: "30px", right: "0" }} />
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Row className="contact-mobile">
                    {/* <h4 style={{ margin: "30px 0" }}> Contacts</h4> */}
                    {contact.map((contact, index) => (
                      <Col style={{ padding: "0", margin: "0", width: "200px" }} className="contact" key={index} onClick={(e) => getIdMatch(index)}>
                        <Col >
                          <Image
                            style={{ float: "left", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                            src={
                              contact.imgprofil === "img1"
                                ? contact.img1
                                : contact.imgprofil === "img2"
                                  ? contact.img2
                                  : contact.imgprofil === "img3"
                                    ? contact.img3
                                    : contact.imgprofil === "img4"
                                      ? contact.img4
                                      : contact.imgprofil === "img5"
                                        ? contact.img5
                                        : contact.imgprofil
                            }
                          />
                          <Row>{contact.username}</Row>
                          <Row>
                            <div className={contact.online === 1 ? "chat-online" : "chat-offline"}></div>
                            {contact.online === 1 ? (
                              <Badge style={{ margin: "3px 0 0 10px" }}> online </Badge>
                            ) : (
                                <Badge style={{ margin: "3px 0 0 10px" }}> offline </Badge>
                              )}
                          </Row>
                        </Col>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>


          <Col className="chat-area-mobile">
            <Row className="chat-area-match">
              <Image
                style={{ float: "left", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                src={
                  profilUserMatched.imgprofil === "img1"
                    ? profilUserMatched.img1
                    : profilUserMatched.imgprofil === "img2"
                      ? profilUserMatched.img2
                      : profilUserMatched.imgprofil === "img3"
                        ? profilUserMatched.img3
                        : profilUserMatched.imgprofil === "img4"
                          ? profilUserMatched.img4
                          : profilUserMatched.imgprofil === "img5"
                            ? profilUserMatched.img5
                            : profilUserMatched.imgprofil
                }
              />
              <Col>
                <Row>{profilUserMatched.username}</Row>
                <Row>
                  <div className={profilUserMatched.online === 1 ? "chat-online" : "chat-offline"}></div>
                  {profilUserMatched.online === 1 ? (
                    <Badge style={{ margin: "3px 0 0 10px" }}> online </Badge>
                  ) : (
                      <Badge style={{ margin: "3px 0 0 10px" }}> offline </Badge>
                    )}
                </Row>
              </Col>
            </Row>

            <Row className="chat-area-text-mobile">
              <Col>
                {allMessage.map((message, index) => (
                  <Row key={index} style={{ marginBottom: "40px" }}>
                    {allMessage[index].user_send !== userSend.iduser ? (
                      <Image
                        style={{ float: "left", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                        src={
                          profilUserMatched.imgprofil === "img1"
                            ? profilUserMatched.img1
                            : profilUserMatched.imgprofil === "img2"
                              ? profilUserMatched.img2
                              : profilUserMatched.imgprofil === "img3"
                                ? profilUserMatched.img3
                                : profilUserMatched.imgprofil === "img4"
                                  ? profilUserMatched.img4
                                  : profilUserMatched.imgprofil === "img5"
                                    ? profilUserMatched.img5
                                    : profilUserMatched.imgprofil
                        }
                      />
                    ) : (
                        ""
                      )}
                    <Col>
                      <div className={allMessage[index].user_send === userSend.iduser ? "message-right" : "message-left"}>
                        <div>{allMessage[index].message}</div>
                        <div style={{ margin: "5px 0 0 0", textAlign: "end", fontSize: "12px" }}>{moment(`${allMessage[index].date}`).fromNow()}</div>
                      </div>
                    </Col>
                    {allMessage[index].user_send === userSend.iduser ? (
                      <Image
                        style={{ float: "right", height: "50px", width: "50px", borderRadius: "50px", color: "white", marginRight: "15px" }}
                        src={
                          userSend.imgprofil === "img1"
                            ? userSend.img1
                            : userSend.imgprofil === "img2"
                              ? userSend.img2
                              : userSend.imgprofil === "img3"
                                ? userSend.img3
                                : userSend.imgprofil === "img4"
                                  ? userSend.img4
                                  : userSend.imgprofil === "img5"
                                    ? userSend.img5
                                    : userSend.imgprofil
                        }
                      />
                    ) : (
                        ""
                      )}
                  </Row>
                ))}
              </Col>
            </Row>
            <Row className="chat-area-input">
              <Form className="chat-input" onSubmit={(e) => sendMessage(e)}>
                <Form.Control
                  onChange={(e) => onChangeMessage(e)}
                  value={message}
                  type="text"
                  placeholder="Enter your message"
                  as="textarea"
                  name="message-input"
                />
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#cda7ff",
                    color: "black",
                    border: "none",
                  }}
                  disabled={disable}
                >
                  <SendIcon style={{ height: "30px", width: "50px", color: "white" }} />
                </Button>
              </Form>
            </Row>

          </Col>


        </Row>
      }

    </Container>
  );
};

export default Chat;