import React from 'react';

interface InfoTextProps {
    title: string;
    subtitle: React.ReactNode; // subtitle 타입을 React.ReactNode로 변경
}

const InfoText: React.FC<InfoTextProps> = ({ title, subtitle }) => {
    return (
        <div className="pt-[15px]">
            <h1 className="primary-info-text">{title}</h1>
            <span>{subtitle}</span>
        </div>
    );
};

export default InfoText;