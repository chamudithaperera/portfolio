import React from 'react';
import dataBlog from '../assets/fake-data/data-blog';
import dataCard from '../assets/fake-data/data-card';
import dataFaqs from '../assets/fake-data/data-faq';
import dataItem from '../assets/fake-data/data-item';
import dataRoadMap from '../assets/fake-data/data-roadmap';
import dataTestimonials2 from '../assets/fake-data/data-testimonials2';
import dataTeam from '../assets/fake-data/dataTeam';
import About2 from '../components/about/About2';
import Banner2 from '../components/banner/Banner2';
import Blog from '../components/blog/Blog';
import Counter from '../components/counter/Counter';
import Faqs from '../components/faqs/Faqs';
import Footer2 from '../components/footer/Footer2';
import Project2 from '../components/project/Project2';
import Roadmap2 from '../components/roadmap/Roadmap2';
import Team2 from '../components/team/Team2';
import Testimonials2 from '../components/testimonials/Testimonials2';



function Home02(props) {
    

    return (
        <div className='home-2 wrapper'>
                <Banner2 data={dataCard} />

                <About2 />

                <Counter />  

                <Project2 data={dataItem} /> 

                <Roadmap2 data={dataRoadMap} />

                <Team2 data={dataTeam} />

                <Testimonials2 data={dataTestimonials2} />

                <Faqs data={dataFaqs} />

                <Blog data={dataBlog} />


                <Footer2 />
        </div>
    );
}

export default Home02;