const CategorySkeleton = ({ count, layoutStyle, columns }) => {
    const items = Array(count).fill(0);
    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${layoutStyle === "grid" ? columns : 1}, 1fr)`,
        gap: '20px',
        padding: '10px',
    };

    return (
        <div className="category-skeleton-container" style={containerStyle}>
            {items.map((_, index) => (
                <div key={index} className="category-skeleton-item" 
                     style={{
                         padding: '15px', 
                         border: '1px solid #ddd',
                         borderRadius: '4px',
                         display: layoutStyle === "list" ? 'flex' : 'block',
                         alignItems: layoutStyle === "list" ? 'center' : 'stretch',
                         backgroundColor: '#f9f9f9',
                     }}>
                    <div className="skeleton-box-img" 
                         style={{ 
                            width: layoutStyle === "list" ? "60px" : "100%",
                            height: layoutStyle === "list" ? "60px" : "100px",
                            marginBottom: layoutStyle === "list" ? "0" : "10px",
                            marginRight: layoutStyle === "list" ? "15px" : "0",
                         }}></div>
                    <div style={{ flexGrow: 1 }}>
                        <div className="skeleton-box-title" style={{ margin: layoutStyle === "list" ? "0 0 5px 0" : "8px auto" }}></div>
                        <div className="skeleton-box-count" style={{ margin: layoutStyle === "list" ? "0" : "8px auto 0" }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategorySkeleton;

