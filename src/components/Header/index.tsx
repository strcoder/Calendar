import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { IoExitOutline } from 'react-icons/io5';
import { CgMenuRightAlt, CgCloseO } from 'react-icons/cg';
import './styles.scss';
import Modal from '../Modal';
import TextField from '../form/TextField';
import { useForm } from 'react-hook-form';
import { useStateValue } from '../../context';
import { loginUser, logoutUser } from '../../context/actions';

const Header = () => {
  const { user, dispatch } = useStateValue();
  const { register, handleSubmit } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onSubmit = (data) => {
    loginUser({ email: data.email, password: data.password, dispatch }).then((result) => {
      if (!result) {
        setError(true);
      }
    });
  }

  return (
    <header className='Header'>
      <Link to='/' className='btn-link'>
        <figure className='Heeader__logo'>
          {/* <img src='/assets/logo.png' alt='Logo' /> */}
          <p className='txt-xl color-primary'><strong>CREA</strong></p>
        </figure>
      </Link>
      {!user && (
        <button
          type='button'
          title='Iniciar sesión'
          onClick={() => setShowModal(true)}
          className='Header__button btn-primary'
        >
          <span>Iniciar sesión</span>
        </button>
      )}
      {user && (
        <>
          <nav className={`Header__nav flex items-center ${menuOpen}`}>
            <NavLink exact to='/schedule' className='btn-link single-line' activeClassName='active'>
              Mi semana
            </NavLink>
            <NavLink exact to='/team' className='btn-link' activeClassName='active'>
              Equipo
            </NavLink>
            <NavLink exact to='/meetings' className='btn-link' activeClassName='active'>
              Reuniones
            </NavLink>
            <button
              type='button'
              title='Cerrar sesión'
              className='btn-link-danger'
              onClick={() => logoutUser({ dispatch })}
            >
              <span>Salir</span>
              <span className='btn-icon'><IoExitOutline /></span>
            </button>
          </nav>
          <button
            type='button'
            title='Abrir menu'
            onClick={() => setMenuOpen(!menuOpen)}
            className={`Header__openMenu btn-link-${!menuOpen ? 'primary' : 'danger'} txt-xl `}
          >
            {menuOpen && <CgCloseO />}
            {!menuOpen && <CgMenuRightAlt />}
          </button>
        </>
      )}
      <Modal
        show={showModal}
        onClose={setShowModal}
        title='Iniciar sesión'
      >
        <form onSubmit={handleSubmit(onSubmit)} className='Header__login'>
          {error && (
            <p className='color-danger'>Error de email o contraseña</p>
          )}
          <TextField
            id='Email'
            type='email'
            name='email'
            label='Correo'
            autoComplete='off'
            placeholder='Digita tu correo electronico'
            register={register('email', { required: true })}
          />
          <TextField
            id='Password'
            name='password'
            type='password'
            label='Contraseña'
            placeholder='Digita tu contraseña'
            register={register('password', { required: true })}
          />
          <button type='submit' className='btn-primary form-button'>
            Continuar
          </button>
        </form>
      </Modal>
    </header>
  );
}

export default Header;