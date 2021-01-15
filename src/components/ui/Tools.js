import React from 'react';
export default function Tools(props) {
  return (
    <div className="sub">
      <div className="sub-title">
          Tools
      </div>
      <div className="sub-filters">
        <div>
            <button onClick={props.addImage}><h2>테스트용 이미지 추가</h2></button>
        </div>
      </div>
    </div>
  );
}