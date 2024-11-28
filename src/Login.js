// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// // import '../styles/login.css'; // Import the CSS file

// const Login = ({ setUsername }) => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [responseMessage, setResponseMessage] = useState('');
//   const navigate = useNavigate();

//   const fetchUsername = async (email) => {
//     try {
//       const response = await fetch('http://localhost:3000/getUsername', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUsername(data.username);
//       } else {
//         const errorText = await response.text();
//         console.error('Error fetching username:', errorText);
//       }
//     } catch (error) {
//       console.error('Error fetching username:', error);
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       const response = await fetch('http://localhost:3000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         await fetchUsername(data.email);
//         navigate('/'); // Redirect on success
//       } else {
//         const message = await response.text();
//         setResponseMessage(message);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setResponseMessage('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <h1>Login</h1>

//           <div className="inputContainer">
//             <input
//               type="email"
//               placeholder="Email"
//               {...register('email', { required: true })}
//               className="input"
//             />
//           </div>
//           {errors.email && <span className="error">Email is required.</span>}

//           <div className="inputContainer">
//             <input
//               type="password"
//               placeholder="Password"
//               {...register('password', { required: true })}
//               className="input"
//             />
//           </div>
//           {errors.password && <span className="error">Password is required.</span>}

//           <button type="submit" className="button">Login</button>

//           {responseMessage && <p className="error">{responseMessage}</p>}

//           <p>
//             Don’t have an account? <Link to="/register">Register</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;