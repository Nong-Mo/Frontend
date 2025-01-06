import React, { useState, useEffect } from 'react';
import { NavBar } from '../components/common/NavBar';

const GoodsStorage: React.FC = () => {
 const [originalContent, setOriginalContent] = useState('');
 const [content, setContent] = useState('');
 const title = "치이카와 피규어"; // 백엔드 데이터
 const date = "2024. 01. 04 01:20"; // 백엔드 데이터

 // 초기 데이터 불러오기
 useEffect(() => {
   fetchContent();
 }, []);

 // 기존 텍스트 불러오기
 const fetchContent = async () => {
   try {
     const response = await fetch('/api/goods/content');
     
     if (response.status === 404) {
       // content가 없는 경우
       setContent('');
       setOriginalContent('');
       return;
     }

     if (!response.ok) {
       throw new Error('텍스트 불러오기 실패');
     }

     const data = await response.json();
     setContent(data.content);
     setOriginalContent(data.content);
   } catch (error) {
     console.error('텍스트 불러오기 실패:', error);
     // 에러 발생 시 빈 문자열로 초기화
     setContent('');
     setOriginalContent('');
   }
 };

 // 텍스트 저장하기
 const saveContent = async (text: string) => {
   try {
     // 처음 저장하는 경우는 POST, 수정하는 경우는 PATCH
     const method = originalContent === '' ? 'POST' : 'PATCH';

     const response = await fetch('/api/goods/content', {
       method,
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ content: text }),
     });

     if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: '저장 실패' }));
       throw new Error(errorData.message || '저장 실패');
     }

     setOriginalContent(text);
   } catch (error) {
     console.error('텍스트 저장 실패:', error);
   }
 };

 // textarea blur 이벤트 핸들러
 const handleBlur = () => {
   if (content.trim() !== '') {
     saveContent(content);
   }
 };

 return (
   <div className="w-full h-[896px] flex flex-col pl-10 pr-10 z-10">
     <NavBar
       title='굿즈 보관함'
       showMenu={false}
     />
     
     <div className="flex justify-center">
       <div className="w-full h-[768px]">
         <div className="w-full px-4 py-3 border-b flex flex-col items-center border-gray-700 text-white">
           <h1 className="text-[25px] font-bold">{title}</h1>
         </div>
         {/* 이미지 */}
         <div className="w-[334px] h-[334px]">
           <img 
             src="" 
             alt="굿즈 이미지" 
             className="w-full h-full object-cover rounded-xl"
           />
         </div>
         {/* 텍스트 필드 */}
         <div className="w-[334px] h-[369px] bg-[#262A34] rounded-xl flex flex-col">
           {/* 동일한 제목 표시 */}
           <div className="">
             <h2 className="text-xl font-bold text-white text-center mt-5 mb-3">{title}</h2>
           </div>
           
           {/* 감상 입력 영역 */}
           <div className="w-full h-[334px]">
             <textarea
               value={content}
               onChange={(e) => {
                 setContent(e.target.value);
               }}
               onBlur={handleBlur}
               placeholder="자유롭게 감상을 적어 주세요."
               className="w-full h-[234px] bg-[#262A34] rounded-lg p-4 text-white resize-none focus:outline-none scrollbar-hide text-justify"
               style={{ 
                 scrollbarWidth: 'none', 
                 msOverflowStyle: 'none',
                 wordSpacing: 'normal',
                 whiteSpace: 'pre-wrap',
                 wordBreak: 'keep-all',
                 letterSpacing: '-0.0125em'
               }}
             />
           </div>
           
           {/* 날짜 표시 */}
           <div className="text-center text-gray-400 text-sm mt-2 mb-5">
             {date}
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

// Hide scrollbar style
const styles = `
 .scrollbar-hide::-webkit-scrollbar {
   display: none;
 }
`;

// Add style to head
if (typeof document !== 'undefined') {
 const styleSheet = document.createElement('style');
 styleSheet.innerText = styles;
 document.head.appendChild(styleSheet);
}

export default GoodsStorage;