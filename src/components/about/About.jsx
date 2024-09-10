import React , {useState} from 'react';

import img1 from '../../assets/images/layouts/about-01.png'
import img2 from '../../assets/images/layouts/about-02.png'
import img3 from '../../assets/images/layouts/about-03.png'
import img4 from '../../assets/images/layouts/about-04.png'
import img5 from '../../assets/images/layouts/about-05.png'
import Button from '../button/Button';



function About(props) {

    const [dataImg] = useState([
        {
            id: 1,
            img : img1,
            class: 'img1'
        },
        {
            id: 2,
            img : img2,
            class: 'img2'
        },
        {
            id: 3,
            img : img3,
            class: 'img3'
        },
        {
            id: 4,
            img : img4,
            class: 'img4'
        },
        {
            id: 5,
            img : img5,
            class: 'img5'
        },
    ])

    const [dataBlock] = useState(
        {
            subheading: 'About us',
            heading: 'Welcome!',
            desc1: 'I’m an Information Technology undergraduate at the University of Jaffna, Sri Lanka, with expertise in UI/UX design, web development, graphic design, Flutter app development, and project leadership. I’m passionate about blending creativity with functionality to craft engaging digital experiences.' ,
            desc2 :'I’m committed to contributing to the tech community through collaboration, knowledge sharing, and innovative projects. Let’s connect and create something extraordinary together!'

        }
    )
    return (
        <section className="about">
                <div className="shape"></div>
                <div className="container">
                    <div className="row rev">
                        <div className="col-xl-6 col-md-12">
                            <div className="about__right">
                                <div className="images">
                                    {
                                        dataImg.map(idx => (
                                            <img key={idx.id} className={idx.class} src={idx.img} alt="cyfonii" />
                                        ))
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="block-text" >
                                <h6 className="sub-heading"><span>{dataBlock.subheading}</span></h6>
                                <h3 className="heading">{dataBlock.heading}</h3>
                                    <p className="mb-17">{dataBlock.desc1}</p>
                                    <p className="mb-26">{dataBlock.desc2}</p>
                                    <Button link='/about' title='More About Us' />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default About;