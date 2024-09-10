import React from 'react';
import dataBox from '../assets/fake-data/data-box';
import dataFaqs from '../assets/fake-data/data-faq';
import dataPortfolio from '../assets/fake-data/data-portfolio';
import dataRoadMap from '../assets/fake-data/data-roadmap';
import dataTestimonials from '../assets/fake-data/data-testimonials';
import dataProject from '../assets/fake-data/dataProject';
import dataTeam from '../assets/fake-data/dataTeam';
import About from '../components/about/About';
import Banner from '../components/banner/Banner';
import Create from '../components/create/Create';
import Faqs from '../components/faqs/Faqs';
import Footer from '../components/footer/Footer';
import Portfolio from '../components/portfolio/Portfolio';
import Project from '../components/project/Project';
import Roadmap from '../components/roadmap/Roadmap';
import Speciality from '../components/speciality/Speciality';
import Team from '../components/team/Team';
import Testimonials from '../components/testimonials/Testimonials';



function Home01(props) {

    return (
        <div className="home-1 wrapper">
            
            <Banner />

            <About />

            <Speciality data={dataBox} />

            <Portfolio data={dataPortfolio} />

            <Project data={dataProject} />
           
            <Roadmap  data={dataRoadMap} />

            <Team data={dataTeam} />

            <Testimonials data={dataTestimonials} />

            <Faqs data={dataFaqs} />

            <Create />

            <Footer />
        </div>
        

    );
}

export default Home01;