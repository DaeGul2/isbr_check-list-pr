import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExamTable = ({ projectData }) => {
  console.log(projectData)
  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>고사실</th>
            <th>담당자</th>
            {projectData.toChecklist.map((item, index) => (
              <th key={index}>{item}</th> // 각 체크리스트 항목을 헤더로 추가
            ))}
          </tr>
        </thead>
        {/* <tbody>
          {projectData.examRooms.map((room, index) => (
            <tr key={index}>
              <td>{room.roomNum}</td>
              <td>{room.manager}</td>
              {projectData.toChecklist.map((checkItem, idx) => (
                <td key={idx}>{room.checklistItems[checkItem]}</td> // 각 체크리스트 상태를 셀로 추가
              ))}
            </tr>
          ))} 
        </tbody> */}
      </table>
    </div>
  );
};

export default ExamTable;
