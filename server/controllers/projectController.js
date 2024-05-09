// controllers/projectController.js
const Tasks = require('../models/Task');

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}



// 최초 프로젝트 생성 컨트롤러
exports.createProject = async (req, res, io) => {
  try {
    const { overseers, projectName, venueName, numberOfRooms, toCheckList, examDate } = req.body;
    let code, existingProject;
    do {
      code = generateCode();
      existingProject = await Tasks.findOne({ code }); // 코드 중복 검사
    } while (existingProject); // 중복되는 코드가 있으면 반복
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
      code,
      projectName,
      venueName,
      numberOfRooms,
      toCheckList,
      examRooms,
      examDate: new Date(examDate)
    });

    // MongoDB에 저장
    const newProject = await project.save();

    io.emit('projectCreated', { message: 'Project successfully created', project: newProject });
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


// 모든 현재 진행 중인 프로젝트 조회
exports.getProjects = async (req, res, io) => {
  try {
    const page = parseInt(req.query.page) || 1;   // 요청에서 page를 받아오고, 기본값은 1
    const pageSize = parseInt(req.query.pageSize) || 30; // 페이지 크기, 기본값은 10

    // 전체 문서 수 계산
    const total = await Tasks.countDocuments();

    // 페이지에 맞게 문서 조회
    const projects = await Tasks.find({}, '_id overseers projectName venueName numberOfRooms examDate code')
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    io.emit('projectsFetched', { total, pages: Math.ceil(total / pageSize), data: projects });
    res.status(200).json({
      total,
      pages: Math.ceil(total / pageSize),
      data: projects
    });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ message: 'Failed to retrieve projects' });
  }
};