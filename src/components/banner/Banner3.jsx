import React from 'react';

import { Link } from 'react-router-dom';

import img from '../../assets/images/layouts/deco.png'



function Banner3(props) {
    return (
        <section className="banner s3">
        <div className="shape"></div>
        <div className="shape right"></div>
        <div className="shape s3 right"></div>
   
        <div className="container big">
            <div className="row">
                <div className="col-xl-5 col-md-12">
                    <div className="banner__left">
                        <div className="block-text">
                            <h2 className="heading">Discover and
                                Collect Digital Art
                                and <span className="arlo_tm_animation_text_word"></span>
                                </h2>
                            <p className="desc">Cyfonii is the premier marketplace for nifties, which are digital items you can truly own for yourself</p>

                            <Link to="/contact" className="action-btn"><span>Explore Now</span></Link>
                            <Link to="/contact" className="action-btn s1"><span>Create NFT’s</span></Link>
                        </div>

                        <div className="couter-list">
                            <div className="couter-box">
                                <h4 className="numb">52K<span>+</span></h4>
                                <p>Artwork</p>
                            </div>
                            <div className="couter-box">
                                <h4 className="numb">27K<span>+</span></h4>
                                <p>Auction</p>
                            </div>
                            <div className="couter-box">
                                <h4 className="numb">18K<span>+</span></h4>
                                <p>Artist</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-7 col-md-12">

                    <div className="banner__right">
                        <div className="image-1">
                            <img src={img} alt="Cyfonii" />
                        </div>

                        <div className="banner-box" data-aos="fade-up" data-aos-duration="2000">
                            <div className="top">
                                <h4 className="title">Ninja 3D Digital Artwork</h4>

                                <div className="wishlist">
                                    <div className="icon">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.25 3.8125C11.25 2.36292 10.0256 1.1875 8.51533 1.1875C7.38658 1.1875 6.41708 1.84433 6 2.78175C5.58292 1.84433 4.61342 1.1875 3.48408 1.1875C1.975 1.1875 0.75 2.36292 0.75 3.8125C0.75 8.02417 6 10.8125 6 10.8125C6 10.8125 11.25 8.02417 11.25 3.8125Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        
                                    </div>
                                    <p>3432</p>
                                </div>
                            </div>

                            <div className="main">
                                <div className="info">
                                    <p>Current Bid</p>
                                    <h4>2.26 ETH</h4>
                                    <p>$8,154.36</p>
                                </div>

                                <div className="coundown">
                                    <p>Remaining time</p>
                                    <span className="js-countdown" data-timer="12865550"></span>
                                </div>
                            </div>

                            <div className="button">
                                <Link to="#" className="action-btn" data-toggle="modal" data-target="#popup_bid" data-dismiss="modal" aria-label="Close"><span>Place a Bid <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.5 16.5L19 9M19 9L11.5 1.5M19 9H1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg></span> 
                                    </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
    );
}

export default Banner3;