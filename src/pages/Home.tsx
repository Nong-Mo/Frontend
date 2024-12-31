import React from 'react';
import BoxList from '../components/features/Home/BoxList';

const Home: React.FC = () => {
    const storageItems = [
        { id: 1, title: '책 보관함', count: 16, icon: '/assets/pencils.png' },
        { id: 2, title: '사진 보관함', count: 32, icon: '/assets/pencils.png' },
        { id: 3, title: '손편지 보관함', count: 8, icon: '/assets/pencils.png' },
        { id: 4, title: '티켓 보관함', count: 100, icon: '/assets/pencils.png' },
        { id: 5, title: '그림 보관함', count: 40, icon: '/assets/pencils.png' },
        { id: 6, title: '영수증 보관함', count: 4, icon: '/assets/pencils.png' },
    ];

    return (
        <div className="page-container">
            <div className="w-full bg-gray-900 min-h-screen text-white">
                {/* 상단 영역 */}
                <div className="px-6 py-4">
                    <p className="text-gray-400 text-sm">커여운한비쿤 님의 보관함</p>
                    <h1 className="text-2xl font-bold">
                        안녕하세요, <span className="text-blue-500">커여운한비쿤 님!</span>
                    </h1>
                </div>

                {/* "+" 버튼 */}
                <div className="mx-6 my-4 bg-gray-800 h-12 rounded-lg flex justify-center items-center cursor-pointer">
                    <span className="text-gray-400 text-2xl">+</span>
                </div>

                {/* 보관함 리스트 */}
                <div className="px-6">
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
