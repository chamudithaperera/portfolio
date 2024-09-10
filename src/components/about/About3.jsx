import React , {useState} from 'react';


import Button from '../button/Button';

import img1 from '../../assets/images/layouts/banner-04.png'
import img2 from '../../assets/images/layouts/banner-05.png'

import avt from '../../assets/images/layouts/avt-05.png'






function About3(props) {

    const [dataBlock] = useState(
        {
            subheading: 'About us',
            heading: 'Hight Quality NFT Collections',
            desc1: 'Cyfonii is the premier marketplace for nifties, which are digital items you can truly own for yourself' ,
            desc2: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occae cat cupidatat non proident, sunt in culpa qui officia dese runt mollit anim id est laborum velit esse cillum dolore eu fugiat nulla pariatu epteur sint occaecat'
            
        }
    )
    const [dataCard] = useState(
        [
            {
                id: 1, 
                img: img1,
                title: '3D Digital Artwork',
                price : '2.26 ETH',
                avt: avt,
                name: 'Leslie Alexander',
                tag: '@leslie754'
            },
            {
                id: 2, 
                img: img2,
                title: '3D Digital Artwork',
                price : '2.26 ETH',
                avt: avt,
                name: 'Leslie Alexander',
                tag: '@leslie754',
                class: 'sm'
            },
        ]
    )
    return (
        <section className="about s3">
            <div className="shape"></div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-md-12">
                        <div className="block-text pd-0">
                            <h6 className="sub-heading"><span>{dataBlock.subheading}</span></h6>
                            <h3 className="heading">{dataBlock.heading}</h3>
                                <p className="mb-17">{dataBlock.desc1}</p>
                                <p className="mb-26">{dataBlock.desc2}</p>
                                <Button title='More About Us' link='/about' />
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-12">
                        <div className="about__right" data-aos="fade-left" data-aos-duration="2000">

                            {
                                dataCard.map(idx => (
                                    <div key={idx.id} className={`card-box ${idx.class}`}>
                                        <div className="top d-flex">
                                            <span className="icon-logo-01"></span>
                                            <div>
                                                <h6>{idx.title}</h6>
                                                <h6 className="price">{idx.price}</h6>
                                            </div>
                                        </div>
                                        <div className="content">
                                            <div className="image">
                                                <img src={idx.img} alt="Cyfonii" />
                                            </div>

                                            <div className="info d-flex">
                                                <img src={idx.avt} alt="Cyfonii" />

                                                <div >
                                                    <h6 className="name">{idx.name}</h6>
                                                    <p>{idx.tag}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}

export default About3;