const ProductCardSkeleton = () => {
    return (
        <div className="product-card-skeleton">
            <div className="skeleton-image" />
            <div className="skeleton-content">
                <div className="skeleton-text skeleton-text-sm" />
                <div className="skeleton-text skeleton-text-md" />
                <div className="skeleton-price" />
                <div className="skeleton-button" />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
