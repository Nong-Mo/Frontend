import React from 'react';

interface InfoTextProps {
    title: string;
    subtitle: string;
}

const InfoText: React.FC<InfoTextProps> = ({ title, subtitle }) => {
    return (
        <div className="mb-[65px] h-[100px] pt-[15px]">
            <h1 className="primary-info-text">{title}</h1>
            <span>{subtitle}</span>
        </div>
    );
};

export default InfoText;