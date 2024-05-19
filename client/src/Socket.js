// src/socket.js
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false, // 자동 연결 방지
});

export default socket;
