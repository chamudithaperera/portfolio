import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


import line from '../../assets/images/background/line-2.png'

Team2.propTypes = {
    data: PropTypes.array
};

function Team2(props) {

    const {data} = props
    return (
        <section className="team s2">
                    <div className="shape right"></div>
                    <img src={line} alt="" className="img-line" />
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="block-text center">
                                    <h6 className="sub-heading"><span>Team Members</span></h6>
                                    <h3 className="heading wow" data-splitting>Our Amazing Team
                                        <br />
                                        Members</h3>
                                </div>

                            </div>

                            {
                                data.slice(4,11).map(idx => (
                                    <div key={idx.id} className="col-xl-3 col-md-6">
                                        <div className="team-box">
                                            <div className="image">
                                                <Link to="/team">
                                                    <img src={idx.img} alt="Cyfonii" />
                                                </Link>

                                                <ul className="list-social">
                                                    <li><Link to="#">
                                                        <span className="icon-facebook"></span>   
                                                    </Link></li>
                                                    <li><Link to="#">
                                                        <span className="icon-twiter"></span>
                                                    </Link></li>
                                                    <li><Link to="#">
                                                        <span className="icon-plan"></span>
                                                    </Link></li>
                                                </ul>
                                            </div>
                                            <div className="content">
                                                <Link to="/team" className="h5 name">{idx.name}</Link>
                                                <p className="postion">
                                                 {idx.position}
                                                </p>

                                                
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

export default Team2;