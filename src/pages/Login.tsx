import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">로그인</h1>
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/signin')}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;