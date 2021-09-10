import React, { useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import Modal from '../../components/Modal';
import TeamCard from '../../components/TeamCard';
import { useStateValue } from '../../context';
import { scheduleTeamMeeting, updateTeamSchedule } from '../../context/actions';
import './styles.scss';

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

const getPossibleMeetings = ({ array, day }) => {
  const members = array.length / 2;
  const meetingsJoin = array.flat();
  const hours = meetingsJoin.filter((item) => item.day === day).map((item) => item.list).flat();
  const list = [];
  for (let i = 0; i < hours.length; i++) {
    const aux = list.find((item) => item.value === hours[i]);
    if (!aux) {
      list.push({ value: hours[i], count: 0});
    } else {
      aux.count += 1;
    }
  }
  const newList = list.filter((item) => item.count >= members).map((item) => item.value);
  return {
    day,
    list: newList || [],
  }
}

const Team = () => {
  const { user, team, dispatch } = useStateValue();
  const [selected, setSelected] = useState<any>();
  const [showModal, setShowModal] = useState(false);

  const meetings = team.members.map((member) => member.schedule);
  const possibleMeetings = days.map((day) => getPossibleMeetings({ array: meetings, day }));

  const classActive = ({ day, time }) => {
    if (selected?.day === day && selected?.time === time) {
      return 'active'
    }
    return '';
  }

  const handleTeamMeeting = async () => {
    const meeting = team.meetings.map((item) => {
      if (item.day === selected.day) {
        item.list.push(selected.time);
      }
      return item;
    });
    const teamSchedule = await Promise.all(team?.members?.map((member) => {
      const aux = member.schedule.find((item) => item.day === selected.day);
      if (aux) {
        const index = aux.list.indexOf(selected.time);
        aux.list.splice(index, 1);
      }
      return updateTeamSchedule({ id: member._id, schedule: member.schedule, dispatch });
    }));
    const result = await scheduleTeamMeeting({ teamId: team._id, meetings: meeting, dispatch });
    if (teamSchedule && result) {
      closeModal();
    }
  }

  const closeModal = () => {
    setSelected(null);
    setShowModal(false);
  }

  return (
    <section className='Team'>
      <p><strong>{`Equipo: ${team.name}`}</strong></p>
      <p>Controla las reuniones con los miembros de tu equipo</p>
      <div className='Team__list'>
        {user._id === team.manager._id && (
          <div className='TeamCard'>
            <div className='TeamCard__header'>
              <p><strong>Reunión con tu equipo</strong></p>
            </div>
            <div className='TeamCard__body manager gap-25'>
              <p><strong>Crear una reunión para todo tu equipo</strong></p>
              <button
                type='button'
                onClick={() => setShowModal(true)}
                className='btn-primary form-button'
              >
                Crear
              </button>
            </div>
          </div>
        )}
        {user._id !== team.manager._id && (
          <TeamCard user={team.manager} role='Manager' />
        )}
        {team?.members?.map((member) => user._id !== member._id && (
          <React.Fragment key={member._id}>
            <TeamCard user={member} role='Team' />
          </React.Fragment>
        ))}
      </div>
      <Modal
        show={showModal}
        onClose={closeModal}
        title='Reunion del equipo'
      >
        <div>
          <p><strong>Tiempos disponibles</strong></p>
          <p>Selecciona la fecha y hora de la proxima reunión</p>
        </div>
        <div className='Team__modal flex flex-wrap'>
          {possibleMeetings.length <= 0 && (
            <p className='color-accent'><strong>No hay espacios disponibles</strong></p>
          )}
          {possibleMeetings.length > 0 && possibleMeetings.map((meeting) => meeting.list.length > 0 && (
            <div key={meeting.day} className=''>
              {meeting.list.map((item) => (
                <button
                  type='button'
                  key={`${meeting.day} ${item?.time || item}`}
                  onClick={() => setSelected({ day: meeting.day, time: item?.time || item})}
                  className={`Meetings__list--item grid justify-items-center ${classActive({ day: meeting.day, time: item?.time || item })}`}
                >
                  <div className='Meetings__item--header'>
                    <p className='single-line'><strong>{meeting.day}</strong></p>
                  </div>
                  <div className='Meetings__item--body flex items-center'>
                    <span><AiOutlineClockCircle /></span>
                    <p>{item.time ? item.time : item}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className='flex justify-self-end'>
          <button
            type='button'
            className='btn-link-danger'
            onClick={() => closeModal()}
          >
            Cancelar
          </button>
          <button
            type='button'
            disabled={!selected}
            className='btn-primary'
            onClick={() => handleTeamMeeting()}
          >
            Continuar
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default Team;