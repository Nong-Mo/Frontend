import React from "react";
import { NavBar } from "../components/common/NavBar.tsx";

const LibraryViewer = () => {
  return (
    <div className="page-container flex flex-col">
      <NavBar />
      <div className="flex flex-col">
        <h1 className="h1-primary-text">보관함이 비었어요</h1>
        <h1 className="h1-primary-text">책을 추가해 주세요.</h1>
      </div>
    </div>
  );
};

export default LibraryViewer;
