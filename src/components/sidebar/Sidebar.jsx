import React , {useState} from 'react';

import { Link } from 'react-router-dom';

import data from '../../assets/fake-data/data-blog'

import logosm from '../../assets/images/logo/lolo-sm.png'


function Sidebar(props) {

    const [dataCat] = useState([
        {
            id: 1,
            title: 'Cryptocurrency',
            count: '18'
        },
        {
            id: 2,
            title: 'Block Chain ',
            count: '57'
        },
        {
            id: 3,
            title: 'Bit Coin',
            count: '5'
        },
        {
            id: 4,
            title: 'Eatherium',
            count: '9'
        },
        {
            id: 5,
            title: 'Buy Sale',
            count: '3'
        },
        {
            id: 6,
            title: 'Online Trading',
            count: '81'
        },
        {
            id: 7,
            title: 'Crypto Trade',
            count: '42'
        },

    ])
    const [dataTag] = useState([
        {
            id: 1,
            title: 'NFTs',
        },
        {
            id: 2,
            title: 'Blockchain',
        },
        {
            id: 3,
            title: 'Coin',
        },
        {
            id: 4,
            title: 'ICO',
        },
        {
            id: 5,
            title: 'cryptocurrency',
        },
        {
            id: 6,
            title: 'Ttoken',
        },
        {
            id: 7,
            title: 'Digital',
        },

    ])
    return (
        <div className="sidebar">
            <form action="#" className="widget-search">
                <input type="text" placeholder="Search item here..." required="" />
                <Link to='#' className="btn-search">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9.7659" cy="9.76639" r="8.98856" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                        <path d="M16.0176 16.4849L19.5416 19.9997" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </Link>
            </form>

            <div className="widget-sidebar category">
                <h5 className="heading">
                    Categories
                </h5>
                <ul>
                    {
                        dataCat.map(idx => (
                            <li key={idx.id}><Link to="">{idx.title} <span>({idx.count})</span></Link></li>
                        ))
                    }
                </ul>
            </div>
            <div className="widget-sidebar recent">
                <h5 className="heading">
                    Related Posts
                </h5>
                <ul>
                    {
                        data.map(idx => (
                            <li key={idx.id}>
                                <div className="image"><Link to="#"><img src={idx.img} alt="cyfonii" /></Link></div>

                                <div className="content">
                                    <div className="meta ">
                                        <Link to="/blog-details"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.9375 0.75V2.0625M9.0625 0.75V2.0625M0.75 9.9375V3.375C0.75 3.0269 0.888281 2.69306 1.13442 2.44692C1.38056 2.20078 1.7144 2.0625 2.0625 2.0625H9.9375C10.2856 2.0625 10.6194 2.20078 10.8656 2.44692C11.1117 2.69306 11.25 3.0269 11.25 3.375V9.9375M0.75 9.9375C0.75 10.2856 0.888281 10.6194 1.13442 10.8656C1.38056 11.1117 1.7144 11.25 2.0625 11.25H9.9375C10.2856 11.25 10.6194 11.1117 10.8656 10.8656C11.1117 10.6194 11.25 10.2856 11.25 9.9375M0.75 9.9375V5.5625C0.75 5.2144 0.888281 4.88056 1.13442 4.63442C1.38056 4.38828 1.7144 4.25 2.0625 4.25H9.9375C10.2856 4.25 10.6194 4.38828 10.8656 4.63442C11.1117 4.88056 11.25 5.2144 11.25 5.5625V9.9375" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        {idx.time}</Link>
                                    </div>
                                    <Link to="/blog-details" className="title">{idx.title}</Link>
                                </div>
                            </li>
                        ))
                    }


                </ul>
            </div>

            <div className="widget-sidebar widget-join">
                <img src={logosm} alt="cyfonii" />

                <h5>Buy, Create and Sell NFTs Files</h5>

                <Link to="#" className="action-btn"><span>Explore</span></Link>
            </div>
            <div className="widget-sidebar tag">
                <h5 className="heading">
                    Popular Tags
                </h5>
                <ul>
                    {
                        dataTag.map(idx => (
                            <li key={idx.id}><Link to="/blog-details">{idx.title}</Link></li>
                        ))
                    }

                </ul>
            </div>

        </div>
    );
}

export default Sidebar;