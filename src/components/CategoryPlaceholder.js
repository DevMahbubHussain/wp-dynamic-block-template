import React from 'react';
import { __ } from '@wordpress/i18n';
import { Icon, blockDefault } from '@wordpress/icons'; // Using the default block icon

const CategoryPlaceholder = ({ behavior, customUrl, name, imageSize }) => {
    
    // Style the placeholder based on the image size requested
    // A real implementation would use CSS classes for size control
    const placeholderStyle = {
        width: '100%',
        maxHeight: '100px',
        height: '80px', // Arbitrary height for visual consistency
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        color: '#aaaaaa',
        borderRadius: '4px',
        marginBottom: '10px',
        // Optional: Show the size being targeted
        fontSize: '10px', 
    };

    if (behavior === 'hide_placeholder') {
        return null;
    }

    if (behavior === 'custom_image' && customUrl) {
        return (
            <img 
                src={customUrl} 
                alt={__('Placeholder for %s', 'woo-builder').replace('%s', name)}
                style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', marginBottom: '10px' }}
            />
        );
    }

    // Default or 'default_icon' behavior
    return (
        <div style={placeholderStyle}>
            <Icon icon={blockDefault} size={24} />
            <span style={{ marginLeft: '5px' }}>
                {__('No Image', 'woo-builder')}
            </span>
        </div>
    );
};

export default CategoryPlaceholder;