import React from 'react';

const BrowserWarning: React.FC = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#181A20]">
            <div className="w-[350px] p-6">
                <h2 className="text-xl font-bold text-red-600 mb-4 text-center">브라우저 지원 안내</h2>
                <p className="text-white mb-4">
                    원활한 서비스 이용을 위해 Chrome 브라우저를 이용해 주시기 바랍니다.
                </p>
                <div className="mt-4">
                    <p className="text-sm text-white mb-2">
                        1. App Store에서 Chrome을 설치해주세요.
                    </p>
                    <p className="text-sm text-white">
                        2. Safari의 공유 버튼을 눌러 Chrome으로 열기를 선택해주세요.
                    </p>
                </div>
                <a 
                    href="https://apps.apple.com/kr/app/google-chrome/id535886823"
                    className="mt-6 block w-full py-2 px-4 bg-[#246BFD] rounded-[25px]  text-white text-center transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    iOS용 Chrome 다운로드
                </a>
            </div>
        </div>
    );
};

export default BrowserWarning