// // src/components/FeedbackForm.jsx
// import React, { useState } from 'react';

// function FeedbackForm() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [rating, setRating] = useState(1);
//   const [comment, setComment] = useState('');
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     if (!name || !email || !comment) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     try {
//       const response = await fetch('/api/feedback', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, rating, comment }),
//       });

//       if (!response.ok) {
//         throw new Error('Error submitting feedback');
//       }

//       setSuccess('Feedback submitted successfully!');
//       setName('');
//       setEmail('');
//       setRating(1);
//       setComment('');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="feedback-form">
//       <h3>Submit Your Feedback</h3>
//       {error && <p className="error">{error}</p>}
//       {success && <p className="success">{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </label>
//         <label>
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </label>
//         <label>
//           Rating:
//           <select value={rating} onChange={(e) => setRating(e.target.value)}>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <option key={star} value={star}>
//                 {star} Star{star > 1 ? 's' : ''}
//               </option>
//             ))}
//           </select>
//         </label>
//         <label>
//           Comment:
//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />
//         </label>
//         <button type="submit">Submit Feedback</button>
//       </form>
//     </div>
//   );
// }

// export default FeedbackForm;
