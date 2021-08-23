import React, { useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useStateValue } from '../../context';
import { scheduleMeeting } from '../../context/actions';
import Modal from '../Modal';
import './styles.scss';

const TeamCard = ({ user, role }) => {
  const { user: key, dispatch } = useStateValue();
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any>();
  const schedule = user?.schedule || [];
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const meetingsLists = schedule.map((item) => item.list).flat();
  // const schedule = [
  //   {
  //     day: 'Lunes',
  //     list: ['14:00'],
  //   },
  //   {
  //     day: 'Martes',
  //     list: ['9:20'],
  //   },
  //   {
  //     day: 'Miercoles',
  //     list: ['9:20'],
  //   },
  // ];
  // console.log(schedule);

  const handleScheduleMeeting = async () => {
    const userMeetings = key?.meetings?.map((item) => {
      if (item.day === selected.day) {
        item.list.push({ time: selected.time, user: user.name });
        return item;
      }
      return item;
    });
    const partnerMeetings = user?.meetings?.map((item) => {
      if (item.day === selected.day) {
        item.list.push({ time: selected.time, user: key.name });
        return item;
      }
      return item;
    });
    const partnerSchedule = user?.schedule?.map((item) => {
      if (item.day === selected.day) {
        const aux = item.list.indexOf(selected.time);
        item.list.splice(aux, 1);
        return item;
      }
      return item;
    });

    const result = await scheduleMeeting({
      dispatch,
      userId: key._id,
      partnerId: user._id,
      data: {
        userMeetings,
        partnerMeetings,
        partnerSchedule,
      }
    });
    if (!result) {
      setError(true);
    } else {
      setSuccess(true);
      setSelected(null);
      setTimeout(() => {
        setSuccess(false);
      }, 5000)
    }
  }

  const closeModal = () => {
    setSelected(null);
    setShowModal(false);
  }

  const classActive = ({ day, time }) => {
    if (selected?.day === day && selected?.time === time) {
      return 'active'
    }
    return '';
  }

  return (
    <div className='TeamCard'>
      <div className='TeamCard__header'>
        <p><strong>{`${user.name} ${user.lastname}`}</strong></p>
      </div>
      <div className='TeamCard__body'>
        <figure>
          <img src='/assets/avatar-female.svg' alt='Avatar' />
        </figure>
      </div>
      {key._id !== user._id && (
        <div className='TeamCard__footer'>
          <p className='color-gray-700'>{role}</p>
          <button
            type='button'
            className='btn-outline-accent'
            onClick={() => {
              setError(false);
              setSuccess(false);
              setShowModal(true);
            }}
          >
            Agendar reunión
          </button>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={closeModal}
        title='Horarios libres del usuario'
      >
        <div className='TeamCard__modal gap-20'>
          <div className='TeamCard__modal--header gap-4'>
            {error && <p className='color-danger'>¡Ha ocurrido un error!</p>}
            {success && <p className='color-success'>¡Reunion agendada con exito!</p>}
            <p><strong>Horarios disponibles</strong></p>
            <p>Selecciona un horario de los disponibles para tener una reunión con tu compañero</p>
          </div>
          <div className='TeamCard__modal--body'>
            {meetingsLists.length <= 0 && (
              <div className='p-10'>
                <p className='color-accent'><strong>Al parecer tu compañero no cuenta con horas libres</strong></p>
              </div>
            )}
            {schedule.map((meeting) => meeting.list.length > 0 && (
              <div key={meeting.day} className=''>
                {meeting?.list?.map((item: any) => (
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
          <div className='TeamCard__modal--footer flex justify-self-end'>
            <button
              type='button'
              className='btn-link-tertiary'
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleScheduleMeeting}
              disabled={selected ? false : true}
              className={selected ? 'btn-primary' : 'btn-disabled'}
            >
              Continuar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TeamCard;
