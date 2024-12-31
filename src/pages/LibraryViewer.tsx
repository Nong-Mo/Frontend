import React, { useState } from "react";
import { NavBar } from "../components/common/NavBar.tsx";
import ViewerContent from "../components/LibraryViewer/ViewerContent.tsx";

const LibraryViewer = () => {
  const [emptyTab, setEmptyTab] = useState(true);

  return (
    <div className="page-container flex flex-col z-10">
      {/*  상단 네비게이션 바 */}
      <NavBar title={"책 보관함"} rightIcon="search"/>

      {/*  텍스트 영역 */}
      <div className="flex flex-col pl-[41px] pt-[4px]">
        <div className="primary-info-text">
          {emptyTab ? "보관함이 비었어요" : "감상하고 싶은"}
        </div>
        <div className="primary-info-text mt-[-5px]">
          {emptyTab ? "책을 추가해 주세요" : "책을 선택해 주세요"}
        </div>
      </div>

      {/*  Content 영역 */}
      <div className="flex justify-center">
        <ViewerContent width={327} height={713} />
      </div>
    </div>
  );
};

export default LibraryViewer;
