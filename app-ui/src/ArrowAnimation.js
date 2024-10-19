import React from 'react';
import './App/App.css';

function ArrowAnimation({ handleClick }) {

    return (
        <div className="arrow-container" onClick={handleClick}>
            <div className="arrow"></div>
            <div className="pause-lines">
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </div>
    );
}

export default ArrowAnimation;
