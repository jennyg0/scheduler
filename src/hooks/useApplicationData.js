import { getAppointmentsForDay } from "helpers/selectors";
import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW, 
  UPDATE
} from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {day: "Monday", days: [], appointments: {}, interviewers: {}})

  const setDay = day => dispatch({ type: SET_DAY, day });
  
  function bookInterview(appointmentId, interview) {
    return axios.put(`/api/appointments/${appointmentId}`, {interview}).then(() => dispatch({type: SET_INTERVIEW, interview, appointmentId}))
  }

  function cancelInterview(appointmentId) {
    return axios.delete(`/api/appointments/${appointmentId}`).then(() =>  dispatch({type: SET_INTERVIEW, interview : null, appointmentId}))
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"), 
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => { 
      dispatch({ type: SET_APPLICATION_DATA, days : days.data, appointments: appointments.data, interviewers: interviewers.data});
    });
  }, [])

  //spots remaining: use apptforday fcn, filter the number of null interviews that day, replace the spot count for day, dependency when appointments state changes
  useEffect(() => {
    const updateSpots = state.days.map(days => {
      const appointmentsForDay = getAppointmentsForDay(state, days.name)
      const emptySpotsForDay = appointmentsForDay.filter(elem => elem.interview === null)
      days.spots = emptySpotsForDay.length
      
      return days;
    })
    dispatch(({type: UPDATE, days: updateSpots}))
  }, [state.appointments, state.day]) 

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.addEventListener('message', function (event) {
      const receivedMessage = JSON.parse(event.data)
      const appointmentId = receivedMessage.id;
      const interview = receivedMessage.interview
      if (receivedMessage.type === "SET_INTERVIEW") {
        dispatch({type: SET_INTERVIEW, interview, appointmentId})
      }
    });
  }, [])

  return { state, setDay, bookInterview, cancelInterview }
}