import React from 'react';

import PageTitle from '../components/pagetitle/PageTitle';
import Footer from '../components/footer/Footer';
import BlogList from '../components/blog/BlogList';
import dataBlog from '../assets/fake-data/data-blog';




function Blog(props) {
    return (
        <div className='wrapper'>

            <PageTitle title='Blog List' />

            <BlogList data={dataBlog} />

            <Footer />
            
        </div>
    );
}

export default Blog;