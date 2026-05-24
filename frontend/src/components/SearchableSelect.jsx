import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const SearchableSelect = ({ value, onChange, options, placeholder, disabled, required, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => String(opt.value) === String(value));
    
    // Normalize string to ignore accents for better search
    const normalizeString = (str) => {
        // Handle "đ" character separately because NFD doesn't strip it to "d"
        let norm = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        norm = norm.replace(/đ/g, 'd');
        return norm;
    };

    const filteredOptions = options.filter(opt =>
        normalizeString(opt.label).includes(normalizeString(searchTerm))
    );

    return (
        <div ref={wrapperRef} className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* hidden native input to handle html standard form 'required' */}
            <select
                value={value}
                onChange={() => {}}
                className="hidden"
                required={required}
            >
                <option value="">{placeholder}</option>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <button
                type="button"
                className={`w-full flex items-center justify-between text-left ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`block truncate ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="p-2 border-b border-slate-100 flex items-center sticky top-0 bg-white">
                        <Search className="w-4 h-4 text-slate-400 mx-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent outline-none text-sm px-1 py-1 text-slate-700"
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-200">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-slate-500 text-center">Không tìm thấy kết quả</li>
                        ) : (
                            filteredOptions.map((opt) => (
                                <li
                                    key={opt.value}
                                    onClick={() => {
                                        onChange({ target: { value: opt.value } });
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors ${String(value) === String(opt.value) ? 'bg-slate-50 text-slate-900 font-medium' : 'text-slate-600'}`}
                                >
                                    {opt.label}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
