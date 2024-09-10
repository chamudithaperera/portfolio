import React from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import Footer from '../components/footer/Footer';

import Team2 from '../components/team/Team2';
import dataTeam from '../assets/fake-data/dataTeam';
import Create from '../components/create/Create';



function Team(props) {
    return (
        <div className='page-team wrapper'>

            <PageTitle title='Our Team' />

            <Team2 data={dataTeam} />

            <Create />

            <Footer />
            
        </div>
    );
}

export default Team;