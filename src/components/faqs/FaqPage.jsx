import React , {useState} from 'react';

import { Accordion } from 'react-bootstrap-accordion';
import { Link } from 'react-router-dom';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';



function FaqPage(props) {
    const {data} = props;

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
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="block-text center">
                                <h6 className="sub-heading"><span>FAQs</span></h6>
                                <h3 className="heading">We Hope You Find What You
                                    <br />
                                    are Looking for</h3>
                                    <p className="mb-17">Below is a list of frequently asked questions and answers from partners and 3D artist</p>
                                    <p>Please check this FAQ first before contacting us.</p>

                                    <form action="#" className="widget-search">
                                        <input type="text" placeholder="Search..." required="" />
                                        <Link to='#' className="btn-search">
                                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="9.7659" cy="9.76639" r="8.98856" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                                                <path d="M16.0176 16.4849L19.5416 19.9997" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                        </Link>
                                    </form>
                                    
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

export default FaqPage;