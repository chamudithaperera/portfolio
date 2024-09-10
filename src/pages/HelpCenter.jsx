import React from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import FaqPage from '../components/faqs/FaqPage';
import dataFaqs from '../assets/fake-data/data-faq';
import Footer from '../components/footer/Footer';

import img from '../assets/images/layouts/mockup.png'





function HelpCenter(props) {

    
    return (
        <div className='wrapper page-help'>

            <PageTitle title='Help Center' />

            <FaqPage data={dataFaqs} />

            <section className="watch-video">
            <div className="shape"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="block-text center">
                                
                                <h3 className="heading">See how we
                                    <br />
                                    solve problems</h3>
                                    
                                    
                            </div>

                            <div className="watch-video__main">
                                <div className="main">
                                    <div className="wrap-video">
                                        <a href="https://www.youtube.com/watch?v=i7EMACWuErA" className="popup-youtube">
                                            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.853 7.25168C16.2247 8.01369 16.2247 9.9863 14.853 10.7483L2.97129 17.3493C1.63822 18.0899 -7.9231e-07 17.1259 -7.25651e-07 15.601L-1.48576e-07 2.39903C-8.19178e-08 0.874059 1.63822 -0.0898765 2.97129 0.650714L14.853 7.25168Z" fill="#D9D9D9"/>
                                                <path d="M14.853 7.25168C16.2247 8.01369 16.2247 9.9863 14.853 10.7483L2.97129 17.3493C1.63822 18.0899 -7.9231e-07 17.1259 -7.25651e-07 15.601L-1.48576e-07 2.39903C-8.19178e-08 0.874059 1.63822 -0.0898765 2.97129 0.650714L14.853 7.25168Z" fill="url(#paint0_linear_787_6121)"/>
                                                <defs>
                                                <linearGradient id="paint0_linear_787_6121" x1="43.9319" y1="31.9348" x2="38.9828" y2="-12.545" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.164688" stopColor="#DEC7FF"/>
                                                <stop offset="0.855177" stopColor="#5C27FE"/>
                                                </linearGradient>
                                                </defs>
                                                </svg>
                                                
                                        </a>
                                    </div>

                                    <h5>Watch video</h5>

                                    <img src={img} alt="Cyfonii" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            
        </div>
    );
}

export default HelpCenter;