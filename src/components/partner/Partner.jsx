import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

import data from '../../assets/fake-data/dataPartner'


function Partner(props) {
    return (
        <div className="brands block-text center" data-aos="fade-up" data-aos-duration="2000">
                            <h6 className="sub-heading"><span>We Are Partnered with Top Brands</span></h6>

                            <Swiper
                                className="brands-swiper"
                                spaceBetween={30}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 2,
                                        },
                                    500: {
                                        slidesPerView: 3,
                                    },
                                    768: {
                                        slidesPerView: 4,
                                    },
                                    991: {
                                        slidesPerView: 6,
                                    },
                                }}
                                loop={true}
                                
                                
                            >
                                {
                                    data.map(idx => (
                                        <SwiperSlide key={idx.id} >
                                            <Link to="#"><img src={idx.img} alt="Cyfonii" /></Link>
                                        </SwiperSlide>
                                    ))
                                }

                            </Swiper>

                        </div>
    );
}

export default Partner;