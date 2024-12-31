import React from 'react';
import BoxList from '../components/features/Home/BoxList';
import { useNavigate } from 'react-router-dom';
import { HomeTitle } from '../components/Home/HomeTitle';
import icon1 from '../icons/home/icon1.svg';
import icon2 from '../icons/home/icon2.svg';
import plus from '../icons/home/plus.svg';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const userName = '커여운한비쿤'; // 유저 닉네임

    const storageItems = [
        { id: 1, title: '책 보관함', count: 16, icon: icon1, path: '/library', countColor: '#A5F59C' },
        { id: 2, title: '사진 보관함', count: 32, icon: icon1, path: '/home', countColor: '#A5F59C' },
        { id: 3, title: '손편지 보관함', count: 8, icon: icon1, path: '/home', countColor: '#A5F59C' },
        { id: 4, title: '티켓 보관함', count: 100, icon: icon2, path: '/home', countColor: '#A06AF9' },
        { id: 5, title: '그림 보관함', count: 40, icon: icon2, path: '/home', countColor: '#A06AF9' },
        { id: 6, title: '영수증 보관함', count: 4, icon: icon2, path: '/home', countColor: '#A06AF9' },
    ];

    const handleBoxClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className="page-container flex flex-col min-h-screen z-10">
            <div className="w-full min-h-screen text-white">
                <HomeTitle userName={userName} />
                <div className="pl-[39px] pr-[39px]">
                    <h1 className="text-[40px] font-bold">
                        <div>안녕하세요,</div>
                        <p className="text-blue-500" style={{ marginTop: '-10px', display: 'block' }}>커여운한비쿤 <span className="text-white">님!</span></p>
                    </h1>
                </div>

                {/* <div className="px-6 flex justify-between items-center">
                    <div
                        className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => navigate('/profile')}
                    >
                        <span className="text-white font-bold">{firstLetter}</span>
                    </div>
                </div> */}

                {/* "+" 버튼 */}
                <div className="mx-[39px] mt-[41px] mb-[16px] bg-[#262A34] h-[64px] rounded-lg flex justify-center items-center cursor-pointer">
                    <img
                        src={plus}
                        alt="플러스"
                    />
                </div>

                {/* 보관함 리스트 */}
                <div className="mx-[39px] space-y-4">
                    {storageItems.map((item) => (
                        <div key={item.id} onClick={() => handleBoxClick(item.path)} style={{ cursor: 'pointer' }}>
                            <BoxList
                                title={item.title}
                                count={item.count}
                                icon={item.icon}
                                countColor={item.countColor}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;