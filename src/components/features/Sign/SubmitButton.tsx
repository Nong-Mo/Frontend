const SubmitButton = ({ children }: { children: React.ReactNode }) => {
    return (
        <button
            type="submit"
            className="w-full py-3 bg-blue-500 rounded text-white font-semibold hover:bg-blue-600"
        >
            {children}
        </button>
    );
};

export default SubmitButton;
