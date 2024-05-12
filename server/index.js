// dotenv 설정
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // 이 설정은 모든 도메인에서 소켓 접속을 허용합니다. 실제 배포시에는 지정된 도메인을 설정해야 합니다.
        methods: ["GET", "POST"]
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
    app.use(cors());

    // socket.io 연결 설정
    io.on('connection', (socket) => {
      console.log('새로운 소켓 연결:', socket.id);
      
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

    // 라우터 등록
    app.use('/api/projects', projectRoutes);
    app.use('/api/projects', getProjectsRoutes);
    app.use('/api/exams', getExamDetailsRoutes);
    app.use('/api/examroom',updateExamRoomRoutes);

    server.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((err) => console.error('MongoDB 연결 오류:', err));
