import React, { useEffect, useState } from 'react';
import { NavBar } from '../components/common/NavBar';

const PlayerPdfViewer: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPdfUrl = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/pdf/sample.pdf?t=${timestamp}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('PDF 로드 실패:', error);
        setError('PDF 파일을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    createPdfUrl();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  return (
    <div className="w-full h-[896px] flex flex-col pl-10 pr-10 z-10">
      <NavBar title="PDF 뷰어" rightIcon="search" />

      <div className="flex justify-center">
        <div className="w-[350px] h-[768px]">
          <div className="w-full px-4 py-3 border-b flex flex-col items-center border-gray-700 text-white">
            <h1 className="text-[25px] font-bold">해리포터와 아즈카반의 죄수</h1>
          </div>

          <div className="flex-1 w-full h-[calc(100%-64px)] overflow-hidden">
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            {!isLoading && error && (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF viewer"
                style={{ border: 'none' }}
                onError={() => {
                  setError('PDF 파일을 불러오는데 실패했습니다.');
                  console.log('iframe error');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPdfViewer;
