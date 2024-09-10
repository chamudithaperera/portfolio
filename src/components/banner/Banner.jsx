import React from 'react';
import { Link } from 'react-router-dom';
//import img1 from '../../assets/images/layouts/banner.png'
//import img2 from '../../assets/images/icon/icon-01.png'
//import img3 from '../../assets/images/layouts/avt-01.png'edited.jpg
import img3 from '../../assets/images/layouts/edited.jpg'


function Banner(props) {
    return (
        <section className="banner">
                <div className="shape right"></div>
                <div className="container big">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="banner__left">
                                <div className="block-text">
                                    <h2 className="heading">Hello<br />
                                    I'm a Developer <span className="s1 arlo_tm_animation_text_word">&</span> <br />
                                        UI/UX Designer</h2>
                                    <p className="desc">Creating Meaningful Digital Experiences Through Design and Development</p>

                                    <Link to="/contact" className="action-btn"><span>Get Connected</span></Link>
                                </div>

                                <div className="pay">
                                    <h6>Connect with us:</h6>

                                    <div className="list">
                                        {/* <ul>
                                            <li><Link to="#"><span className="icon-logo-01"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-02"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-03"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-04"></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-05"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></span></Link></li>
                                            <li><Link to="#"><span className="icon-logo-06"></span></Link></li>
                                        </ul> */}
                                <ul className="list-social">
                                    <li><Link to="https://github.com/chamudithaperera">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 0C5.37258 0 0 5.37258 0 12C0 17.3025 3.43802 21.8 8.20702 23.385C8.80502 23.495 9.02502 23.132 9.02502 22.839C9.02502 22.578 9.01702 21.877 9.01302 20.952C5.72602 21.631 5.02002 19.445 5.02002 19.445C4.50202 18.184 3.74302 17.84 3.74302 17.84C2.66002 17.192 3.82502 17.207 3.82502 17.207C5.00602 17.287 5.65902 18.454 5.65902 18.454C6.73702 20.247 8.49502 19.726 9.20402 19.44C9.31702 18.692 9.60702 18.162 9.93702 17.866C7.23502 17.561 4.44502 16.528 4.44502 11.927C4.44502 10.617 4.92902 9.562 5.71502 8.765C5.60002 8.459 5.19502 7.134 5.82002 5.349C5.82002 5.349 6.73502 5.099 9.02002 6.672C10.084 6.371 11.18 6.215 12.28 6.209C13.38 6.215 14.475 6.371 15.54 6.672C17.825 5.099 18.74 5.349 18.74 5.349C19.365 7.134 18.96 8.459 18.845 8.765C19.63 9.562 20.115 10.617 20.115 11.927C20.115 16.537 17.315 17.554 14.605 17.847C14.955 18.177 15.295 18.827 15.295 19.833C15.295 21.287 15.285 22.537 15.285 22.829C15.285 23.13 15.5 23.5 16.1 23.385C20.865 21.8 24.305 17.3025 24.305 12C24.305 5.37258 18.9274 0 12 0Z" fill="white"/>
                                        </svg>
                                    </Link></li>
                                    <li><Link to="https://www.linkedin.com/in/chamudithaperera">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.225 0H1.771C0.792 0 0 0.771 0 1.729V22.27C0 23.228 0.792 24 1.771 24H22.222C23.204 24 24 23.228 24 22.27V1.729C24 0.771 23.204 0 22.225 0ZM7.125 20.452H3.833V9H7.125V20.452ZM5.479 7.508C4.337 7.508 3.413 6.563 3.413 5.42C3.413 4.278 4.338 3.333 5.479 3.333C6.62 3.333 7.546 4.278 7.546 5.42C7.546 6.563 6.62 7.508 5.479 7.508ZM20.452 20.452H17.16V14.718C17.16 13.364 17.125 11.63 15.244 11.63C13.34 11.63 13.073 13.064 13.073 14.627V20.451H9.78V9H12.924V10.578H12.964C13.399 9.841 14.352 8.977 15.815 8.977C19.1 8.977 20.454 10.91 20.454 14.154V20.453H20.452Z" fill="white"/>
                                    </svg>

                                    </Link></li>
                                    <li><Link to="https://www.facebook.com/chamuditha.kavishan.1">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325V22.675C0 23.407 0.593 24 1.325 24H12.82V14.692H9.692V11.077H12.82V8.462C12.82 5.449 14.732 3.862 17.42 3.862C18.77 3.862 19.955 3.994 20.317 4.048V7.307H18.574C17.241 7.307 16.846 7.966 16.846 8.997V11.076H20.254L19.847 14.691H16.846V24H22.675C23.407 24 24 23.407 24 22.675V1.325C24 0.593 23.407 0 22.675 0Z" fill="white"/>
                                    </svg>

                                            
                                    </Link></li>
                                    <li><Link to="https://www.instagram.com/chamuditha_kavishan/">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.96.24 2.42.412.57.21.98.46 1.41.887.427.427.678.837.887 1.407.172.46.358 1.25.412 2.42.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.96-.412 2.42a3.828 3.828 0 0 1-.887 1.41c-.427.427-.837.678-1.407.887-.46.172-1.25.358-2.42.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.96-.24-2.42-.412a3.83 3.83 0 0 1-1.41-.887c-.427-.427-.678-.837-.887-1.407-.172-.46-.358-1.25-.412-2.42-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.96.412-2.42.21-.57.46-.98.887-1.41.427-.427.837-.678 1.407-.887.46-.172 1.25-.358 2.42-.412C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.735 0 8.332.013 7.052.072 5.768.13 4.718.31 3.872.678 3.014 1.052 2.352 1.515 1.69 2.176.98 2.886.517 3.548.143 4.406.098 4.854.072 5.768.013 7.052 0 8.332 0 8.735 0 12s.013 3.668.072 4.948c.057 1.284.229 2.333.595 3.179.374.858.837 1.52 1.497 2.18.66.66 1.322 1.123 2.18 1.497.846.366 1.895.538 3.179.595 1.28.059 1.683.072 4.948.072s3.668-.013 4.948-.072c1.284-.057 2.333-.229 3.179-.595.858-.374 1.52-.837 2.18-1.497.66-.66 1.123-1.322 1.497-2.18.366-.846.538-1.895.595-3.179.059-1.28.072-1.683.072-4.948s-.013-3.668-.072-4.948c-.057-1.284-.229-2.333-.595-3.179a5.68 5.68 0 0 0-1.497-2.18 5.682 5.682 0 0 0-2.18-1.497c-.846-.366-1.895-.538-3.179-.595C15.668.013 15.265 0 12 0zM12 5.838a6.162 6.162 0 0 0-6.162 6.162A6.162 6.162 0 0 0 12 18.162a6.162 6.162 0 0 0 6.162-6.162A6.162 6.162 0 0 0 12 5.838zm0 10.2a4.038 4.038 0 1 1 0-8.076 4.038 4.038 0 0 1 0 8.076zm6.406-11.844a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88z" fill="white"/>
                                    </svg>

                                    </Link></li>
                                </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">

                            <div className="banner__right">
                                <div className="image">
                                    <img src={img3} alt="cyfonii" />
                                </div>

                                <div className="owner">
                                    <div className="image">
                                        <img src={img3} alt="cyfonii" />
                                    </div>
                                    <div className="content">
                                        <h5>Chamuditha Perera</h5>
                                        <p>@ChamudithaPerera</p>
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