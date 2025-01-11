import React, { useEffect, useRef, useState } from 'react';

interface Vertex { x: number; y: number; id: string; isDragging: boolean }

interface VertexPreviewProps {
    imageData: string;
    initialVertices?: Vertex[];
    originalSize?: { width: number; height: number };
    className?: string;
}

const VertexPreview: React.FC<VertexPreviewProps> = ({
    imageData,
    initialVertices = [],
    originalSize,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [vertices, setVertices] = useState<Vertex[]>(initialVertices);
    const [draggingVertex, setDraggingVertex] = useState<Vertex | null>(null);
    let x = 0;
    let y = 0;

    useEffect(() => {
        const drawImage = async () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container || !imageData || !originalSize) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // 고해상도 디스플레이 지원을 위한 캔버스 크기 조정
            const scale = window.devicePixelRatio;
            canvas.width = containerWidth * scale;
            canvas.height = containerHeight * scale;
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${containerHeight}px`;
            ctx.scale(scale, scale);

            const img = new Image();
            img.src = imageData;

            await new Promise<void>(resolve => {
                img.onload = () => {
                    // 이미지 스무딩 비활성화
                    ctx.imageSmoothingEnabled = false;

                    const imgRatio = img.width / img.height;
                    const containerRatio = containerWidth / containerHeight;

                    let drawWidth = containerWidth;
                    let drawHeight = containerHeight;

                    if (imgRatio > containerRatio) {
                        drawHeight = containerWidth / imgRatio;
                    } else {
                        drawWidth = containerHeight * imgRatio;
                    }

                    x = (containerWidth - drawWidth) / 2;
                    y = (containerHeight - drawHeight) / 2;

                    ctx.clearRect(0, 0, containerWidth, containerHeight);
                    ctx.drawImage(img, x, y, drawWidth, drawHeight);

                    if (vertices && vertices.length > 0) {
                        const scaleX = drawWidth / originalSize.width;
                        const scaleY = drawHeight / originalSize.height;

                        ctx.beginPath();
                        ctx.strokeStyle = '#2563eb';
                        ctx.lineWidth = 2;

                        // 영역 그리기 시작
                        ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
                        ctx.moveTo(x + vertices[0].x * scaleX, y + vertices[0].y * scaleY);

                        vertices.forEach((vertex) => {
                            const vertexX = x + vertex.x * scaleX;
                            const vertexY = y + vertex.y * scaleY;
                            ctx.lineTo(vertexX, vertexY);
                        });

                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }

                    resolve();
                };
            });
        };

        drawImage();

        const observer = new ResizeObserver(() => {
            drawImage();
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [imageData, vertices, originalSize]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!originalSize) return;

        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleX = canvas.width / originalSize.width;
        const scaleY = canvas.height / originalSize.height;
        const scaledVertices = vertices.map(v => ({...v, x: x + v.x * scaleX, y: y + v.y * scaleY}));

        const clickedVertex = scaledVertices.find(vertex => {
            const dx = mouseX - vertex.x;
            const dy = mouseY - vertex.y;
            return Math.sqrt(dx * dx + dy * dy) < 5;
        });

        if(clickedVertex){
            setDraggingVertex(clickedVertex);
            setVertices(prev => prev.map(v => v.id === clickedVertex.id ? {...v, isDragging: true} : v));
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingVertex || !originalSize) return;

        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleX = canvas.width / originalSize.width;
        const scaleY = canvas.height / originalSize.height;

        setVertices(prev => prev.map(v => v.id === draggingVertex.id ? {...v, x: (mouseX - x) / scaleX, y: (mouseY - y) / scaleY} : v));
    };

    const handleMouseUp = () => {
        if (draggingVertex) {
            setVertices(prev => prev.map(v => v.id === draggingVertex.id ? {...v, isDragging: false} : v));
            setDraggingVertex(null);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{cursor: draggingVertex ? 'grabbing' : 'default'}}
            />
        </div>
    );
};

export default VertexPreview;