import { FaPlus } from 'react-icons/fa';
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
        { id: 1, title: '책', icon: <FaBook />, path: '/library/book', countColor: '#FFDD72' },
        { id: 2, title: '영수증', icon: <FaReceipt />, path: '/library/receipt', countColor: '#94F0F0' },
        { id: 3, title: '굿즈', icon: <FaGift />, path: '', countColor: '#FBA3FF' },
        { id: 4, title: '필름 사진', icon: <FaCameraRetro />, path: '', countColor: '#A5F59C' },
        { id: 5, title: '서류', icon: <FaFileAlt />, path: '', countColor: '#FF968E' },
        { id: 6, title: '티켓', icon: <FaTicketAlt />, path: '', countColor: '#FFDD72' },
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
        return <div>Loading...</div>; // 로딩 상태 처리
    }

    return (
        <div className="w-full flex flex-col min-h-screen z-10">
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