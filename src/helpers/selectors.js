export default function getAppointmentsForDay(state, day) {
  const appointmentsForDay = state.days.filter(elem => elem.name === day)
  if (appointmentsForDay.length === 0) {
    return []
  } else {
    return appointmentsForDay[0].appointments.map(id => state.appointments[id])
  }
}

