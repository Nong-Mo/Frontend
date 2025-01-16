import {FaBlog, FaBookOpen, FaLightbulb, FaPencilAlt, FaPlus, FaStickyNote} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import {NavBar} from '../components/common/NavBar';
import InfoText from '../components/common/InfoText';
import BoxList from '../components/features/Home/BoxList';
import React, {useState, useEffect} from "react";
import useAuth from '../hooks/useAuth';
import {getStorageList, StorageResponse} from '../api/storage';
import {ROUTES} from "../routes/constants.ts";

// [Import] For SVG
import idea from '../icons/home/images/image_idea_0.png';
import novel from '../icons/home/images/image_novel_0.png';
import chat from '../icons/home/images/image_chat_0.png';
import pencil from '../icons/home/images/image_pencil_0.png';
import monitor from '../icons/home/images/image_monitor_0.png';
import text from '../icons/home/images/image_text_0.png';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const [userData, setUserData] = useState<StorageResponse>({nickname: '', storageList: []});
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
        {
            id: 1,
            title: '영감',
            icon: <img src={idea} className="w-[35px] h-[35px]" alt="영감 아이콘" />,
            path: ROUTES.LIBRARY.IDEA.path,
            countColor: '#94F0F0',
            isActive: true
        },
        {
            id: 2,
            title: '소설',
            icon: <img src={novel} className="w-[35px] h-[35px]" alt="소설 아이콘" />,
            path: ROUTES.LIBRARY.NOVEL.path,
            countColor: '#FFDD72',
            isActive: true
        },
        {
            id: 3,
            title: '블로그',
            icon: <img src={monitor} className="w-[35px] h-[35px]" alt="블로그 아이콘" />,
            path: '',
            countColor: '#FBA3FF',
            isActive: false
        },
        {
            id: 4,
            title: '서평',
            icon: <img src={chat} className="w-[35px] h-[35px]" alt="서평 아이콘" />,
            path: '',
            countColor: '#A5F59C',
            isActive: false
        },
        {
            id: 5,
            title: '메모',
            icon: <img src={pencil} className="w-[35px] h-[35px]" alt="메모 아이콘" />,
            path: '',
            countColor: '#FF968E',
            isActive: false
        },
        {
            id: 6,
            title: '일기',
            icon: <img src={text} className="w-[35px] h-[35px]" alt="일기 아이콘" />,
            path: '',
            countColor: '#FFDD72',
            isActive: false
        }
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
        return <div className="w-full min-h-screen"/>;
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
                        <FaPlus className="w-4 h-4 text-white"/>
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
