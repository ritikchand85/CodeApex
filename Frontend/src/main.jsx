import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import {store} from "./store/store.js"
import { Provider } from 'react-redux';





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)


//how to write import { useState } from 'react';

// export default function SimpleForm() {
//   // Individual state variables for each field
//   const [firstName, setFirstName] = useState('');
//   const [email, setEmail] = useState('');
//   const [subscribe, setSubscribe] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Handle form submission
//   const handleSubmit = (e) => {
//    for avoid reloading on submission
//     e.preventDefault();
    
//     // Validation
//     const newErrors = {};
//     if (!firstName.trim()) newErrors.firstName = 'First name required';
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email';
    
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
    
//     // Submit data
//     console.log('Submitted:', { firstName, email, subscribe });
    
//     // Reset form (optional)
//     setFirstName('');
//     setEmail('');
//     setSubscribe(false);
//     setErrors({});
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* First Name Field */}
//       <div>
//         <label>
//         FirstName:
//         <input
//           id="firstName"
//           type="text"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           aria-invalid={errors.firstName ? "true" : "false"}
//         />
//         {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
//        </label>
//       </div>

//       {/* Email Field */}
//       <div>
//         <label htmlFor="email">Email:</label>
//         <input
//           id="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           aria-invalid={errors.email ? "true" : "false"}
//         />
//         {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
//       </div>

//       {/* Checkbox Field */}
//       <div>
//         <label>
//           <input
//             type="checkbox"
//             checked={subscribe}
//             onChange={(e) => setSubscribe(e.target.checked)}
//           />
//           Subscribe to newsletter
//         </label>
//       </div>

//       <button type="submit">Submit</button>
//     </form>
//   );
// }


//to remove thsese complex usestate variables we use React hook form

// import { useForm } from 'react-hook-form';

// const SimpleForm = () => {
//   const { 
//     register, 
//     handleSubmit,
//     formState: { errors } 
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     handleSubmit pehle validation check karega fir onSubmit ko call karega
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {/* Name Field */}
//       <div>
//         <label>Name</label>
//         <input 
//           {...register('name', { 
//             required: "Name is required",
//             minLength: { value: 3, message: "Minimum 3 characters" } 
//           })} 
//         />
//         {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
//       </div>

//       {/* Email Field */}
//       <div>
//         <label>Email</label>
//         <input 
//           type="email"
//           {...register('email', { 
//             required: "Email is required",
//             pattern: { 
//               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//               message: "Invalid email address"
//             } 
//           })} 
//         />
//         {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
//       </div>

//       <button type="submit">Submit</button>
//     </form>
//   );
// };


//but we have to apply complex validation here for avoiding these complex validation we use zod resolver also

//react-hook-form with zod resolver




