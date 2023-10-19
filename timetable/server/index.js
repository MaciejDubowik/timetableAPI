import express from 'express';
import cors from 'cors';
import http from 'http';
// import socketIo from 'socket.io';
import { faker } from '@faker-js/faker';

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
app.use(cors());


//generateUsers

var usersData = []

function generateUser(id) {
    var user = {
        id: id,
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: faker.internet.email()
    }
    return user;
}

for (let i = 0; i < 10; i++) {
    usersData.push(generateUser(i))
}




app.get('/students', (req, res) => {
    res.json({ usersData });
});

app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    const user = usersData[parseInt(id, 10)]
    res.json({ user });
});


const port = process.env.PORT || 3000;


server.listen(port, () => {
    console.log(`Serwer uruchomiony na porcie ${port}`);
});
