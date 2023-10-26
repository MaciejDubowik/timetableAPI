import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'apollo-server-express';
import { faker } from '@faker-js/faker';

// Apollo Server
const typeDefs = gql` #graphql
    type Student {
        id: Int
        name: String
        surname: String
        email: String
    }

    type Query {
        students: [Student]
    }
`;

const resolvers = {
    Query: {
        students: () => studentsData
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const app = express();
await server.start()
app.use('/grapghql',cors(), express.json(), expressMiddleware(server));

app.use(cors({
    origin: '*'
}
))



// Tworzenie danych o studentach
const studentsData = [];

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
    studentsData.push(generateUser(i))
}


app.get('/students', (req, res) => {
    res.json({ usersData: studentsData });
});

app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    const user = studentsData[parseInt(id, 10)]
    res.json({ user });
});

const port = process.env.PORT || 4000; // Poprawienie portu

app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});
