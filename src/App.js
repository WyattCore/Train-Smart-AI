import Header from './header.jsx';
import Home from './Home.jsx';
import Plans from './Plans.jsx';
import About from './About.jsx';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionForm from './QuestionForm.jsx';
import PLAN_DETAILS from './Plan_details.jsx';


function App(){
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App
