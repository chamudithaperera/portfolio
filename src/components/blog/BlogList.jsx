import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

BlogList.propTypes = {
    data:PropTypes.array
};

function BlogList(props) {

    const {data} = props;
    return (
        <section className="bloglist">
                <div className="container">
                    <div className="row">
                        <div className="bloglist__main">
                            <div className="list">
                                {
                                    data.map(idx => (
                                        <div key={idx.id} className="blog-box-2">
                                            <div className="image">
                                                <Link to="/blog-details">
                                                    <img src={idx.img} alt="cyfonii" />
                                                </Link>
                                            </div>

                                            <div className="content">
                                                <div className="meta ">
                                                    <Link to="/blog-details"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.9375 0.75V2.0625M9.0625 0.75V2.0625M0.75 9.9375V3.375C0.75 3.0269 0.888281 2.69306 1.13442 2.44692C1.38056 2.20078 1.7144 2.0625 2.0625 2.0625H9.9375C10.2856 2.0625 10.6194 2.20078 10.8656 2.44692C11.1117 2.69306 11.25 3.0269 11.25 3.375V9.9375M0.75 9.9375C0.75 10.2856 0.888281 10.6194 1.13442 10.8656C1.38056 11.1117 1.7144 11.25 2.0625 11.25H9.9375C10.2856 11.25 10.6194 11.1117 10.8656 10.8656C11.1117 10.6194 11.25 10.2856 11.25 9.9375M0.75 9.9375V5.5625C0.75 5.2144 0.888281 4.88056 1.13442 4.63442C1.38056 4.38828 1.7144 4.25 2.0625 4.25H9.9375C10.2856 4.25 10.6194 4.38828 10.8656 4.63442C11.1117 4.88056 11.25 5.2144 11.25 5.5625V9.9375" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        {idx.time}</Link>
                                                </div>
                                                <Link to="/blog-details" className="title">{idx.title}</Link>
                                                <p className="text">{idx.text}</p>
                                            </div>
                                        </div>
                                    ))
                                }


                                <div className="pagination">
                                    <ul>
                                        <li><Link to="">
                                            <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.1212 7.46543L7.56346 13.8092C7.8205 14.0662 8.23613 14.0662 8.49317 13.8092L8.88144 13.4209C9.13848 13.1639 9.13848 12.7482 8.88144 12.4912L3.2869 7.00059L8.87598 1.50997C9.133 1.25293 9.133 0.837303 8.87598 0.580281L8.48769 0.191991C8.23067 -0.0650311 7.81504 -0.0650311 7.558 0.191991L1.11578 6.53574C0.864303 6.79278 0.864302 7.20841 1.1212 7.46543Z" fill="white" fillOpacity="0.5"/>
                                                </svg>
                                                
                                        </Link></li>
                                        <li><Link to="">1</Link></li>
                                        <li><Link to="">2</Link></li>
                                        <li><Link to="">3</Link></li>
                                        <li><Link to="">
                                            <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.8788 7.46543L2.43654 13.8092C2.1795 14.0662 1.76387 14.0662 1.50683 13.8092L1.11856 13.4209C0.861521 13.1639 0.861521 12.7482 1.11856 12.4912L6.7131 7.00059L1.12402 1.50997C0.866998 1.25293 0.866998 0.837303 1.12402 0.580281L1.51231 0.191991C1.76933 -0.0650311 2.18496 -0.0650311 2.442 0.191991L8.88422 6.53574C9.1357 6.79278 9.1357 7.20841 8.8788 7.46543Z" fill="white" fillOpacity="0.5"/>
                                            </svg>
                                        </Link></li>
                                    </ul>
                                </div>
                            </div>

                            <Sidebar />
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default BlogList;