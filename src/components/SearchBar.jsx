import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const { products } = useProducts();
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Search products
    const searchProducts = useCallback((searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const lowerQuery = searchQuery.toLowerCase();

        // Filter products (case-insensitive)
        const filtered = products.filter(product =>
            product.name?.toLowerCase().includes(lowerQuery) ||
            product.category?.toLowerCase().includes(lowerQuery) ||
            product.description?.toLowerCase().includes(lowerQuery)
        ).slice(0, 5); // Limit to 5 results

        setResults(filtered);
        setIsOpen(filtered.length > 0 || searchQuery.length > 0);
        setIsLoading(false);
    }, [products]);

    // Debounced search
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce(searchProducts, 300), [searchProducts]);

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
            if (onSearch) onSearch(query.trim());
            setIsOpen(false);
        }
    };

    // Handle result click
    const handleResultClick = (product) => {
        navigate(`/product/${product.id}`);
        setQuery('');
        setIsOpen(false);
    };

    // Handle clear
    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        if (onSearch) onSearch('');
        inputRef.current?.focus();
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="search-bar" ref={searchRef} role="search">
            <div className="search-input-wrapper">
                {isLoading ? (
                    <Loader2 className="search-icon search-loading" size={20} aria-hidden="true" />
                ) : (
                    <Search className="search-icon" size={20} aria-hidden="true" />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && results.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="search-input"
                    aria-label="Search products"
                    aria-expanded={isOpen}
                    aria-autocomplete="list"
                    aria-controls="search-results"
                    autoComplete="off"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="search-clear"
                        aria-label="Clear search"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div id="search-results" className="search-results" role="listbox">
                    {results.length > 0 ? (
                        results.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                className="search-result-item"
                                onClick={() => handleResultClick(product)}
                                role="option"
                            >
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="search-result-image"
                                        aria-hidden="true"
                                    />
                                )}
                                <div className="search-result-info">
                                    <span className="search-result-name">{product.name}</span>
                                    <span className="search-result-category">{product.category}</span>
                                </div>
                                <span className="search-result-price">৳{product.price}</span>
                            </button>
                        ))
                    ) : query.length > 0 ? (
                        <div className="search-no-results">
                            <p>No products found for "{query}"</p>
                            <button
                                type="submit"
                                className="search-view-all"
                            >
                                Search all products
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </form>
    );
};

export default SearchBar;
