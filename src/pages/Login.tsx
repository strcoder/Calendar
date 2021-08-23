import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../components/form/TextField';

const Login = () => {
  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <div className='Login'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id='Name'
          name='name'
          label='Nombre'
          placeholder='Digita tu nombre'
          register={register('name', { required: true })}
        />
        <TextField
          id='Password'
          name='password'
          type='password'
          label='Contraseña'
          placeholder='Digita tu contraseña'
          register={register('password', { required: true })}
        />
      </form>
    </div>
  );
}

export default Login;