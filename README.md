# Matcha

This project is about creating a dating website.
A user will be able to register, connect, fill his/her profile, search and look into the profile of other users, chat with those that "liked" back and more !

![alt text](https://github.com/warharra/Matcha/blob/master/img1.png)

![alt text](https://github.com/warharra/Matcha/blob/master/img2.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

node version 11.11.0

npm version 6.9.0

mamp (for SQL DB)

### Installing

Start Servers on Mamp and go to phpMyAdmin. To create matcha database you have to use the following script:

node back-end/src/config/faker.js

Finally, they are two main folders. You have to download all dependencies and then run the start script.

Client side. (port 3000 by default)

```
cd client/
npm i
npm start
```

Server side (port 8000 by default)

```
cd server/
npm i
npm start
```

And that's it ! Now you can try to match people and maybe find the true love ;)

## Built With

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [ReactBootstrap](https://react-bootstrap.github.io/) - The most popular front-end framework rebuilt for React.
- [Socket.io](https://socket.io/) - Featuring the fastest and most reliable real-time engine

## Authors

- **Valentin Rossi** - _Student at 42 Paris_ - [Linkedin](https://www.linkedin.com/in/valentin-rossi-8a5639a6/)
- **Alexandre Soysavanh** - _Student at 42 Paris_

## Acknowledgments

- React Hooks
- ReactBootstrap style
- Responsive design
- Fetching data
- Socket real-time communication
- Asynchronous programmation
- Server error handling (http code)
- SQL optimization (pool, table, ref, ...)
- Team work (Git branch, Trello, ...)
