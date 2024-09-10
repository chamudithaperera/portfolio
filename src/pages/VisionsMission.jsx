import React , {useState} from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import Counter from '../components/counter/Counter';
import Footer from '../components/footer/Footer';
import Faqs from '../components/faqs/Faqs';
import dataFaqs from '../assets/fake-data/data-faq';

import img1 from '../assets/images/layouts/about-01.png'
import img2 from '../assets/images/layouts/about-02.png'
import img3 from '../assets/images/layouts/about-03.png'
import img4 from '../assets/images/layouts/about-04.png'
import img5 from '../assets/images/layouts/about-05.png'



function VisionsMission(props) {

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
    return (
        <div className='page-visions wrapper'>

            <PageTitle title='Visions & Mission' />
            <section className="about">
                <div className="container">
                    <div className="row">
                        
                        <div className="col-xl-6 col-md-12">
                            <div className="block-text">
                                <h6 className="sub-heading"><span>Visions & Mission</span></h6>
                                <h3 className="heading wow" data-splitting>Our Vision</h3>
                                    <p className="mb-17">Cyfonii aims to build a virtual reality environment, a real metaverse for business activities, where all users can easily bring their business activities to the network environment, conduct the comprehensive digital transformation of business operations, increase outstanding efficiency with the maximum support of technologies.</p>
                            </div>
                            <div className="block-text">
                                <h6 className="sub-heading"><span>Visions & Mission</span></h6>
                                <h3 className="heading wow" data-splitting>Our Mission</h3>
                                    <p>Cyfonii is conceptualized almost like the development of the digital society and digital economy of the world according to the comprehensive digital transformation model (Digital Transformation) in the period of Industry 4.0 taking place very strongly all over the world starting from the digitization period (Digitization) to the goal of building a virtual super universe (Metaverse) is being shaped.</p>
                            </div>
                        </div>
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
                    </div>
                </div>
            </section>
            <Counter />  

            <Faqs data={dataFaqs} />


            <Footer />
        </div>
    );
}

export default VisionsMission;