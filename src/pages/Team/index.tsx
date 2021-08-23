import React from 'react';
import TeamCard from '../../components/TeamCard';
import { useStateValue } from '../../context';
import './styles.scss';

const Team = () => {
  const { user, team } = useStateValue();
  return (
    <section className='Team'>
      <p><strong>{`Equipo: ${team.name}`}</strong></p>
      <p>Controla las reuniones con los miembros de tu equipo</p>
      <div className='Team__list'>
        <TeamCard user={team.manager} role='Manager' />
        {team?.members?.map((member) => user._id !== member._id && (
          <React.Fragment key={member._id}>
            <TeamCard user={member} role='Team' />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

export default Team;