import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsInfoCircle } from 'react-icons/bs';
import { RiAddCircleLine } from 'react-icons/ri';
import { AiOutlineClockCircle } from 'react-icons/ai';
import TextField from '../../components/form/TextField';
import Modal from '../../components/Modal';
import { useStateValue } from '../../context';
import './styles.scss';
import { scheduleMeeting, updateSchedule } from '../../context/actions';

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const months = ['Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Meetings = () => {
  const { user, team, dispatch } = useStateValue();
  // const [items, setItems] = useState(user?.schedule || []);
  const [selected, setSelected] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  // const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const meetings = days.map((day) => {
    return {
      day,
      list: [
        ...team?.meetings?.find((item) => item?.day === day)?.list || [],
        ...user?.meetings?.find((item) => item?.day === day)?.list || [],
      ]
    };
  });

  const meetingsLists = meetings.map((item) => item.list).flat();

  const calcDate = ({ day }) => {
    const date = new Date();
    const aux = days.indexOf(day);
    const year = date.getFullYear();
    const dateNumber = date.getDate();
    const month = months[date.getMonth()];
    const today = days[date.getDay()];
    const finalDate = today === day ? dateNumber : date.getDay() > aux ? dateNumber - aux : dateNumber + aux;
    return `${day} ${finalDate} de ${month} ${year}`;
  }

  const handelDelete = async () => {
    const partner = team.members.find((member) => member.name === selected?.info?.user);
    // console.log(user);
    // console.log(partner);
    const userMeetings = user?.meetings?.map((item) => {
      if (item.day === selected.day) {
        const aux = item.list.find((item) => item.time === selected?.info?.time && item.user === selected?.info?.user);
        const index = item.list.indexOf(aux);
        item.list.splice(index, 1);
        return item;
      }
      return item;
    });
    const partnerMeetings = partner?.meetings?.map((item) => {
      if (item.day === selected.day) {
        const aux = item.list.find((item) => item.time === selected?.info?.time && item.user === user.name);
        const index = item.list.indexOf(aux);
        item.list.splice(index, 1);
        return item;
      }
      return item;
    });

    const result = await scheduleMeeting({
      dispatch,
      userId: user._id,
      partnerId: partner._id,
      data: {
        userMeetings,
        partnerMeetings,
        partnerSchedule: partner.schedule,
      }
    });
    if (!result) {
      setError(true);
    } else {
      setShowModal(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <section className='MeetingsPage'>
      <div className='gap-8'>
        <p><strong>Reuniones con tu equipo esta semana</strong></p>
        <p>Aqui podras encontrar facilmente cuales seran los dias que tendras reuniones esta semana</p>
      </div>

      {meetingsLists.length <= 0 && (
        <div className='FreeHours'>
          <div className='DaysCard'>
            <div className='DaysCard__header'>
              <p className='color-secondary'><strong>Reuniones</strong></p>
            </div>
            <div className='DaysCard__body empty'>
              <p>Sin reuniones</p>
            </div>
          </div>
        </div>
      )}

      {meetingsLists.length > 0 && (
        <div className='FreeHours'>
          {meetings.map((meeting) => meeting.list.length > 0 && (
            <div key={meeting.day} className='DaysCard'>
              <div className='DaysCard__header'>
                <p className='color-secondary'><strong>{meeting.day}</strong></p>
              </div>
              <div className='DaysCard__body scroll-auto'>
                {meeting?.list?.map((item: any) => (
                  <div key={item?.time || item} className='FreeHourCard'>
                    <div className='flex items-center'>
                      <span><AiOutlineClockCircle /></span>
                      <p>{item?.time || item}</p>
                    </div>
                    <button
                      type='button'
                      title='Eliminar'
                      onClick={() => {
                        setShowModal(true);
                        setSelected({ day: meeting.day, info: item });
                      }}
                      className='btn-link-accent'
                    >
                      <BsInfoCircle />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        show={showModal}
        onClose={setShowModal}
        title='Información de la reunión'
      >
        <div className='MeetingPage__modal gap-20'>
          <div className='MeetingPage__modal--header gap-4'>
            <p><strong>Día de la reunión:</strong></p>
            <p>{calcDate({ day: selected?.day || 'Domingo' })}</p>
          </div>
          <div className='MeetingPage__modal--body gap-8 scroll-auto'>
            <p><strong>Miembros que asistiran</strong></p>
            {!selected?.info?.time && team.members.map((member) => (
              <div className='MeetingPage__modal--user'>
                <figure>
                  <img src='/assets/avatar-female.svg' alt='Avatar' />
                </figure>
                <p>{member.name}</p>
              </div>
            ))}
            {selected?.info?.time && selected?.info?.user && (
              <div className='MeetingPage__modal--user'>
                <figure>
                  <img src='/assets/avatar-female.svg' alt='Avatar' />
                </figure>
                <p>{selected?.info?.user}</p>
              </div>
            )}
            {selected?.info?.time && selected?.info?.user && (
              <div className='MeetingPage__modal--user'>
                <figure>
                  <img src='/assets/avatar-female.svg' alt='Avatar' />
                </figure>
                <p>{user.name}</p>
              </div>
            )}
          </div>
          <div className='flex justify-self-end'>
            <button
              type='button'
              onClick={() => setShowDeleteModal(true)}
              className='btn-link-danger justify-self-end'
            >
              Cancelar reunión
            </button>
            <button
              type='button'
              onClick={() => setShowModal(false)}
              className='btn-primary justify-self-end'
            >
              Continuar
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        onClose={setShowDeleteModal}
        title='Eliminar reunión'
      >
        <div>
          {error && <p className='color-danger'>¡Ha ocurrido un error!</p>}
          <p><strong>¿Seguro que deseas eliminar la reunión?</strong></p>
        </div>
        <div className='flex justify-between'>
          <button
            type='button'
            className='btn-link-accent'
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </button>
          <button
            type='button'
            className='btn-danger'
            onClick={() => handelDelete()}
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default Meetings;
