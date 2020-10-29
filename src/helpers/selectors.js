export function getAppointmentsForDay(state, day) {
  const appointmentsForDay = state.days.find(currDay => currDay.name === day)
  if (!appointmentsForDay) {
    return []
  } else {
    return appointmentsForDay.appointments.map(id => state.appointments[id])
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


