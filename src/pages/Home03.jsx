import React from 'react';

import Project from '../components/project/Project';
import dataProject from '../assets/fake-data/dataProject';
import Roadmap2 from '../components/roadmap/Roadmap2';
import dataTeam from '../assets/fake-data/dataTeam';
import Testimonials from '../components/testimonials/Testimonials';
import Faq3 from '../components/faqs/Faq3';
import dataFaqs from '../assets/fake-data/data-faq';
import Banner3 from '../components/banner/Banner3';
import About3 from '../components/about/About3';
import Token from '../components/token/Token';
import dataRoadMap from '../assets/fake-data/data-roadmap';
import Team2 from '../components/team/Team2';
import Speciality from '../components/speciality/Speciality';
import dataBox from '../assets/fake-data/data-box';
import dataTestimonials from '../assets/fake-data/data-testimonials';
import Counter from '../components/counter/Counter';
import Blog from '../components/blog/Blog';
import dataBlog from '../assets/fake-data/data-blog';
import Footer from '../components/footer/Footer';


function Home03(props) {
    return (
        <div className='home-3 wrapper'>
          
        <Banner3 />

        <About3 />

        <Token />

        <Project data={dataProject} />

        <Roadmap2 data={dataRoadMap} />


        <Team2 data={dataTeam} />

        <Speciality data={dataBox} />

        <Testimonials data={dataTestimonials} />

        <Counter />  

        <Blog data={dataBlog} />

        <Faq3 data={dataFaqs} />


        <Footer />

        </div>
    );
}

export default Home03;