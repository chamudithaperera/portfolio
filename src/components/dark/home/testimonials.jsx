import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews from the API
    const fetchReviews = async () => {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    };

    fetchReviews();
  }, []);

  return (
    <div className="sec-box testimonials section-padding">
      <div className="pad-left">
        <div className="sec-head mb-80 wow fadeInUp">
          <div className="row">
            <div className="col-lg-7">
              <h6 className="sub-title opacity-7 mb-15">Customer Reviews</h6>
              <h3>
                {/* Trusted by <span className="main-color">Hundreds of Clients</span> */}
                 <span className="main-color">Coming Soon</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-9">
            <div className="testim-swiper wow fadeIn">
              <Swiper
                style={{ height: '400px' }}
                modules={[Navigation]}
                slidesPerView={1}
                spaceBetween={30}
                speed={1000}
                navigation={{
                  nextEl: '.testimonials .swiper-button-next',
                  prevEl: '.testimonials .swiper-button-prev',
                }}
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review._id}>
                    <div className="item">
                      <div className="icon-img-60 mr-60">
                        <img src="/assets/imgs/svg-assets/quote.png" alt="Quote" />
                      </div>
                      <div>
                        <div className="cont mb-30">
                          <div className="d-flex align-items-center">
                            <div className="rate-stars fz-12">
                              <span className="rate main-color">
                                {[...Array(review.rating)].map((_, index) => (
                                  <i key={index} className="fas fa-star"></i>
                                ))}
                              </span>
                            </div>
                          </div>
                          <p className="fz-20 mt-15">{review.comment}</p>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="ml-30">
                            <div className="info">
                              <h6 className="main-color">{review.name}</h6>
                              <span className="fz-13 mt-10 opacity-8">{review.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      <span className="icon-quote">
        <i className="fas fa-quote-left"></i>
      </span>
    </div>
  );
}

export default Testimonials;
