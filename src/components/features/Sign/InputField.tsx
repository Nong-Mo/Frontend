const InputField = ({ label, type, name, value, onChange, placeholder, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full border p-2 rounded-full h-12 ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ paddingRight: '2.5rem' }} // 아이콘 위치 확보
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        </div>
    );
};

export default InputField;
