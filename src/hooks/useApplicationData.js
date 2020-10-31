import { useState, useEffect } from "react";
const axios = require('axios');


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}, 
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, {interview}).then(() => setState({...state,appointments}))
  }

  function cancelInterview(appointmentId) {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: null
    };
    const appointments = {
      ...state.appointments, 
      [appointmentId]: appointment
    }
    return axios.delete(`/api/appointments/${appointmentId}`).then(() => setState({...state,appointments}))
  }

  useEffect(() => {
    Promise.all([
      axios.get("api/days"), 
      axios.get("api/appointments"),
      axios.get("api/interviewers")
    ]).then(([days, appointments, interviewers]) => { 
      setState(prev => ({...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}))
    });
  }, [])

  return { state, setDay, bookInterview, cancelInterview }
}