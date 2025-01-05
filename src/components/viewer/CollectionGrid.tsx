import React from 'react';
import CollectionItem from "./CollectionItem.tsx";

const CollectionGrid = () => {
    const items = [
        {
            id: 1,
            title: "해리포터와 아즈카반의 죄수",
            date: "2024. 01. 04 01:20"
        },
        {
            id: 2,
            title: "나는 소망한다 내게 금지된 것을",
            date: "2024. 01. 04 01:20"
        },
        {
            id: 3,
            title: "개발자를 넘어 기술 리더로 가는 길",
            date: "2024. 01. 04 01:20"
        },
        {
            id: 4,
            title: "한 잔 크림잘 된 라떼",
            date: "2024. 01. 04 01:20"
        },
        {
            id: 5,
            title: "제목 5",
            date: "2024. 01. 04 01:20"
        },
        {
            id: 6,
            title: "제목 6",
            date: "2024. 01. 04 01:20"
        },
        {
            id: 7,
            title: "제목 7",
            date: "2024. 01. 04 01:20"
        },
        {
            id: 8,
            title: "제목 8",
            date: "2024. 01. 04 01:20"
        }
    ];

    return (
        <div className="w-full"> {/* flex-1 추가 */}
            <div className="h-full">
                <div className="grid grid-cols-2 gap-[15px] pb-[30px]">
                    {items.map(item => (
                        <CollectionItem
                            key={item.id}
                            title={item.title}
                            date={item.date}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionGrid;