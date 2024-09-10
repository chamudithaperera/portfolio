import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../assets/images/layouts/banner.png'
import img2 from '../../assets/images/icon/icon-01.png'
import img3 from '../../assets/images/layouts/avt-01.png'


function Banner(props) {
    return (
        <section className="banner">
                <div className="shape right"></div>
                <div className="container big">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="banner__left">
                                <div className="block-text">
                                    <h2 className="heading">Collect Next <br />
                                        Generation <span className="s1 arlo_tm_animation_text_word">NFTs</span> <br />
                                        Today</h2>
                                    <p className="desc">Cyfonii is the premier marketplace for nifties, which are digital items you can truly own for yourself</p>

                                    <Link to="/contact" className="action-btn"><span>Get Connected</span></Link>
                                </div>

                                <div className="pay">
                                    <h6>We are Monteno NFT</h6>

                                    <div className="list">
                                        <p>We accept:</p>

                                        <ul>
                                            <li><Link to="#"><span className="icon-logo-01"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-02"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-03"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-04"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-05"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-06"></span></Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">

                            <div className="banner__right">
                                <div className="image">
                                    <img src={img1} alt="cyfonii" />
                                </div>

                                <div className="price">
                                    <div className="icon">
                                        <img src={img2} alt="cyfonii" />
                                    </div>
                                    <div className="content">
                                        <p>Current Bid</p>
                                        <h5>2.26 ETH</h5>
                                    </div>
                                </div>

                                <div className="owner">
                                    <div className="image">
                                        <img src={img3} alt="cyfonii" />
                                    </div>
                                    <div className="content">
                                        <h5>Leslie Alexander</h5>
                                        <p>@leslie754</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default Banner;