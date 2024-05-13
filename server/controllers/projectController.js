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
      checklistItems: toCheckList.reduce((acc, curr) => {
        acc[curr] = false; // toCheckList의 각 항목을 키로 사용하고, 초기값은 false
        return acc;
      }, {})
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



exports.updateExamRoom = async (req, res, io) => {
  try {
    const { manager, checklistItems, projectId, roomId } = req.body;
    const mongoose = require('mongoose');
    const projectObjectId = new mongoose.Types.ObjectId(projectId);
    const roomObjectId = new mongoose.Types.ObjectId(roomId);

    const project = await Tasks.findById(projectObjectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 문자열로 변환하여 비교
    const roomIndex = project.examRooms.findIndex(room => room._id.toString() === roomObjectId.toString());
    if (roomIndex === -1) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // manager와 checklistItems 업데이트
    project.examRooms[roomIndex].manager = manager;
    project.examRooms[roomIndex].checklistItems = checklistItems;

    // 데이터베이스에 변경사항 저장
    const updatedProject = await project.save();

    // 클라이언트에 업데이트된 프로젝트 정보 송신
    io.emit('projectUpdated', updatedProject);

    // 성공 응답 보내기
    res.status(200).json({ message: 'Exam room updated successfully', project: updatedProject });
  } catch (error) {
    console.error('Error updating exam room:', error);
    res.status(500).json({ message: 'Error updating exam room' });
  }
};


// Express route handler
exports.updateProject = async (req, res, io) => {
  try {
    const { project: newProject } = req.body; // Destructure the project data from request body
    console.log("씨발 여기", newProjcet);
    if (!newProject._id) {
      return res.status(400).send('Project ID is required');
    }

    // Convert string ID to a MongoDB ObjectId
    const projectId = newProject._id;
    const options = { new: true }; // Option to return the updated document

    // Find the document by ID and update it
    const updatedProject = await Tasks.findByIdAndUpdate(projectId, newProject, options);
    io.emit('projectUpdated', updatedProject);

    if (!updatedProject) {
      return res.status(404).send('Project not found');
    }

    res.send(updatedProject); // Send the updated project back
  } catch (error) {
    console.error('Update project failed:', error);
    res.status(500).send('Server error');
  }
};