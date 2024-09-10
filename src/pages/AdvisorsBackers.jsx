import React from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import Faqs from '../components/faqs/Faqs';
import dataFaqs from '../assets/fake-data/data-faq';
import Footer from '../components/footer/Footer';
import Partner from '../components/partner/Partner';

import data from '../assets/fake-data/dataTeam'
import { Link } from 'react-router-dom';


function AdvisorsBackers(props) {
    return (
        <div className='page-advisor wrapper'>

            <PageTitle title='Advisors & Backers' />

            <section className="team s2">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="block-text center">
                            
                                <h3 className="heading">Advisors
                                </h3>
                            </div>

                        </div>

                        {
                            data.map(idx => (
                                <div key={idx.id} className="col-xl-3 col-md-6">
                                    <div className="team-box">
                                        <div className="image">
                                            <Link to="/team"><img src={idx.img} alt="Cyfonii" /></Link>

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

                        <Partner />



                        

                    </div>

                
                </div>
            </section>

            

            <Faqs data={dataFaqs} />

            <Footer />
            
        </div>
    );
}

export default AdvisorsBackers;