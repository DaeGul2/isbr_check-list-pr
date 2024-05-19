const mongoose = require('mongoose');
const { Schema } = mongoose;

// Review 스키마 정의
const reviewSchema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const examRoomSchema = new Schema({
  roomNum: { type: Number, required: true },
  checklistItems: {
    type: Map,
    of: String,
    default: {} // 기본값은 빈 객체
  },
  manager: { type: String, required: true, default: " " },
  admin_check: {
    checked: { type: Boolean, default: false },
    checkedAt: { type: Date, default: null }
  },
  admin_reviews: { type: [reviewSchema], default: [] } // review 배열로 변경
});

const taskSchema = new Schema({
  overseers: [{ type: String, required: true }],
  projectName: { type: String, required: true },
  code: { type: String, required: true },
  venueName: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  toCheckList: [{ type: String, required: true }],
  examDate: { type: Date, required: true },  // 날짜 필드 추가
  examRooms: [examRoomSchema]
});

const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;
