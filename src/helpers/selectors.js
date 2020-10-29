export function getAppointmentsForDay(state, day) {
  const appointmentsForDay = state.days.filter(elem => elem.name === day)
  if (appointmentsForDay.length === 0) {
    return []
  } else {
    return appointmentsForDay[0].appointments.map(id => state.appointments[id])
  }
}

export function getInterview(state, interview) {
  if (interview) {
    const interviewName = ((state.interviewers)[interview.interviewer]);
    const interviewInfo = {student: interview.student, interviewer: interviewName};
    return interviewInfo;
  } else {
    return null;
  }
}  


