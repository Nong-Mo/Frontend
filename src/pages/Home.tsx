import React from 'react';
import BoxList from '../components/features/Home/BoxList';
import { useNavigate } from 'react-router-dom';
import { HomeTitle } from '../components/Home/HomeTitle';
import icon1 from '../icons/home/icon1.svg'
import icon2 from '../icons/home/icon2.svg'


const Home: React.FC = () => {
    const userName = '커여운한비쿤'; // 유저 닉네임

    const storageItems = [
        { id: 1, title: '책 보관함', count: 16, icon: icon1 },
        { id: 2, title: '사진 보관함', count: 32, icon: icon1 },
        { id: 3, title: '손편지 보관함', count: 8, icon: icon1 },
        { id: 4, title: '티켓 보관함', count: 100, icon: icon2 },
        { id: 5, title: '그림 보관함', count: 40, icon: icon2 },
        { id: 6, title: '영수증 보관함', count: 4, icon: icon2 },
    ];

    return (
        <div className="page-container flex flex-col min-h-screen">
            <div className="w-full bg-gray-900 min-h-screen text-white">
                <HomeTitle userName={userName} />
                <div className="pl-[39px] pr-[39px]">
                    <h1 className="text-[40px] font-bold">
                        <div>안녕하세요,</div>
                        <span className="text-blue-500" style={{ marginTop: '-10px', display: 'block' }}>커여운한비쿤 님!</span>
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
                <div className="mx-[39px] mt-[41px] mb-[16px] bg-gray-800 h-[64px] rounded-lg flex justify-center items-center cursor-pointer">
                    <span className="text-gray-400 text-2xl">+</span>
                </div>

                {/* 보관함 리스트 */}
                <div className="mx-[39px] space-y-4">
                    {storageItems.map((item) => (
                        <BoxList
                            key={item.id}
                            title={item.title}
                            count={item.count}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;