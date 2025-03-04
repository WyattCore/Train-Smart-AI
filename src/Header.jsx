import { Link } from "react-router-dom";


function Header(){
    return(
        <header>
            <div className="Logo">
            <h2>Train Smart AI</h2>
            </div>
            
            <nav className="navBar">
                <li className="navElements"><Link to="/">Home</Link></li>
                <li className="navElements"><Link to="/questionform">Build Your Plan</Link></li>
                <li className="navElements"><Link to="/plans">Plans</Link></li>
                <li className="navElements"><Link to="/about">About</Link></li>
            </nav>
        </header>
    );
}

export default Header