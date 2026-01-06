import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
            if (onSearch) onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
        if (onSearch) onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="search-input"
                    aria-label="Search products"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="search-clear"
                        aria-label="Clear search"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchBar;
