import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import useSignup from "../../hooks/useSignup";

const signUp = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks, no-undef
  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

const {loading, signUp} = useSignup();



  const handleCheckboxChange = (gender) => {
    setInputs({...inputs, gender});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await signUp(inputs)
  }
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <dir className="w-full p-5 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <h1 className="text-3xl font-semibold text-center text-gray-300">
          SignUp
          <span className="text-blue-500"> ChatApp</span>
        </h1>



        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2"><span className="text-base label-text">Full Name</span></label>
            <input type="text" placeholder="Surafel Takele" className="w-full input input-bordered h-10"
            value={inputs.fullName}
            onChange={(e) => setInputs({...inputs, fullName: e.target.value})}
            />
          </div>
            
          <div>
          <label className="label p-2"><span className="text-base label-text">Username</span></label>
          <input type="text" placeholder="suratakele" className="w-full input input-bordered h-10"
          
          value={inputs.username}
          onChange={(e) => setInputs({...inputs, username: e.target.value})}
          />
          </div>

          <div>
          <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(e) => setInputs({...inputs, password: e.target.value})}
            />
          </div>

          <div>
          <label className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({...inputs, confirmPassword: e.target.value})}
            />
          </div>

          <GenderCheckbox onCheckboxChange = {handleCheckboxChange} selectedGender = {inputs.gender} />

          <Link to="/login" className="text-sm hover:underline hover:text-blue-600 inline-block">
            Already have an account?
          </Link>
          <div>
            <button className="btn btn-primary w-full h-10 mt-4" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "SignUp"}
            </button>
          </div>
        </form>
      </dir>
    </div>
  )
}

export default signUp;




// STARTER CODE
// import GenderCheckbox from "./GenderCheckbox";

// const signUp = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
//       <dir className="w-full p-5 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
//       <h1 className="text-3xl font-semibold text-center text-gray-300">
//           SignUp
//           <span className="text-blue-500"> ChatApp</span>
//         </h1>

//         <form>
//           <div>
//             <label className="label p-2"><span className="text-base label-text">Full Name</span></label>
//             <input type="text" placeholder="Surafel Takele" className="w-full input input-bordered h-10" />
//           </div>
            
//           <div>
//           <label className="label p-2"><span className="text-base label-text">Username</span></label>
//           <input type="text" placeholder="suratakele" className="w-full input input-bordered h-10" />
//           </div>

//           <div>
//           <label className="label">
//               <span className="text-base label-text">Password</span>
//             </label>
//             <input
//               type="password"
//               placeholder="Enter Password"
//               className="w-full input input-bordered h-10"
//             />
//           </div>

//           <div>
//           <label className="label">
//               <span className="text-base label-text">Confirm Password</span>
//             </label>
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               className="w-full input input-bordered h-10"
//             />
//           </div>

//           <GenderCheckbox />

//           <a href="#" className="text-sm hover:underline hover:text-blue-600 inline-block">
//             Already have an account?
//           </a>
//           <div>
//             <button className="btn btn-primary w-full h-10 mt-4">SignUp</button>
//           </div>
//         </form>
//       </dir>
//     </div>
//   )
// }

// export default signUp;
