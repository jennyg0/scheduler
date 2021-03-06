import React, { useEffect } from 'react';
import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(err => transition(ERROR_SAVE, true))
  }

  function remove() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(err => (transition(ERROR_DELETE, true)))
  }

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
  }, [props.interview, transition, mode]);
  
  return (
    <article className="appointment" data-testid="appointment"><Header time={props.time} /> 
    {mode === EMPTY && !props.interview && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && props.interview && (
    <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer}
      onDelete={() => transition(CONFIRM)}
      onEdit={() => transition(EDIT)}
    />
    )}  
    {mode === CREATE && <Form interviewers={props.interviewers} onCancel={()=> back()} onSave={save}/>}
    {mode === SAVING && <Status message="Saving"/>}
    {mode === DELETING && <Status message="Deleting"/>}
    {mode === CONFIRM && <Confirm message="Are you sure you want to delete?" onCancel={()=>back()} onConfirm={remove} />}
    {mode === EDIT && <Form interviewers={props.interviewers} name={props.interview.student} interviewer={props.interview.interviewer.id} onCancel={()=> back()} onSave={save} />}
    {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={()=>back()}/>}
    {mode === ERROR_DELETE && <Error message="Could not delete appointment" onClose={()=>back()}/>}
    </article>
  )
}
