import React from 'react';
import { Link } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import { RiAddCircleLine } from 'react-icons/ri';
import { AiOutlineClockCircle } from 'react-icons/ai';
import TextField from '../../components/form/TextField';
import Modal from '../../components/Modal';
import './styles.scss';
import { useStateValue } from '../../context';
import TeamCard from '../../components/TeamCard';

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const months = ['Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Home = () => {
  const { user, team } = useStateValue();
  const date = new Date();
  const fullDate = `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;

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

  return (
    <section className='Home'>
      <div className='gap-8'>
        <p><strong>¡Bienvenido!</strong></p>
        <p>Mira todo lo que tienes que hacer esta semana</p>
      </div>
      <main className='Home__container'>
        <TeamCard user={user} role={team?.manager?._id === user?._id ? 'Manager' : 'Team'} />
        <div className='Home__team'>
          <div className='Home__team--header'>
            <p><strong>{fullDate}</strong></p>
          </div>
          <div className='Home__team--body'>
            <p><strong>Este es tu equipo:</strong></p>
            <p>{`Reuniones: ${meetingsLists?.length || 0}`}</p>
            <p>{`Miembros: ${team?.members?.length}`}</p>
            <p>{`Manager: ${team?.manager?.name}`}</p>
            <p>{`Equipo: ${team?.name}`}</p>
            {user._id === team.manager._id && (
              <Link to='/team' className='btn-link-accent justify-self-end'>
                Crear reunión
              </Link>
            )}
          </div>
        </div>
        <div className='Home__meetings'>
          <div className='Home__meetings--header'>
            <p><strong>Proximas reuniones</strong></p>
          </div>
          <div className='Home__meetings--body'>
            {meetingsLists.length <= 0 && (
              <div className='Meetings empty'>
                <p>No hay reuniones</p>
                <p>Puedes ir modificando tus horas de reuniones</p>
                <Link to='/schedule' className='btn-outline-accent'>
                  Mi semana
                </Link>
              </div>
            )}
            {meetings.map((meeting) => meeting.list.length > 0 && (
              <div key={meeting.day} className='Meetings'>
                <p><strong>{meeting.day}</strong></p>
                <div className='Meetings__list'>
                  {meeting?.list?.map((item: any) => (
                    <div key={`${meeting.day} ${item?.time || item}`} className='Meetings__list--item justify-items-center'>
                      <div className='Meetings__item--header'>
                        <p className='single-line'><strong>{item?.time && item.user ? item.user : team.name}</strong></p>
                      </div>
                      <div className='Meetings__item--body flex items-center'>
                        <span><AiOutlineClockCircle /></span>
                        <p>{item.time ? item.time : item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}

export default Home;