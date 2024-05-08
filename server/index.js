// index.js

// dotenv 설정
require('dotenv').config();



const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

/*-----routes -----------*/
const projectRoutes = require('./routes/projectRoutes'); // 라우터 파일 경로 수정
const getProjectsRoutes = require('./routes/getProjectsRoutes');
/*------routes end-------*/

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB와의 연결
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB에 연결되었습니다.');
    // 여기에 Express 앱 설정 및 미들웨어 등록

    // Express JSON 미들웨어
    app.use(express.json());

    app.use(cors());

    // socket.io 연결 설정
    io.on('connection', (socket) => {
      console.log('새로운 소켓 연결:', socket.id);
      // 이 곳에 socket 이벤트 핸들러 등록

      socket.on('updateChecklist', (data) => {
        console.log('체크리스트 업데이트:', data);
        io.emit('checklistUpdated', data);
      });
    });

    // 라우터 등록
    app.use('/api/projects', projectRoutes);
    app.use('/api/projects',getProjectsRoutes);

    server.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((err) => console.error('MongoDB 연결 오류:', err));
