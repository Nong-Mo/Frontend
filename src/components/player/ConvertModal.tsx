import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ListModalOption } from '../common/ListModalOption';
import music from '../../icons/common/music.png';
import document from '../../icons/common/document.png';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConvertModal: React.FC<ConvertModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    // 현재 경로에 따라 초기 선택 상태 설정
    if (location.pathname === '/playerpdf') {
      setSelectedOption('pdf');
    } else if (location.pathname === '/player') {
      setSelectedOption('audio');
    }
  }, [location.pathname]);

  if (!isOpen) return null;

  const handleOptionChange = (option: string, path?: string) => {
    setSelectedOption(option);
    if (path) {
      navigate(path);
    }
    onClose();
  };

  const options = [
    {
      label: '오디오 듣기',
      value: 'audio',
      path: '/player',
      icon: music,
    },
    {
      label: 'PDF 보기',
      value: 'pdf',
      path: '/playerpdf',
      icon: document,
    },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="bg-[#262A34] w-full max-w-[310px] rounded-2xl relative z-10 -mt-[570px]">        {options.map((option, index) => (
          <ListModalOption
            key={option.value}
            label={option.label}
            icon={<img src={option.icon} alt="" className="w-5 h-5" />}
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