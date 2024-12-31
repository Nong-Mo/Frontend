import React from "react";
import { NavBar } from "../components/common/NavBar.tsx";
import ViewerContent from "../components/LibraryViewer/ViewerContent.tsx";

const LibraryViewer = () => {
  return (
    <div className="page-container flex flex-col">
      <NavBar title={"책 보관함"} />
      <div className="flex flex-col pl-[41px] pt-[4px]">
        <h1 className="h1-primary-text">보관함이 비었어요</h1>
        <h1 className="h1-primary-text">책을 추가해 주세요.</h1>
      </div>
      <div className="flex justify-center">
        <ViewerContent width={327} height={713} />
      </div>
    </div>
  );
};

export default LibraryViewer;
