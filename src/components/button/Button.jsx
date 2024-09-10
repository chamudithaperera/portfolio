import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

Button.propTypes = {
    link: PropTypes.string,
    title: PropTypes.string,
};

function Button(props) {

    const {link , title} = props;
    return (
        <Link to={link} className="action-btn"><span>{title}</span></Link>
    );
}

export default Button;