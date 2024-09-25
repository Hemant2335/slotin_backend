import Appointment from "../module/appointment";

const createNewAppointment = async (req, res) => {
  // Logic to create a new appointment

  // Step 1: Get the data from the request
  const data = req.body;

  // Step 2: Validate the data
  if (!data.name || !data.email || !data.phone || !data.date || !data.time) {
    return res.status(400).send({ message: "All input is required" });
  }
  try {
    // Step 3: Create a new appointment
    const newAppointment = new Appointment({
      user: req.user._id,
      merchant: req.merchant._id,
      date: data.date,
      time: data.time,
      status: "pending",
    });

    // Step 4: Save the appointment
    await newAppointment.save();

    res.status(201).send({ message: "Appointment created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error creating appointment }" });
  }
};

export { createNewAppointment };
