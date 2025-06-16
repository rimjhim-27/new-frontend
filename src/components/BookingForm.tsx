import React, { useState, useEffect } from "react";
// ...existing code...

const BookingForm = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetch("/api/tests")
      .then(res => res.json())
      .then(data => setTests(data));
  }, []);

  // Add this function
  const bookTest = (testId: string) => {
    // Implement booking logic here
    alert(`Booking test with id: ${testId}`);
  };

  return (
    <div>
      {tests.map((test: any) => (
        <div key={test._id}>
          <h3>{test.name}</h3>
          <button onClick={() => bookTest(test._id)}>Book Now</button>
        </div>
      ))}
    </div>
  );
};