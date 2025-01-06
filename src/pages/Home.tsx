import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import InfoText from '../components/common/InfoText';
import BoxList from '../components/features/Home/BoxList';
import { FaBook, FaReceipt, FaGift, FaCameraRetro, FaFileAlt, FaTicketAlt } from 'react-icons/fa';
import React from "react";
import useAuth from '../hooks/useAuth'; // useAuth 훅을 가져옵니다.

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // useAuth 훅에서 logout 함수를 가져옵니다.
    const userName = '커여운한비쿤'; // 유저 닉네임

    const storageItems = [
        { id: 1, title: '책', count: 30, icon: <FaBook />, path: '/library', countColor: '#FFDD72' },
        { id: 2, title: '영수증', count: 30, icon: <FaReceipt />, path: '/home', countColor: '#94F0F0' },
        { id: 3, title: '굿즈', count: 30, icon: <FaGift />, path: '/home', countColor: '#FBA3FF' },
        { id: 4, title: '필름 사진', count: 30, icon: <FaCameraRetro />, path: '/home', countColor: '#A5F59C' },
        { id: 5, title: '서류', count: 30, icon: <FaFileAlt />, path: '/home', countColor: '#FF968E' },
        { id: 6, title: '티켓', count: 30, icon: <FaTicketAlt />, path: '/home', countColor: '#FFDD72' },
    ];

    const handleBoxClick = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout(); // 로그아웃 로직을 실행합니다.
        navigate('/intro'); // intro 페이지로 리디렉션합니다.
    };

    return (
        <div className="w-full flex flex-col min-h-screen z-10">
            <NavBar title="커여운한비쿤 님의 보관함" showMenu={true} rightIcon="search" hideLeftIcon={true} alignTitle="left" />
            <div className="w-full flex justify-center">
                <div className="w-[350px] h-[768px] text-white">
                    <div className="w-full primary-info-text">
                        <InfoText title="안녕하세요," subtitle={<><span className="info-point-text">{userName}</span> <span className="primary-info-text">님!</span></>} />
                    </div>

                    <div className="w-full flex justify-center mt-[30px] h-[67.2px] bg-[#262A34] rounded-[16.5px] items-center">
                        <FaPlus className="w-4 h-4 text-white" />
                    </div>

                    <div className="w-full h-[493.2px] flex flex-col items-center">
                        {storageItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleBoxClick(item.path)}
                                style={{ cursor: 'pointer' }}
                            >
                                <BoxList
                                    title={item.title}
                                    count={item.count}
                                    icon={item.icon}
                                    countColor={item.countColor}
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        className="w-[350px] h-[16px] text-[12px] mt-[30px] mb-[15px] text-center font-semibold text-[#ffffff] cursor-pointer"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;