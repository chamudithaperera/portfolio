import React from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import About2 from '../components/about/About2';
import Counter from '../components/counter/Counter';
import Portfolio from '../components/portfolio/Portfolio';
import Team from '../components/team/Team';
import dataTeam from '../assets/fake-data/dataTeam';
import Footer from '../components/footer/Footer';
import dataPortfolio from '../assets/fake-data/data-portfolio';

import Button from '../components/button/Button';

import img from '../assets/images/layouts/create.png'



function About(props) {
    return (
        <div className='page-about wrapper'>

            <PageTitle title='About us' />

            <About2 />

            <Counter />  

            <Portfolio data={dataPortfolio} />

            <Team data={dataTeam} />

            <section className="create">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="create__main">
                                <div className="content">
                                    <h4 className="heading">Create your NFT portfolio</h4>
                                    <p>Get udpated with news, tips & tricks</p>
                                    <Button title='Join Now' link='/contact' />
                                
                                </div>
                                <img src={img} alt="Cyfonii" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            
        </div>
    );
}

export default About;