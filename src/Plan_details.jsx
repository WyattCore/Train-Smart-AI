import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Plan_Details(){
    const [loaded, set_loaded] = useState(false);
    const location = useLocation();
    const workout_plan = location.state?.workout;
    console.log("Workout in deits: ", workout_plan);

    useEffect(() => {
        if(workout_plan){
            set_loaded(true);
        }
    },[workout_plan]);

    function WORKOUT_SCHEDULE(){
        if(!loaded){return <p>Loading...</p>};
        const [...schedule] = workout_plan.workouts;

        return (
            <div className="plan_parts_workout">
                <h3>{"Workout Plan"}</h3>
                <ul>
                    {schedule.map((workout, index) => (
                        <li key={index}>{workout}</li>
                    ))}
                </ul>
            </div>
        );
    }

    function Nutrition(){
       if(!loaded){return <p>Loading...</p>};
        const[header, ...nutrition] = workout_plan.nutrition;
        console.log(header);

        return (
            <div className="plan_parts_nutrition">
                <h3>{"Nutrition Plans"}</h3>
                <ul>
                    {nutrition.map((nut, index) => (
                        <li key={index}>{nut}</li>
                    ))}
                </ul>
            </div>
        );

    }

    return(
        <>
        <div className="Workout-plan-container">
            <div className="Workout-plan-header">
                <h1>Your Plan!</h1>
                <h2>{ workout_plan.intro|| "Loading..."}</h2>
            </div>
            <div className="Workout-plan-instruct">
                <WORKOUT_SCHEDULE></WORKOUT_SCHEDULE>
                <Nutrition></Nutrition>
            </div>
            <div className="Workout-plan-close">
                <p>{workout_plan.tips || "Loading..."}</p>
            </div>
        </div>

        </>
    )
}

export default Plan_Details;