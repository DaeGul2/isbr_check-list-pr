const Tasks = require('../models/Task');


exports.getExamDetails = async (req, res, io) => {
    const { code } = req.query; // URL 파라미터에서 code 추출
    try {
        const examDetails = await Tasks.findOne({ code: code }); // MongoDB에서 code로 문서 조회
        if (examDetails) {
            res.status(200).json(examDetails);
            io.emit('examUpdated', examDetails); // Socket을 통해 실시간 업데이트 전송
        } else {
            res.status(404).json({ message: 'Exam not found' }); // 문서가 없는 경우
        }
    } catch (error) {
        console.error('Failed to retrieve exam details:', error);
        res.status(500).json({ message: 'Error retrieving exam details' });
    }
};


// 특정 examRoom의 admin_check를 토글하는 함수
exports.toggleAdminCheck = async (req, res, io) => {
  try {
    const { examRoomId } = req.params;

    // 해당 examRoom을 찾고 admin_check 값을 토글
    const task = await Tasks.findOneAndUpdate(
      { 'examRooms._id': examRoomId },
      [
        {
          $set: {
            'examRooms.$.admin_check.checked': {
              $eq: [false, '$examRooms.admin_check.checked']
            },
            'examRooms.$.admin_check.checkedAt': new Date()
          }
        }
      ],
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Exam room not found' });
    }

    // 클라이언트에 변경 사항 브로드캐스트
    io.emit('adminCheckUpdated', { examRoomId, task });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// 특정 examRoom에 admin_review를 추가하는 함수
exports.addAdminReview = async (req, res, io) => {
  try {
    const { examRoomId } = req.params;
    const { text } = req.body;

    // 새로운 리뷰 객체 생성
    const newReview = { text, createdAt: new Date() };

    // 해당 examRoom을 찾고 admin_review 추가
    const task = await Tasks.findOneAndUpdate(
      { 'examRooms._id': examRoomId },
      { $push: { 'examRooms.$.admin_reviews': newReview } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Exam room not found' });
    }

    // 클라이언트에 변경 사항 브로드캐스트
    io.emit('adminReviewAdded', { examRoomId, newReview });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};