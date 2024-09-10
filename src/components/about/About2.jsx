import React , {useState} from 'react';

import Button from '../button/Button';
import Partner from '../partner/Partner';

import img from '../../assets/images/layouts/about-06.png'


function About2(props) {

    const [dataBlock] = useState(
        {
            subheading: 'About us',
            heading: 'Hight Quality NFT Collections',

            desc1: 'Cyfonii is the premier marketplace for nifties, which are digital items you can truly own for yourself',
            desc2: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occae cat cupidatat non proident, sunt in culpa qui officia dese runt mollit anim id est laborum velit esse cillum dolore eu fugiat nulla pariatu epteur sint occaecat',
           
        }
    )
    return (
        <section className="about s2">
                    <div className="shape"></div>
                    <div className="shape right"></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="block-text center pd-0">
                                    <h6 className="sub-heading"><span>{dataBlock.subheading}</span></h6>
                                    <h3 className="heading pd">{dataBlock.heading}</h3>
                                        
                                </div>

                                <div className="about__main center" data-aos="fade-up" data-aos-duration="3000">
                                    <img src={img} alt="Cyfonii" />
                                    <p className="mb-17">{dataBlock.desc1}</p>
                                    <p className="mb-30">{dataBlock.desc2}</p>
                                    <Button title='More About Us' link='/about' />
                                </div>

                                <Partner />
                            </div>
                        </div>
                    </div>
                </section>
    );
}

export default About2;