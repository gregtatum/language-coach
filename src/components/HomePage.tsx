import * as React from 'react';
import * as Router from 'react-router-dom';

import './HomePage.css';

// https://webflow.com/templates/html/apps-app-website-template
export function HomePage() {
  return (
    <div className="AppFull">
      <div className="homepage">
        <h1 className="homepageHeader">Language Coach</h1>
        <p className="homepageParagraph">
          Use the Language Coach tools to help learn another language. Right now
          you can generate a study list with the &ldquo;Most Used Words&rdquo;
          tool. More tools are coming soon, like a translation coach.
          <br />
          <br />
          Select your language at top right.
        </p>
        <div className="homepageButtons">
          <Router.Link to="/most-used" className="homepageButton">
            Get Started
          </Router.Link>
        </div>
      </div>
    </div>
  );
}
