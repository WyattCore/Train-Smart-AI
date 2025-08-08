import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import robot_pic from "./images/logo.jpg";

function Home(){
    const navigate = useNavigate();
    const [start, set_start_plan] = useState(false)
    console.log(start)
    useEffect(() => {
        if (start){
            navigate("/questionform");
        }
    }, [start, navigate])

    return(
        <div className="home-container">
            <div className="home-intro">
                <h2>Transform your fitness journey with personalized AI-driven workout plans!</h2>
            </div>

            <div className="home-section">
                <img src={robot_pic} alt="Robot lifting weight" />
                <div id="words">
                    <h4>With Train Smart AI you have all the information you need to reach your fitness goals at your fingretips.</h4>
                    <h4>Answer easy questions personalized to you to get your own fitness plan within minutes!</h4>
                    <h4>You now have the ability to save and  access to each generated plan.</h4>
                </div>
                
            </div>
            
            <div className="home-section">
                <div id="included-header">
                <h3>Included in every plan:</h3>
                </div>
                
                <ul>
                    <li>Your goal</li>
                    <li>A brief workout schedule with sample workouts</li>
                    <li>A nutrition guide</li>
                    <li>General tips for your success</li>
                    <li>A rough estimate on for expected results</li>
                </ul>
            </div>
            <div id="click-here">
                <h3 >Click below to start your personal fitness plan</h3>
            </div>
            <button onClick={() => set_start_plan(true)}>Start Plan</button>
            <p>To see more information about this project, see the "About" tab in the above nav bar.</p>
            
        </div>
        
    )
}

export default Home;