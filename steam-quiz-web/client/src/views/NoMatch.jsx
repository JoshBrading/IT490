import React from "react";
import { Link } from "react-router-dom";

const NoMatch = () => {

    return (
        <div>
            <b>404 - Page Not Found</b>
            <div className="hover:text-blue-700">
                <Link to="/">Click here for our Login Page</Link>
            </div>
        </div>
    );
};

export default NoMatch;