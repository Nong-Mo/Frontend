import React from 'react';
import CollectionItem from "./CollectionItem.tsx";

interface CollectionGridProps {
    items : any[];
}

const CollectionGrid = ({items} : CollectionGridProps) => {
    return (
        <div className="w-full">
            <div className="h-full">
                <div className="grid grid-cols-2 gap-[15px] pb-[30px]">
                    {items?.map(item => (
                        <CollectionItem
                            key={item.id}
                            title={item.title}
                            date={item.date}
                            itemType="BOOK"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionGrid;