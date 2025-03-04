import { useEffect, useState } from "react";
import { Routes, Route, Link} from "react-router-dom";
import React from "react";
import axios from 'axios';
import PLAN_DETAILS from "./Plan_details";


function Plans(){
    const [workout_plans, set_workout_plans] = useState([]);
    // const [step, set_step] = useState(1);
    // const [last_response, set_last_response] = useState(null);

    useEffect(() => {
        window.scrollTo(0,0);
        fetch_saved_plans();

    }, []);

    const fetch_saved_plans = async() =>{
        try {
            const response = await axios.get('https://train-smart-ai-api.onrender.com/get');
            set_workout_plans(response.data);
            
        } catch (error) {
            console.error("Error fetching workout plans:", error);
        }
    };

    function SAVED_PLANS() {
        if(workout_plans == null){
            return <div>Loading....</div>
        }else{
            return(
                <>
                <div className="plan-format">
                    <ul>
                        {workout_plans.map((workout, index) => (
                            <li key={index}>
                                <Link to={`/plan_details/${index}`} state={{ workout }}>
                                <u>
                                    {workout.intro}
                                </u>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>  
                
                </>
            ); 
            }
        }

        

        return(
            <>
            <div className="saved_plans_container">
                <h2>Welcome to your Saved Plans!</h2>
                <SAVED_PLANS/>
                <Routes>
                    <Route path="/plan_details/:id" element={<PLAN_DETAILS />} />
                </Routes>
            </div>
            </>
        )
    

        
}

export default Plans;