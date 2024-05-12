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