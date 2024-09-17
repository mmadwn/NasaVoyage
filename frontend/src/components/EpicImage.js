import React from 'react';

const EpicImage = ({ image }) => {
  const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${image.date.substr(0, 4)}/${image.date.substr(5, 2)}/${image.date.substr(8, 2)}/png/${image.image}.png`;

  return (
    <div className="epic-image">
      <img src={imageUrl} alt={image.caption} style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />
      <p className="image-caption">{image.caption}</p>
      <p className="image-date">Date: {image.date}</p>
    </div>
  );
};

export default EpicImage;
