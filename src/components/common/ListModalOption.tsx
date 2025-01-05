import React from 'react';

interface ListModalOptionProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  showDivider?: boolean;
  icon?: React.ReactNode;
}

export const ListModalOption: React.FC<ListModalOptionProps> = ({
  label,
  isSelected,
  onClick,
  showDivider = false,
  icon
}) => {
  return (
    <>
      <button 
        className="w-full min-h-[60px] flex items-center justify-between px-5 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex-1 flex items-center gap-5">
          {icon && (
            <span className="flex items-center justify-center w-5 h-5 text-white">
              {icon}
            </span>
          )}
          <span className="text-lg text-white">{label}</span>
        </div>
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-[#4A7AFF]' : 'border-gray-600'} relative`}>
            {isSelected && (
              <div className="absolute inset-0.5 bg-[#4A7AFF] rounded-full">
                <div className="absolute inset-1 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </button>
      {showDivider && <div className="w-full h-[1px] bg-white/10" />}
    </>
  );
};