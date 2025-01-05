import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListModalOption } from '../common/ListModalOption';
import music from '../../icons/common/music.png';
import document from '../../icons/common/document.png';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  options?: {
    label: string;
    value: string;
    path?: string;
    icon?: string;
  }[];
}

const ConvertModal: React.FC<ConvertModalProps> = ({ 
  isOpen, 
  onClose,
  options = [
    { 
      label: '오디오 듣기', 
      value: 'audio', 
      path: '/player',
      icon: music  // 중괄호 제거
    },
    { 
      label: 'PDF 보기', 
      value: 'pdf', 
      path: '/player-pdf',
      icon: document  // 중괄호 제거
    }
  ]
}) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>(options[0].value);

  if (!isOpen) return null;

  const handleOptionChange = (option: string, path?: string) => {
    setSelectedOption(option);
    if (path) {
      navigate(path);
    }
    onClose();
  };

  return (
    <div className="w-full flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      <div className="bg-[#262A34] w-full max-w-[310px] rounded-2xl relative z-10 -top-[650px]">
        {options.map((option, index) => (
          <ListModalOption
            key={option.value}
            label={option.label}
            icon={<img src={option.icon} alt="" className="w-5 h-5" />}  // icon을 이미지 컴포넌트로 변환
            isSelected={selectedOption === option.value}
            onClick={() => handleOptionChange(option.value, option.path)}
            showDivider={index < options.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ConvertModal;