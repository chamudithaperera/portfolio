import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // Corrected import from 'swiper/modules' for Navigation module

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

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

function Testimonials() {
  return (
    <div className="sec-box testimonials section-padding">
      <div className="pad-left">
        <div className="sec-head mb-80 wow fadeInUp">
          <div className="row">
            <div className="col-lg-7">
              <h6 className="sub-title opacity-7 mb-15">Customer Reviews</h6>
              <h3>
                  {/* Trusted by <span className="main-color">Hundred Clients</span> */}
                  Coming <span className="main-color">Soon...</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-9">
            <div className="testim-swiper wow fadeIn">
              <Swiper
                style={{ height: '400px' }}
                {...swiperOptions}
                className="swiper-container"
              >
                <SwiperSlide>
                  <div className="item">
                    <div className="icon-img-60 mr-60">
                      {/* <img src="/assets/imgs/svg-assets/quote.png" alt="Quote" /> */}
                    </div>
                    <div>
                      <div className="cont mb-30">
                        <div className="d-flex align-items-center">
                          <div className="rate-stars fz-12">
                            {/* <span className="rate main-color">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                            </span> */}
                            {/* <span className="fz-12 opacity-7 ml-10">
                              (71 Reviews)
                            </span> */}
                          </div>
                        </div>
                        <p className="fz-20 mt-15">
                          {/* We have purchased well into the thousands of items,
                          but this is without doubt one of the best we’ve been
                          lucky enough to work on; the attention to detail is
                          apparent throughout, and the delivery is impressively
                          intuitive. */}
                        </p>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="img">
                          {/* <img src="/assets/imgs/testim/1.jpg" alt="Leonard Heiser" /> */}
                        </div>
                        {/* <div className="ml-30">
                          <div className="info">
                            <h6 className="main-color">Leonard Heiser</h6>
                            <span className="fz-13 mt-10 opacity-8">
                              Envato customer
                            </span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>

                {/* Additional SwiperSlide components as needed */}
                
              </Swiper>
            </div>
          </div>
          <div className="col-lg-3 d-flex align-items-end justify-content-end">
            <div className="swiper-controls testim-controls arrow-out d-flex mr-20 ml-auto">
              <div
                className="swiper-button-prev"
                tabIndex="0"
                role="button"
                aria-label="Previous slide"
              >
                {/* SVG for previous button */}
              </div>
              <div
                className="swiper-button-next ml-50"
                tabIndex="0"
                role="button"
                aria-label="Next slide"
              >
                {/* SVG for next button */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <span className="icon-quote">
        <i className="fas fa-quote-left"></i>
      </span> */}
    </div>
  );
}

export default Testimonials;
