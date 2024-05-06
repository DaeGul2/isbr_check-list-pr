// controllers/projectController.js
const Tasks = require('../models/Task');

// 최초 프로젝트 생성 컨트롤러
exports.createProject = async (req, res) => {
  try {
    const { overseers, projectName, venueName, numberOfRooms, toCheckList } = req.body;

    // toCheckList를 기반으로 examRooms 생성
    const examRooms = Array.from({ length: numberOfRooms }, (_, index) => ({
      roomNum: index + 1, // 방 번호 설정, 1부터 시작
      checklistItems: toCheckList.map(item => ({
        details: new Map([[item, ""]]) // toCheckList의 각 항목을 key로 사용하고, 초기값은 빈 문자열
      }))
    }));

    // 새로운 프로젝트 document 생성
    const project = new Tasks({
      overseers,
      projectName,
      venueName,
      numberOfRooms,
      toCheckList,
      examRooms
    });

    // MongoDB에 저장
    const newProject = await project.save();

    // 클라이언트에 응답
    res.status(201).json({
      message: "Project successfully created",
      project: newProject
    });
  } catch (error) {
    // 에러 처리
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
};
