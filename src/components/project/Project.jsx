import React , {useState} from 'react';
import PropTypes from 'prop-types';

import { Navigation , Pagination   } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { Link } from 'react-router-dom';

Project.propTypes = {
    data: PropTypes.array
};

function Project(props) {
    const {data} = props;

    const [dataBlock] = useState(
        {
            subheading: 'Our Speciality',
            heading: 'OUR COLLECTION',
            
        }
    )
    return (
        <section className="project">
            <div className="shape right"></div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="block-text center">
                            <h6 className="sub-heading"><span>{dataBlock.subheading}</span></h6>
                            <h3 className="heading" >{dataBlock.heading}</h3>
                        </div>

                        <Swiper
                                className="project-swiper"
                                spaceBetween={30}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                        },
                                    768: {
                                        slidesPerView: 2,
                                    },
                                    991: {
                                        slidesPerView: 3,
                                    },
                                }}
                                loop={true}
                                modules={[ Navigation , Pagination ]}
                                navigation
                                pagination={{
                                    clickable: true,
                                  }}
                                
                            >

                                {
                                    data.map(idx => (
                                        <SwiperSlide key={idx.id}>
                                            <div className="swiper-slide">
                                                <div className="project-box">
                                                    <div className="image">
                                                        <Link to="/nfts">
                                                            <img src={idx.img} alt="Cyfonii" />
                                                        </Link>
                                                    </div>
                                                    <div className="content">
                                                        <Link to="/nfts" className="h5 title">{idx.title}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }
                               
                            </Swiper>

                    </div>

                </div>
            </div>
        </section>
    );
}

export default Project;