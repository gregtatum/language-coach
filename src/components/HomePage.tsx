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
          Translating text is a great way to learn a new language because it
          helps you build your vocabulary and grammar skills. By translating
          text, you get exposure to different sentence structures, idiomatic
          expressions, and cultural nuances, which can improve your
          comprehension and communication abilities.
        </p>
        <div className="homepageButtons">
          <Router.Link to="/translation" className="homepageButton">
            Start Translating
          </Router.Link>
        </div>
      </div>
    </div>
  );
}
