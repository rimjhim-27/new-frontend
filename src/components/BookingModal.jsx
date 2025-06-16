// Frontend: src/components/BookingModal.jsx
const handleSubmit = async () => {
  await axios.post('/api/bookings', formData, {
    headers: { Authorization: `Bearer ${user.token}` }
  });
};