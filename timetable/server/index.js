import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'apollo-server-express';
import { faker } from '@faker-js/faker';
import swaggerUi from'swagger-ui-express';
import swaggerAutogen from 'swagger-autogen';

const app = express();

//swagger
    const doc = {
        info: {
            version: '',            // by default: '1.0.0'
            title: '',              // by default: 'REST API'
            description: ''         // by default: ''
        },
        servers: [
            {
                url: 'http://localhost:4000',              // by default: 'http://localhost:3000'
                description: ''       // by default: ''
            },
            // { ... }
        ],
        tags: [                   // by default: empty Array
            {
                name: '',             // Tag name
                description: ''       // Tag description
            },
            // { ... }
        ],
        components: {}            // by default: empty object
    };
    

    const routes = ['./index.js'];
    const def = await swaggerAutogen({ openapi: '3.0.0' })('./swagger.json', routes, doc);

    if(def){
        app.use('/swagger', swaggerUi.serve, swaggerUi.setup(def.data));
    }


// Apollo Server
const typeDefs = gql`
    type Student {
        id: Int
        name: String
        surname: String
        email: String
    }

    type Course {
        id: Int
        name: String
        description: String
    }

    type Teacher {
        id: Int
        name: String
        email: String
    }

    type Query {
        students: [Student]
        student(id: Int): Student
        courses: [Course]
        course(id: Int): Course
        teachers: [Teacher]
        teacher(id: Int): Teacher
    }

    type Mutation {
        addStudent(input: StudentInput): Student
        addCourse(input: CourseInput): Course
        addTeacher(input: TeacherInput): Teacher
    }

    input StudentInput {
        name: String
        surname: String
        email: String
    }

    input CourseInput {
        name: String
        description: String
    }

    input TeacherInput {
        name: String
        email: String
    }
`;

const resolvers = {
    Query: {
        students: () => studentsData,
        student: (parent, args) => studentsData.find(student => student.id === args.id),
        courses: () => coursesData,
        course: (parent, args) => coursesData.find(course => course.id === args.id),
        teachers: () => teachersData,
        teacher: (parent, args) => teachersData.find(teacher => teacher.id === args.id),
    },
    Mutation: {
        addStudent: (parent, args) => {
            const newStudent = { id: studentsData.length + 1, ...args.input };
            studentsData.push(newStudent);
            return newStudent;
        },
        addCourse: (parent, args) => {
            const newCourse = { id: coursesData.length + 1, ...args.input };
            coursesData.push(newCourse);
            return newCourse;
        },
        addTeacher: (parent, args) => {
            const newTeacher = { id: teachersData.length + 1, ...args.input };
            teachersData.push(newTeacher);
            return newTeacher;
        },
    },
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
});

await server.start()
app.use('/graphql',cors(), express.json(), expressMiddleware(server));

app.use(cors({
    origin: '*'
}
))


const studentsData = [];
const teachersData = [];
const coursesData = [];

function generateUser(id) {
    var user = {
        id: id,
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: faker.internet.email()
    }
    return user;
}

function generateTeacher(id) {
    return {
        id: id,
        name: faker.name.firstName(),
        email: faker.internet.email(),
    };
}

function generateCourse(id) {
    return {
        id: id,
        name: faker.random.words(),
        description: faker.lorem.sentence(),
    };
}

for (let i = 0; i < 10; i++) {
    studentsData.push(generateUser(i))
}

for (let i = 0; i < 10; i++) {
    teachersData.push(generateTeacher(i))
}

for (let i = 0; i < 10; i++) {
    coursesData.push(generateCourse(i))
}



app.get('/students', (req, res) => {
    res.json({ usersData: studentsData });
});

app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    const user = studentsData[parseInt(id, 10)]
    res.json({ user });
});

app.get('/students', (req, res) => {
    res.json({ usersData: studentsData });
});

app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    const user = studentsData.find(student => student.id === parseInt(id, 10));

    if (user) {
        res.json({ user });
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

app.post('/students', (req, res) => {
    const newStudent = generateUser(studentsData.length);
    studentsData.push(newStudent);
    res.status(201).json({ user: newStudent });
});

app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const updatedUserData = req.body;

    const index = studentsData.findIndex(student => student.id === parseInt(id, 10));

    if (index !== -1) {
        studentsData[index] = { ...studentsData[index], ...updatedUserData };
        res.json({ user: studentsData[index] });
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

app.delete('/students/:id', (req, res) => {
    const { id } = req.params;

    const index = studentsData.findIndex(student => student.id === parseInt(id, 10));

    if (index !== -1) {
        const deletedUser = studentsData.splice(index, 1)[0];
        res.json({ deletedUser });
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

app.get('/courses', (req, res) => {
    res.json({ coursesData });
});

app.get('/courses/:id', (req, res) => {
    const { id } = req.params;
    const course = coursesData.find(course => course.id === parseInt(id, 10));

    if (course) {
        res.json({ course });
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

app.post('/courses', (req, res) => {
    const newCourse = generateCourse(coursesData.length);
    coursesData.push(newCourse);
    res.status(201).json({ course: newCourse });
});

app.put('/courses/:id', (req, res) => {
    const { id } = req.params;
    const updatedCourseData = req.body;

    const index = coursesData.findIndex(course => course.id === parseInt(id, 10));

    if (index !== -1) {
        coursesData[index] = { ...coursesData[index], ...updatedCourseData };
        res.json({ course: coursesData[index] });
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;

    const index = coursesData.findIndex(course => course.id === parseInt(id, 10));

    if (index !== -1) {
        const deletedCourse = coursesData.splice(index, 1)[0];
        res.json({ deletedCourse });
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});


app.get('/teachers', (req, res) => {
    res.json({ teachersData });
});

app.get('/teachers/:id', (req, res) => {
    const { id } = req.params;
    const teacher = teachersData.find(teacher => teacher.id === parseInt(id, 10));

    if (teacher) {
        res.json({ teacher });
    } else {
        res.status(404).json({ error: 'Teacher not found' });
    }
});

app.post('/teachers', (req, res) => {
    const newTeacher = generateTeacher(teachersData.length);
    teachersData.push(newTeacher);
    res.status(201).json({ teacher: newTeacher });
});

app.put('/teachers/:id', (req, res) => {
    const { id } = req.params;
    const updatedTeacherData = req.body;

    const index = teachersData.findIndex(teacher => teacher.id === parseInt(id, 10));

    if (index !== -1) {
        teachersData[index] = { ...teachersData[index], ...updatedTeacherData };
        res.json({ teacher: teachersData[index] });
    } else {
        res.status(404).json({ error: 'Teacher not found' });
    }
});

app.delete('/teachers/:id', (req, res) => {
    const { id } = req.params;

    const index = teachersData.findIndex(teacher => teacher.id === parseInt(id, 10));

    if (index !== -1) {
        const deletedTeacher = teachersData.splice(index, 1)[0];
        res.json({ deletedTeacher });
    } else {
        res.status(404).json({ error: 'Teacher not found' });
    }
});





const port = process.env.PORT || 4000; 

app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});


