import {FaBlog, FaBookOpen, FaLightbulb, FaPencilAlt, FaPlus, FaStickyNote} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/common/NavBar';
import InfoText from '../components/common/InfoText';
import BoxList from '../components/features/Home/BoxList';
import { FaBook, FaReceipt, FaGift, FaCameraRetro, FaFileAlt, FaTicketAlt } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import useAuth from '../hooks/useAuth';
import { getStorageList } from '../api/storage';
import { StorageResponse } from '../api/storage';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userData, setUserData] = useState<StorageResponse>({ nickname: '', storageList: [] });
    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStorageData = async () => {
            try {
                const data = await getStorageList();
                setUserData(data);
            } catch (error) {
                console.error('Failed to fetch storage data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStorageData();
    }, []);

    const storageItems = [
        { id: 1, title: '영감', icon: <FaLightbulb />, path: '/library/book', countColor: '#FFDD72', isActive: true }, // 영감/아이디어를 상징하는 전구 아이콘
        { id: 2, title: '소설', icon: <FaBook />, path: '/library/receipt', countColor: '#94F0F0', isActive: true }, // 책/소설을 나타내는 북 아이콘
        { id: 3, title: '블로그', icon: <FaBlog />, path: '', countColor: '#FBA3FF', isActive: false }, // 블로그 전용 아이콘
        { id: 4, title: '서평', icon: <FaBookOpen />, path: '', countColor: '#A5F59C', isActive: false }, // 책을 펼쳐보는 모습으로 서평을 표현
        { id: 5, title: '메모', icon: <FaStickyNote />, path: '', countColor: '#FF968E', isActive: false }, // 메모를 나타내는 스티키노트 아이콘
        { id: 6, title: '일기', icon: <FaPencilAlt />, path: '', countColor: '#FFDD72', isActive: false }, // 일기장을 나타내는 저널 아이콘
    ];

    const getFileCount = (storageName: string) => {
        const storage = userData.storageList.find(item => item.storageName === storageName);
        return storage?.fileCount || 0;
    };

    const handleBoxClick = (id: number, path: string) => {
        setSelectedBox(id);
        if (path) {
            navigate(path);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/intro');
    };

    if (isLoading) {
        return <div className="w-full min-h-screen" />;
    }

    return (
        <div className="w-full flex flex-col min-h-screen z-10 mt-[15px]">
            <NavBar
                title={`${userData.nickname} 님의 보관함`}
                hideLeftIcon={true}
                showMenu={false}
                alignTitle="left"
                iconNames={{
                    aiIcon: "AI 로봇"
                }}
                rightIcons={['ai']}
            />

            <div className="w-full flex justify-center">
                <div className="w-[350px] h-[768px] text-white">
                    <div className="w-full primary-info-text">
                        <InfoText 
                            title="안녕하세요," 
                            subtitle={
                                <>
                                    <span className="info-point-text">{userData.nickname}</span> 
                                    <span className="primary-info-text"> 님!</span>
                                </>
                            } 
                        />
                    </div>

                    <div className="w-full flex justify-center mt-[30px] h-[67.2px] bg-[#262A34] rounded-[16.5px] items-center">
                        <FaPlus className="w-4 h-4 text-white" />
                    </div>

                    <div className="w-full h-[493.2px] flex flex-col items-center">
                        {storageItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleBoxClick(item.id, item.path)}
                                className={`${item.path ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <BoxList
                                    title={item.title}
                                    count={getFileCount(item.title)}
                                    icon={item.icon}
                                    countColor={item.countColor}
                                    isActive={item.isActive}
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