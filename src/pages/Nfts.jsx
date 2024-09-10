import React from 'react';

import Footer from '../components/footer/Footer';
import PageTitle from '../components/pagetitle/PageTitle';

import Project3 from '../components/project/Project3';
import dataItem from '../assets/fake-data/data-item';



function Nfts(props) {
    return (
        <div className='wrapper'>

            <PageTitle title='NFTs' />

            <Project3 data={dataItem} />

            <Footer />
            
        </div>
    );
}

export default Nfts;