import React, { useState, useEffect } from 'react';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
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
  const { id } = useParams(); // fileID 파라미터 가져오기
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (location.pathname.includes('playerpdf')) {
      setSelectedOption('pdf');
    } else if (location.pathname.includes('player/audio')) {
      setSelectedOption('audio');
    }
  }, [location.pathname]);

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
      path: `/player/audio/${id}`,
      icon: music,
    },
    {
      label: 'PDF 보기',
      value: 'pdf',
      path: `/player/pdf/${id}`,
      icon: document,
    },
  ];

  if(!isOpen) return null;

  return (

    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 z-10"
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