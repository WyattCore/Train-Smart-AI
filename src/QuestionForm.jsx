import axios from "axios";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function QuestionForm() {
    const [step, setStep] = useState(1);
    console.log("Initial step: ", step)
    const [is_loading, set_is_loading] = useState(false);
    const [demographic_answers, setAnswers] = useState({});
    const [case_3_answers, set_case_3_answers] = useState({});
    const [backend_data, set_backend_data] = useState([{}]);//
    const [input_value, set_input_value] = useState("");
    const [question_list, set_question_list] = useState([]);
    const [temp_response, set_temp_response] = useState("");
    const [sections, set_sections] = useState([]);
    const final_ai_prompt = useRef("");
    const [chat_response, set_chat_response] = useState("");
    const [next, set_next] = useState(false)
    const [workouts, set_workouts] = useState([]);
    const [nutrition, set_nutrition] = useState([]);
    const [tips, set_tips] = useState([]);
    const [plan_count, set_plan_count] = useState(0);
    const navigate = useNavigate();
    const final_ai_prompt_dirty = {...demographic_answers, ...case_3_answers}
    
    const prevStep = () => {
        setAnswers({});
        setStep(step -1);
    }

    const format_plan = useCallback(() => {
        console.log("Chat from format : ", chat_response)
        if(sections === ""){
            const temp_sections = chat_response
            .split(/(?:\s?\d\.\s?)/)
            .filter(part => part.trim() !== "");
            console.log(temp_sections);
            set_sections(temp_sections);
        }
    }, [chat_response, sections]);

    const format_sections = useCallback(() => {
        console.log("Pre setting sections: ", sections)
        set_workouts(sections[1].split('\n'));
        set_nutrition(sections[2].split('\n'));
        set_tips(sections[3].split('\n'));
    }, [sections]);


    useEffect(() => {
        if (step === 2) {
            if(chat_response !== ""){
                set_temp_response(chat_response)
                set_question_list(chat_response.split("/"));
                setStep(step + 1);
            }
        }
        
        if (step === 3 && chat_response !== temp_response){
            console.log("Demographic: ", demographic_answers);
            console.log("Case 3: ", case_3_answers);
            format_plan();
        }

        if(next && sections !== ""){
            console.log("Sections: ", sections)
            format_sections();
            set_next(false)
            setStep(step + 1);
        }
        
        
    },[step, chat_response, sections, next, temp_response, demographic_answers, case_3_answers, format_plan, format_sections]); 
    

    const handle_ai_submit = async (e) =>{
        set_is_loading(true);
        e.preventDefault();
            const temp_ai_input = 
            "This is a fitness someone's fitness goal: " 
            +input_value + 
            ". Come up with a some questions, that will help an ai come up with a workout/nutrition plan for this person. Minimum questions 8, maximum questions 10. Make sure the questions numbered are separated by a '/'. The form has already asked for Gender, Age, Height, Weight, so you don't need to ask that. HAVE EACH QUESTION SEPARATED BY A '/', so I can separate them later. But never put a '/' after the last question.";

        try{
            const response = await fetch("https://train-smart-ai-api.onrender.com/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({input: temp_ai_input}),
            });
            const response_in_json =  await response.json()
            console.log("Response: ", response_in_json);
            await fetch_chat_response();
        } catch (error){
            
            console.log("Error fetching AI response:", error);
            alert("Error Fetching API Response")
        } finally {
            set_is_loading(false);
            
            
        }            
      }

    const handle_case3_submit = async(e) => {

        console.log("Answers: ", Object.values(case_3_answers).length);
        console.log("Questions: ", question_list)
        if(Object.values(case_3_answers).length < question_list.length){
            alert("Please answer all of the questions before submitting.")
        }else{
            set_next(true);
            e.preventDefault();
            make_string();
            console.log("Final: " + final_ai_prompt.current)
            console.log("Ai input: " + input_value)
            const ai_input ="You are an app that gives people a day to day workout schedule based off of this set of question and answers, along with the user's fitness goal that I will provide you. In the workout plan" +
                        "Please give a schedule for exercises, types of exercises, and brief nutrition plan including macros and calorie goals to help the user achieve their goal. Here is what they said their goal is: " + input_value  + 
                        "Here is the format. There needs to be 4 numbered sections so I can parse the message. Each numbered section should be on a new line. The first part will be the users goal: (1. Your Goal: user's goal here)." +
                        "The second section will be a cycle of days including different exercises, each day should be numbered so I can parse the workouts= (Day 1: ....  Day 2:.... etc) The third section should be the nutrition plan= (Calorie Goal: Protein goal: Carb Goal: Fat goal: + some foods that fit in to the plan." +
                        "The 4th section will be any relevant tips and an encouraging message. In the 4th section if their goal is weight gain or weight loss related, include a time period that you could expect results in. Here is the relating information gathered= (Tips: ................ Motivation:...... )"
                        + final_ai_prompt.current;

            try{
                const response = await fetch("https://train-smart-ai-api.onrender.com/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({input: ai_input}),
                });
                const response_in_json =  await response.json()
                console.log("Response: ", response_in_json);
                await fetch_chat_response();

            } catch (error){
                console.log("Error fetching AI response:", error);
                alert("Error Fetching API Response.")
            }
    }        
    }

    const make_string = () => {
        const temp_dict ={}
        for(const [key, value] of Object.entries(final_ai_prompt_dirty)) {
            const cleanedKey = key.replace(/↵/g, "").trim();
            temp_dict[cleanedKey] = value;
        }
        const formatted_string = Object.entries(temp_dict)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        final_ai_prompt.current = formatted_string;
    }

   
    

    


    const fetch_chat_response = async () => {
        try{
            fetch("https://train-smart-ai-api.onrender.com/api").then(
            response => response.json()
            ).then(
            data => {
                set_backend_data(data);
                console.log("Data: ", backend_data);
                console.log("Response: ", data.response);
                set_chat_response(data.response);
                }
            )
        } catch (error) {
            console.error("Error fetching chat response:", error);
        }
      }

      const handle_input_change = (event) => {
        setAnswers({...demographic_answers, [event.target.name]: event.target.value});
    }

    const handle_change = (e) =>{
    set_input_value(e.target.value);
    }

    const handle_case3_input_change = (event) => {
    set_case_3_answers({...case_3_answers, [event.target.name]: event.target.value});
    }


    const submit = (e) => {
        e.preventDefault();
        const empty_fields = Object.keys(demographic_answers);
        console.log(empty_fields)
        if(empty_fields.length < 4){
            alert("You need to fill out all of the questions before advancing.");
        }else{
            setStep(step + 1);
        }
    }

    const save_plan = async() => {
        console.log("Workouts: ", workouts);
        console.log("Nutrtion: ", nutrition);
        console.log("Tips: ", tips);
        set_plan_count(plan_count + 1);
        const plan = {
            plan_num: plan_count + 1,
            intro: sections[0] , 
            workouts: workouts,
            nutrition: nutrition,
            tips: tips,
        }; 
        try {
            const response = await axios.post("https://train-smart-ai-api.onrender.com/saved", plan)
            alert(response.data.message);            
        }catch(error){
            console.error("Error saving workout plan: ", error);
        }
        navigate("/plans");
        window.location.reload();
    }

    function WORKOUT_SCHEDULE(){
        if(!workouts || workouts.length === 0){
            return <div>No Data</div>
        }
        const [...workout] = workouts;

        return (
            <div className="plan_parts_workout">
                <h3>{"Workout Plan"}</h3>
                <ul>
                    {workout.map((workout, index) => (
                        <li key={index}>{workout}</li>
                    ))}
                </ul>
            </div>
        );
    }


    function Nutrition(){
        if(!nutrition || nutrition.length === 0){
            return <div>No Data</div>
        }
        const[header, ...nutr] = nutrition;
        console.log(header);
        return (
            <div className="plan_parts_nutrition">
                <h3>{"Nutrition Plan"}</h3>
                <ul>
                    {nutr.map((nut, index) => (
                        <li key={index}>{nut}</li>
                    ))}
                </ul>
            </div>
        );

    }


    switch (step) {
        case 1:
            return (
                <form onSubmit={submit} className="Questionare">
                <div className="Questionare-header">
                    <h2>Demographics</h2>
                </div>
                    <h3>Gender</h3>
                <input
                    className='prompt_input_box'
                    name="Gender"
                    type='text'
                    onChange={handle_input_change}
                    placeholder='Enter Gender'
                ></input>
                <h3>Age</h3>
                <input
                    className='prompt_input_box'
                    name="Age"
                    type='text'
                    onChange={handle_input_change}
                    placeholder='Enter Age'
                ></input>
                <h3>Height</h3>
                <input
                    className='prompt_input_box'
                    name="Height"
                    type='text'
                    onChange={handle_input_change}
                    placeholder='Enter Height In Inches'
                ></input>
                <h3>Weight</h3>
                <input
                    className='prompt_input_box'
                    name="Weight"
                    type='text'
                    onChange={handle_input_change}
                    placeholder='Enter Weight In Pounds'
                ></input>
                <div className="Questionare-button">
                    <button className='prompt_submit_button' type='submit'>
                        Next
                    </button>
                </div>
                
                
        </form>
            );
        case 2:
            return(
                <>
                <div className="looks-good">
                    <h3 className="prompt_questions">That all looks good! In a sentence or 2 below, detail your main fitness goal.</h3>
                </div>
                <div className='user_prompts'>
                    <form onSubmit={(e) => handle_ai_submit(e, 2)}>
                    <textarea
                        className='prompt_input_box'
                        type='text'
                        value={input_value}
                        onChange={handle_change}
                        placeholder='Enter prompt'
                    >
                    </textarea> 
                    {!is_loading ? 
                    <div className="user_prompt_buttons">
                        <button className="prompt_submit_button" type="button" onClick={prevStep}>Previous</button>
                        <button className='prompt_submit_button' type='submit'>Submit</button>
                    </div> : <span className="loading"></span>}

                    </form>
                </div>
                </>
            );
        case 3:
            return(
                <>
                    <h2>Follow Up Questions</h2>
                {is_loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="Questionare">
                        {question_list.map((question) => {
                        return( 
                        <div>
                            <h3> {question} </h3>
                            <input type="text"
                            name={question} 
                            className="prompt_input_box" 
                            placeholder="Respond Here" 
                            onChange={handle_case3_input_change} />
                        </div>
                        )
                    })}
                    <button className="prompt_submit_button" onClick={handle_case3_submit}>Next</button>
                    </div>
                )}
                </>
            );
        case 4:
            return(
                <>
                <div className="Workout-plan-container">
                    <div className="Workout-plan-header">
                        <h1>Your Plan!</h1>
                        <h2>{sections[0] || "Loading..."}</h2>
                    </div>
                    <div className="Workout-plan-instruct">
                        <WORKOUT_SCHEDULE />
                        <Nutrition />
                    </div>
                    <div className="Workout-plan-close">
                        <p>{sections[3] || "Loading..."}</p>
                    </div>
                <button className="prompt_submit_button" onClick={save_plan}>Save Plan</button>
                
                </div>

                </>
            );
        default:
            return (
                <div>
                    <h1>Something went wrong</h1>
                </div>
            );
    }

}

export default QuestionForm
