import { useState, useEffect } from "react";
import './index.css';
import './App.css';

import { collection, getDocs, addDoc } from "firebase/firestore";
import {db} from './firebase-config';


function TaskForm({taskAddAction}){
  
  return(
      <form onSubmit={taskAddAction}>
          <h2>Add a Task</h2>
          <fieldset>
              <label htmlFor="tName">Task Name:</label>
              &nbsp;<input id="tName" name="tName" type="text" required />
          </fieldset>
          <fieldset>
              <label htmlFor="tDesc">Task Description:</label>
              &nbsp;<input id="tDesc" name="tDesc" type="text" required />
          </fieldset>
          <input type="submit" />
      </form>
  )
}
function Task({arrPos, tName, tDesc, tDone, delOnClick, onClick}){
  return (
    <li key={arrPos}>
      <input type="checkbox" checked={tDone} onChange={onClick}/>
      {tName}: {tDesc}
      &nbsp;<button onClick={delOnClick}>Delete Task</button>
    </li>
  )
}
function TaskList({tasks, delOnClick, onClick}){
  console.log("inside of the taskList");
  console.log(tasks);
  console.log(typeof(tasks));
  return (
      <ul>
        {tasks.map((task, index) => {
          return (
          <Task
          arrPos={index} 
          tName={task.taskName} 
          tDesc={task.taskDesc} 
          tDone={task.completed} 
          delOnClick={() => delOnClick(index)} 
          onClick={() => onClick(index)} 
          />
        )})
        }
      </ul>
  )
}
function App(){
  const [data, setData] = useState([]);
  const [todosLoaded, setTodosLoaded] = useState(false);
  const [todos, setTodos] = useState([]);

    const fetchPost = async () => {
    
        await getDocs(collection(db, "hooks-tasks"))
            .then((querySnapshot)=>{   
                const newData = querySnapshot.docs
                    //.map((doc) => ({...doc.data(), id:doc.id }));
                    .map((doc) => ({...doc.data() }));
                setTodos(newData);                
                console.log(todos, newData);
                //
                console.log(newData);
                setData(newData);
                setTodosLoaded(true);
            })
    }
    useEffect(()=>{
        fetchPost();
    }, [])

  const addTask = async(e) => {
    e.preventDefault();
    let formSource = new FormData(e.target);
    let newTask = {taskName:formSource.get("tName"), taskDesc:formSource.get("tDesc"), completed:false};
    //
    try {
      const docRef = await addDoc(collection(db, "hooks-tasks"), 
        newTask   
      );
      console.log("Document written with ID: ", docRef.id);
      let taskList = [...data, {taskName:formSource.get("tName"), taskDesc:formSource.get("tDesc"), completed:false}];
    setData(taskList); 
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    //
    e.target.reset();
}

  function checkForCompletion(){
    if(data.length>0){
        let allDone = data.every(task => task.completed===true);
        if(allDone){
            return `You're all done!`
        }
        return `More to do!`;
    }
    return 'No tasks listed!';
}
  //makes a copy of the tasks, swaps the completed status of the task clicked, then saves out the tasks
  function toggleCompletion(i){
    console.log("about to toggle");
    let newTasks = [...data];
    console.log(newTasks);
    newTasks[i].completed = !newTasks[i].completed;
    console.log(newTasks[i]);
    console.log(newTasks);
    setData(newTasks);
  };
  function removeElement(i){
    let newTasks = [...data];
    newTasks.splice(i,1);
    setData(newTasks);
}

  return (
    <>
      {todosLoaded ?(
        <div id="app_home">
          <h1>Get Stuff Done</h1>
          <TaskForm taskAddAction={(e) => addTask(e)}/>
          <p>{checkForCompletion()}</p>
          <TaskList  tasks={data} delOnClick={(i)=> removeElement(i)} onClick={(i)=> toggleCompletion(i)}/>
        </div>
      ):(
        <p>no Data yet</p>
      )}
    </>
  );
}
export default App;
