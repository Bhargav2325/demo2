import React, { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";


const updateCounter = async (newCount) => {
    // Simulate a delay and a successful response
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          // Simulate a failure 20% of the time
          reject("Failed to update the counter");
        } else {
          resolve("Success");
        }
      }, 1000);
    });
  };

// Mock updateName function (replace with your actual API call)
// const updateName = async (name) => {
//   if (!name) return "Name cannot be empty"; 

//   return new Promise((resolve) => {
//     setTimeout(() => resolve(null), 1000);  
//   });
// };

// function UpdateName() {
//   const [name, setName] = useState("");
//   const [error, setError] = useState(null);
//   const [isPending, startTransition] = useTransition();
//   const navigate = useNavigate();

//   const handleSubmit = () => {
//     startTransition(async () => {
//       setError(null); 
//       const error = await updateName(name);
//       if (error) {
//         setError(error);
//         return;
//       } 
//       navigate("/path"); 
//     });
//   };

//   return (
//     <div>
//       <input
//         value={name}
//         onChange={(event) => setName(event.target.value)}
//         placeholder="Enter name"
//       />
//       <button onClick={handleSubmit} disabled={isPending || !name}>
//         {isPending ? "Updating..." : "Update"}
//       </button>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }

// export default UpdateName;

function UpdateName() {
    const [optimisticState, setOptimisticState] = useState(0);
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState(null);
  
    const handleIncrement = () => {
      // Optimistically increment the counter
      const optimisticUpdate = optimisticState + 1;
      setOptimisticState(optimisticUpdate);
  
      // Start the async update
      setPending(true);
      setError(null);
  
      updateCounter(optimisticUpdate)
        .then(() => {
          // Successfully updated, we don't need to change the state further
          setPending(false);
        })
        .catch((err) => {
          // If the update failed, revert the state
          setOptimisticState(optimisticState);
          setPending(false);
          setError(err);
        });
    };
  
    return (
      <div>
        <h1>Counter: {optimisticState}</h1>
        <button onClick={handleIncrement} disabled={isPending}>
          {isPending ? "Updating..." : "Increment"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }
  
  export default UpdateName;