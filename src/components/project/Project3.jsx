import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import img from '../../assets/images/layouts/avt-01.png'

Project3.propTypes = {
    data: PropTypes.array
};

function Project3(props) {
    const {data} = props
    return (
        <section className="nft">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="filter">
                                <form action="#" className="widget-search">
                                    <input type="text" placeholder="Search item here..." required="" />
                                    <Link to='#' className="btn-search">
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9.7659" cy="9.76639" r="8.98856" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                                            <path d="M16.0176 16.4849L19.5416 19.9997" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </Link>
                                </form>
                                <div id="category" className="dropdown">
                                    <Link to="#" className="btn-selector nolink ">All categories</Link>
                                    <ul className="">
                                        <li><span>All Items</span></li>
                                        <li><span>Bundles</span></li>
                                    </ul>
                                </div>
                                <div id="buy" className="dropdown">
                                    <Link to="#" className="btn-selector nolink ">Buy now</Link>
                                    <ul className="">
                                        <li><span>All Items</span></li>
                                        <li><span>Bundles</span></li>
                                    </ul>
                                </div>
                                <div id="item" className="dropdown">
                                    <Link to="#" className="btn-selector nolink ">All item</Link>
                                    <ul className="">
                                        <li><span>All Items</span></li>
                                        <li><span>Bundles</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {
                            data.map(idx => (
                                <div key={idx.id} className="col-xl-3 col-md-6">
                                    <div className="nft-item">                               
                                        <div className="card-media">
                                            <Link to="#"><img src={idx.img} alt="Cyfonii" /></Link>
                                            
                                            
                                        </div>
                                        <div className="card-title">
                                            <Link to="#" className="h5">{idx.title}</Link>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    <img src={img} alt="Cyfonii" />
                                                </div>
                                                <div className="info">
                                                    <span>Owned by</span>
                                                    <Link to="#" className="h6">Roger Herwitz</Link>
                                                </div>
                                            </div>
                                            <Link to='#' className="wishlist-button heart">
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.75 4.3125C11.75 2.86292 10.5256 1.6875 9.01533 1.6875C7.88658 1.6875 6.91708 2.34433 6.5 3.28175C6.08292 2.34433 5.11342 1.6875 3.98408 1.6875C2.475 1.6875 1.25 2.86292 1.25 4.3125C1.25 8.52417 6.5 11.3125 6.5 11.3125C6.5 11.3125 11.75 8.52417 11.75 4.3125Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    
                                                <span className="number-like"> 3432</span></Link>
                                        </div>
                                        <div className="card-bottom style-explode">
                                            <div className="price">
                                                <span className="icon-logo-01"></span>
                                                <div className="price-details">
                                                    <span> Current Bid</span>
                                                    <h6>0.45 ETH</h6>
                                                </div>
                                            </div>
                                            <div className="button-place-bid">
                                                <Link to="" data-toggle="modal" data-target="#popup_bid" className="sc-button"><span>Place Bid</span></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }


                    </div>
                </div>
            </section>
    );
}

export default Project3;