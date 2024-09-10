import React , {useState} from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap-accordion';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

Faqs.propTypes = {
    data: PropTypes.array
};

function Faqs(props) {

    const {data} =props;

    const [dataBlock] = useState(
        {
            subheading: 'FAQs',
            heading: 'Frequently Aksed Questions',
            desc1: 'Below is a list of frequently asked questions and answers from partners and 3D artist',
            desc2:'Please check this FAQ first before contacting us.'
            
        }
    )

    const [dataTab] = useState([
        {
            id: 1,
            title: 'Cryptocurrency',
        },
        {
            id: 2,
            title: 'NFT Token',
        },
        {
            id: 3,
            title: 'Collection',
        },
        {
            id: 4,
            title: 'Crypto Trading',
        },

    ]);

    return (
        <section className="faq">
            <div className="shape right"></div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="block-text center" data-aos="fade-down" data-aos-duration="3000">
                            <h6 className="sub-heading"><span>{dataBlock.subheading}</span></h6>
                            <h3 className="heading">{dataBlock.heading}</h3>
                                <p className="mb-17">{dataBlock.desc1}</p>
                                <p>{dataBlock.desc2}</p> 
                        </div>

                        <div className="faq__main flat-tabs">

                        <Tabs>
                            <TabList className='menu-tab'>
                                {
                                    dataTab.map(idx => (
                                        <Tab className='fs-14 h6' key={idx.id}>{idx.title}</Tab>
                                    ))
                                }
                                
                            </TabList>

                                {
                                        dataTab.map(idx => (
                                            <TabPanel key={idx.id} className='content-tab'>
                                                <div className="content-inner">
                                                    <div className="flat-accordion row">
                                                        <div className="col-md-6 col-sm-12">
                                                        {
                                                            data.slice(0,4).map(idx => (
                                                                <Accordion show={idx.show} key={idx.id} title={idx.title} className='flat-toggle h6'>
                                                                    <p className="toggle-content">{idx.text} </p>
                                                                </Accordion>
                                                            ))
                                                        }

                                                        </div>

                                                        <div className="col-md-6 col-sm-12">
                                                        {
                                                            data.slice(4,8).map(idx => (
                                                                <Accordion show={idx.show} key={idx.id} title={idx.title} className='flat-toggle h6'>
                                                                    <p className="toggle-content">{idx.text} </p>
                                                                </Accordion>
                                                            ))
                                                        }
                                                        </div>
                                                        
                        
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        ))
                                    }


                                
                            </Tabs> 
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Faqs;