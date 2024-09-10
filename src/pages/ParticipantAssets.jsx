import React , {useState} from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import Faqs from '../components/faqs/Faqs';
import Footer from '../components/footer/Footer';
import dataFaqs from '../assets/fake-data/data-faq';

import img from '../assets/images/layouts/map.png'
import img1 from '../assets/images/layouts/par-01.png'
import img2 from '../assets/images/layouts/par-02.png'
import img3 from '../assets/images/layouts/par-03.png'
import { Link } from 'react-router-dom';

function ParticipantAssets(props) {

    const [data] = useState([
        {
            id: 1,
            img: img1,
        },
        {
            id: 2,
            img: img2,
        },
        {
            id: 3,
            img: img3,
        }
    ])
    return (
        <div className='wrapper'>

            <PageTitle title='Participants & Assets' />

            <section className="participants">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="block-text center">
                                <h3 className="heading">Participants </h3>
                            </div>

                        </div>

                        {
                            data.map(idx => (
                                <div key={idx.id} className="col-md-4">
                                    <div className="blog-box">
                                        <div className="image">
                                            <Link to="#"><img src={idx.img} alt="Cyfonii" /></Link>
                                        </div>

                                    </div>
                                </div>
                            ))
                        }


                        <div className="col-12">
                            <div className="par-bot center">
                                <p className="mb-17">In BIZVERSE, there are users with equal roles in a common community, depending on the token ownership process and user's investment decision, it will determine the activities and rights that the user is allowed.</p>
                                <p className="mb-28">All members in system can choose for themselves a 3D Avatar with many styles, skin colors, shapes, hair, clothes, shoes, glasses, hats... according to their preferences as soon as they join Bizverse and it is also a vrNFT asset class.</p>
                                <Link to="#" className="action-btn"><span>
                                    Join us</span></Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="assets">
            <div className="shape"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="block-text center">
                                <h3 className="heading">Assets</h3>
                                <p>In the world of BIZVERSE, users are allowed to be creative, the system will allow users to participate in creating their own digital assets in the form of non-fungible tokens NFT. These NFTs will then be exchanged, transferred at Marketplace or at their own showroom in shopping centers. At that time, even players can easily make profits from the NFT they have created.</p>
                            </div>

                            <div className="assets__main center">
                                <h5>Assets (NFTs) tree</h5>
                                <img src={img} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Faqs data={dataFaqs} />

            <Footer />
            
        </div>
    );
}

export default ParticipantAssets;