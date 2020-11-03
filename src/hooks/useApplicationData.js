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

  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {}, 
  //   interviewers: {}
  // });

  const setDay = day => dispatch({ type: SET_DAY, day });
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, {interview}).then(() => dispatch({type: SET_INTERVIEW, appointments}))
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
    return axios.delete(`/api/appointments/${appointmentId}`).then(() => dispatch({type: SET_INTERVIEW, appointments}))
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
    const appointmentsForDay = getAppointmentsForDay(state, state.day)
    const emptySpotsForDay = appointmentsForDay.filter(elem => elem.interview === null)
    const updateSpots = state.days.map(days => {
      if (days.name === state.day) {
        days.spots = emptySpotsForDay.length
      }
      return days;
    })
    dispatch(({type: UPDATE, days: updateSpots}))
}, [state.appointments]) 

  return { state, setDay, bookInterview, cancelInterview }
}