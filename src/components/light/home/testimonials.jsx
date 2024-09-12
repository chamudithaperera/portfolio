import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

function Testimonials() {
  const swiperOptions = {
    modules: [Navigation],
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 1000,
    navigation: {
      nextEl: '.testimonials .swiper-button-next',
      prevEl: '.testimonials .swiper-button-prev',
    },
  };

  return (
    <div className="sec-box testimonials section-padding">
      <div className="pad-left">
        <div className="sec-head mb-80 wow fadeInUp">
          <div className="row">
            <div className="col-lg-7">
              <h6 className="sub-title opacity-7 mb-15">Testimonials</h6>
              <h3>
                Trusted by <span className="main-color">Hundred Clients</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-9">
            <div className="testim-swiper wow fadeIn">
              <div className="testim">
                <Swiper
                  style={{ height: '400px' }}
                  id="content-carousel-container-unq-testim"
                  className="swiper-container"
                  {...swiperOptions}
                >
                  <SwiperSlide>
                    <div className="item ">
                      <div className="icon-img-60 mr-60">
                        <img src="/assets/imgs/svg-assets/quote.png" alt="" />
                      </div>
                      <div>
                        <div className="cont mb-30">
                          <div className="d-flex align-items-center">
                            <div className="rate-stars fz-12">
                              <span className="rate main-color">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                              </span>
                              <span className="fz-12 opacity-7 ml-10">
                                (71 Reviews)
                              </span>
                            </div>
                          </div>
                          <p className="fz-20 mt-15">
                            We have purchased well into the thousands of items,
                            but this is without doubt one of the best we’ve been
                            lucky enough to work on, the attention to detail
                            apparent throughout, and the delivery is impressively
                            intuitive.
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <div>
                            <div className="img">
                              <img src="/assets/imgs/testim/1.jpg" alt="" />
                            </div>
                          </div>
                          <div className="ml-30">
                            <div className="info">
                              <h6 className="main-color">Leonard Heiser</h6>
                              <span className="fz-13 mt-10 opacity-8">
                                Envato customer
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  {/* Repeat SwiperSlides as needed */}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="col-lg-3 d-flex align-items-end justify-content-end">
            <div className="swiper-controls testim-controls arrow-out d-flex mr-20 ml-auto">
              <div
                className="swiper-button-prev swiper-button-disabled"
                tabIndex="0"
                role="button"
                aria-label="Previous slide"
                aria-disabled="true"
              >
                <span className="left">
                  {/* SVG for previous button */}
                </span>
              </div>
              <div
                className="swiper-button-next ml-50"
                tabIndex="0"
                role="button"
                aria-label="Next slide"
                aria-disabled="false"
              >
                <span className="right">
                  {/* SVG for next button */}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="icon-qoute">
        <i className="fas fa-quote-left"></i>
      </span>
    </div>
  );
}

export default Testimonials;
