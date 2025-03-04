import React from "react";

function About(){
    return(
        <div className="about_container">
            <h2>About</h2>
            <p>
                This is a side project I wanted to develop to show my familiarity with
                react, javascript, html, and css. In this project, I worked with accessing
                ChatGPT's API to tailor a unique and personal experience for the user. 
                </p>
                <p>A simple 
                demographic form is presented at the start, then the user is asked for their personal fitness goal.
                This information is then saved and fed to the ai, along with a prompt that tells the ai to 
                come up with questions for the user based off of their information. These questions are 
                presented to the user and when answered, the user is given a formatted personal plan. 
                </p>
                <p>This plan
                gives the user their goal, example workouts and a brief schedule, a nutrition guide, and some tips/motivation.
                The user then has the ability to save the workout, which saves their plan to a json file, where it can be accessed 
                again in the plans tab.
                </p>
                <p>Thank you for viewing!
            </p>

            
        </div>
        
    )
}

export default About;