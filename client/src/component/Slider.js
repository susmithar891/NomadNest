import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // basic Swiper styles
import 'swiper/css/navigation'; // module styles for Navigation
import 'swiper/css/pagination'; // module styles for Pagination
import 'swiper/css/scrollbar'; // module styles for Scrollbar
import 'swiper/css/free-mode'; // module styles for FreeMode
import 'swiper/css/thumbs'; // module styles for Thumbs

import {FreeMode,Pagination, Navigation, Thumbs } from 'swiper/modules';


const Slider = (props) => {


    const [show, setShow] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return (
        <>
            {show && (
                        <div className="container">
                            <Swiper
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
                                navigation={true}
                                className="swiper_container m-1 row"
                                >
                                {props.images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={img} alt="child" className="rounded" style={{height : 350+'px'}} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
            )}
        </>
    );
}

export default Slider

