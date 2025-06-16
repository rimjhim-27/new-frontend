
useEffect(() => {
  fetch('/api/services')
    .then(res => res.json())
    .then(data => setServices(data));
}, []);