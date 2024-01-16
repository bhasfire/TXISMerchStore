import React, { useState } from 'react';

const ImageCarousel = ({ imageUrls, onClick, context, className }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    const handleNext = (e) => {
        e.stopPropagation(); // Prevent onClick from being triggered when clicking buttons
      setCurrentImageIndex((prevIndex) => 
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    };
  
    const handlePrevious = (e) => {
        e.stopPropagation(); // Prevent onClick from being triggered when clicking buttons
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
      );
    };

    const imageStyle = context === 'home' ? 
        { width: '100%', height: '300px', objectFit: 'cover', cursor: 'pointer' } : 
        {
            width: '100%',    // Use the full width of the container
            height: 'auto',   // Maintain aspect ratio
            objectFit: 'contain', // Ensure the image is fully visible
            cursor: 'pointer' // Change cursor to pointer on hover
        };
  
    return (
        <div className={className} style={{ position: 'relative' }} onClick={onClick}>
            <img 
                src={imageUrls[currentImageIndex]} 
                alt={''}
                loading = 'lazy'
                style={imageStyle}
            />
            {imageUrls.length > 1 && (
                <>
                    <button 
                        onClick={handlePrevious} 
                        style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
                        {"<"}
                    </button>
                    <button 
                        onClick={handleNext} 
                        style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                        {">"}
                    </button>
                </>
            )}
        </div>
    );
  };

export default ImageCarousel;