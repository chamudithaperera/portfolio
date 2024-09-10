import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from '../components/pagetitle/PageTitle';
import Faqs from '../components/faqs/Faqs';
import dataFaqs from '../assets/fake-data/data-faq';
import Footer from '../components/footer/Footer';

import { Navigation , Autoplay , Pagination   } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import data from '../assets/fake-data/dataPartner'

Partners.propTypes = {
    
};

function Partners(props) {
    return (
        <div className='wrapper'>

            <PageTitle title='Partners & Investors' />

            <section className="partner">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="block-text center">
    
                        <h3 className="heading">Partners & Investors 
                            </h3>
                    </div>

                    <Swiper
                                className="brands-swiper"
                                spaceBetween={30}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 2,
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
                                    data.slice(0,6).map(idx => (
                                        <SwiperSlide key={idx.id}>
                                            <a href="#"><img src={idx.img} alt="cyfonii" /></a>
                                        </SwiperSlide>
                                    ))
                                }
                               
                            </Swiper>
                            <Swiper
                                className="brands-swiper"
                                spaceBetween={30}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 2,
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
                                    data.slice(0,6).map(idx => (
                                        <SwiperSlide key={idx.id}>
                                            <a href="#"><img src={idx.img} alt="cyfonii" /></a>
                                        </SwiperSlide>
                                    ))
                                }
                               
                            </Swiper>
                            <Swiper
                                className="brands-swiper"
                                spaceBetween={30}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 2,
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
                                    data.slice(0,6).map(idx => (
                                        <SwiperSlide key={idx.id}>
                                            <a href="#"><img src={idx.img} alt="cyfonii" /></a>
                                        </SwiperSlide>
                                    ))
                                }
                               
                            </Swiper>
                            <Swiper
                                className="brands-swiper"
                                spaceBetween={30}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 2,
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
                                    data.slice(0,6).map(idx => (
                                        <SwiperSlide key={idx.id}>
                                            <a href="#"><img src={idx.img} alt="cyfonii" /></a>
                                        </SwiperSlide>
                                    ))
                                }
                               
                            </Swiper>

                </div>
            </div>
        </div>
    </section>

            <Faqs data={dataFaqs} />

            <Footer />
            
        </div>
    );
}

export default Partners;