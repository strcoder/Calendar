import React, { useState } from 'react';
import Modal from '../../components/Modal';
import TeamCard from '../../components/TeamCard';
import { useStateValue } from '../../context';
import './styles.scss';

const Team = () => {
  const { user, team } = useStateValue();
  const [showModal, setShowModal] = useState(false);

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
        onClose={setShowModal}
        title='Reunion del equipo'
      >
        <div>
          <p><strong>Tiempos disponibles</strong></p>
          <p>Selecciona la fecha y hora de la proxima reunión</p>
        </div>
        <div className='flex justify-self-end'>
          <button
            type='button'
            className='btn-link-danger'
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
          <button
            type='button'
            className='btn-primary'
            onClick={() => setShowModal(false)}
          >
            Continuar
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default Team;