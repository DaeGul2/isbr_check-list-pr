const mongoose = require('mongoose');
const { Schema } = mongoose;

// const checklistItemSchema = new Schema({
//   details: {
//     type: Map,
//     of: String
//   }
// });

const examRoomSchema = new Schema({
  roomNum: { type: Number, required: true },
  checklistItems: {
    type: Map,
    of: String,
    default: {} // 기본값은 빈 객체
  },
  manager: { type: String, required: true, default: " " }
});

const taskSchema = new Schema({
  overseers: [{ type: String, required: true }],
  projectName: { type: String, required: true },
  code:{type: String, required : true},
  venueName: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  toCheckList:[{type: String, required: true}],
  examDate: { type: Date, required: true },  // 날짜 필드 추가,
  examRooms: [examRoomSchema]
});

const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;
