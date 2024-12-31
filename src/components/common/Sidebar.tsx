import React from "react";

interface SidebarProps {
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarProps> = ({
  leftSidebar,
  rightSidebar,
}) => {
  return (
    <div className="sidebar-container flex min-h-screen bg-gray-50">
      {leftSidebar && (
        <div className="border-r  bg-black sidebar-container">
          {leftSidebar}
        </div>
      )}

      {rightSidebar && (
        <div className="border-l  bg-black sidebar-container">
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default SidebarLayout;
