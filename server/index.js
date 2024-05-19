// dotenv 설정
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const session = require('express-session');
const socketIo = require('socket.io');
const cors = require('cors');
const MongoStore = require('connect-mongo');

const apiKey = process.env.API_KEY; // 안전한 API 키를 설정하세요

// API 키 검증 미들웨어
function validateApiKey(req, res, next) {
  const clientApiKey = req.header('x-api-key'); // 헤더에서 API 키 추출
  if (clientApiKey === apiKey) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
}



const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL, // 이 설정은 모든 도메인에서 소켓 접속을 허용합니다. 실제 배포시에는 지정된 도메인을 설정해야 합니다.
    methods: ["GET", "POST", "PUT"],
    credentials: true
  }
});

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB와의 연결
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB에 연결되었습니다.');

    // Express JSON 미들웨어
    app.use(express.json());

    app.use(cors(
      {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
      }
    ));
    app.use(
      session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: MONGODB_URI }),
        cookie: { maxAge: 86400000 } // 24시간
      })
    );

    // API 키 검증 미들웨어를 /api/로 시작하는 모든 경로에 적용
    app.use('/', validateApiKey);

    // socket.io 연결 설정
    io.on('connection', (socket) => {
      console.log('새로운 소켓 연결:', socket.id);

      socket.on('disconnect', () => {
        console.log('소켓 연결 종료:', socket.id);
      });


      socket.on('updateChecklist', (data) => {
        console.log('체크리스트 업데이트:', data);
        io.emit('checklistUpdated', data);
      });
    });

    // 라우터 인스턴스화 및 소켓 전달
    const projectRoutes = require('./routes/projectRoutes')(io);
    const getProjectsRoutes = require('./routes/getProjectsRoutes')(io);
    const getExamDetailsRoutes = require('./routes/getExamDetailsRoutes')(io);
    const updateExamRoomRoutes = require('./routes/updateExamRoutes')(io);
    const updateProjcetsRoutes = require('./routes/updateProjects')(io);
    const getProjectByIdRoutes = require('./routes/getProjectByIdRoutes');
    const adminRoutes = require('./routes/adminRoutes');
    const examAdminRoutes = require('./routes/examRoomRoutes')

    // 라우터 등록
    app.use('/api/projects', projectRoutes);
    app.use('/api/projects', getProjectsRoutes);
    app.use('/api/exams', getExamDetailsRoutes);
    app.use('/api/examroom', updateExamRoomRoutes);
    app.use('/api/projects', updateProjcetsRoutes);
    app.use('/api/project', getProjectByIdRoutes);
    app.use('/', adminRoutes);
    app.use('/api/examRooms', examAdminRoutes);

    server.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((err) => console.error('MongoDB 연결 오류:', err));
