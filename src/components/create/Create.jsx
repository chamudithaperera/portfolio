import React , {useState} from 'react';
import Button from '../button/Button';

import img from '../../assets/images/layouts/create.png'



function Create(props) {

    
    const [dataBlock] = useState(
        {
            heading: 'Create your NFT portfolio',
            desc: 'Get udpated with news, tips & tricks',
            
        }
    )
    return (
        <section className="create">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="create__main">
                                <div className="content">
                                    <h4 className="heading">{dataBlock.heading}</h4>
                                    <p>{dataBlock.desc}</p>
                                    <Button title='Join Now' link='/contact' />
                                
                                </div>
                                <img src={img} alt="Cyfonii" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

export default Create;