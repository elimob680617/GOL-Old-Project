import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const DialogCarousel = ({ media }) => (
  <div style={{ maxHeight: 300 }}>
    <Carousel>
      {media
        ? media.map((item, index) => (
            <div key={index}>
              <img src={item.link} alt={index} />
              {/* <p className="legend">{index}</p> */}
            </div>
          ))
        : null}
    </Carousel>
  </div>
);
export default DialogCarousel;
