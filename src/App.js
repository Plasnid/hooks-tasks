import { useState, useEffect } from "react";
import './index.css';
import './App.css';

import { collection, 
  query, addDoc, updateDoc, Timestamp, doc, deleteDoc, onSnapshot } from "firebase/firestore";
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
function Task({ arrPos, tName, tDesc, tDone, delOnClick, onClick}){
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
          key={index}
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
    
    useEffect(() => {
      const taskColRef = query(collection(db, 'hooks-tasks'))
      onSnapshot(taskColRef, (snapshot) => {
        setData(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))
        setTodosLoaded(true);
      })
    },[])
  

  const addTask = async(e) => {
    e.preventDefault();
    let formSource = new FormData(e.target);
    let newTask = {taskName:formSource.get("tName"), taskDesc:formSource.get("tDesc"), completed:false,created: Timestamp.now()};
    //
    try {
      const docRef = await addDoc(collection(db, "hooks-tasks"), 
        newTask   
      );
      console.log("Document written with ID: ", docRef.id);
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
  const toggleCompletion = async (i )=> {
    const taskDocRef = doc(db, 'hooks-tasks', data[i].id)
    console.log(data[i].completed);
    console.log(taskDocRef);
    try{
      await updateDoc(taskDocRef, {
        completed: !data[i].completed
      })
      console.log("data update sent");
    } catch (err) {
      alert(err)
    }
  };
  const removeElement = async(i )=>{
    //
    const taskDocRef = doc(db, 'hooks-tasks', data[i].id)
    deleteDoc(taskDocRef)
    .then(() => {
      console.log("Entire Document has been deleted successfully.")
    })
    .catch(error => {
      console.log(error);
    })
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