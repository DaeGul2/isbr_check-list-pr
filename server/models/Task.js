const mongoose = require('mongoose');
const { Schema } = mongoose;

const checklistItemSchema = new Schema({
  details: {
    type: Map,
    of: String
  }
});

const examRoomSchema = new Schema({
  roomNum: { type: Number, required: true },
  checklistItems: [checklistItemSchema] // 체크리스트 아이템이 Map 타입으로 정의됨
});

const taskSchema = new Schema({
  overseers: [{ type: String, required: true }],
  projectName: { type: String, required: true },
  venueName: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  toCheckList:[{type: String, required: true}],
  examDate: { type: Date, required: true },  // 날짜 필드 추가,
  examRooms: [examRoomSchema]
});

const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;
