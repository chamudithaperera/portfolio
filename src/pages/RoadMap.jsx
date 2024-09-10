import React from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import Project2 from '../components/project/Project2';
import Faq3 from '../components/faqs/Faq3';
import dataFaqs from '../assets/fake-data/data-faq';
import Footer from '../components/footer/Footer';
import dataRoadMap from '../assets/fake-data/data-roadmap';
import dataItem from '../assets/fake-data/data-item';
import Roadmap from '../components/roadmap/Roadmap';

function RoadMap(props) {
    return (
        <div className='page-roadmap wrapper'>

        <PageTitle title='Road Map' />

        <Roadmap  data={dataRoadMap} />

        <Project2 data={dataItem} /> 

        <Faq3 data={dataFaqs} />
        <Footer />
            
        </div>
    );
}

export default RoadMap;