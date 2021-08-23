import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsTrash } from 'react-icons/bs';
import { RiAddCircleLine } from 'react-icons/ri';
import { AiOutlineClockCircle } from 'react-icons/ai';
import TextField from '../../components/form/TextField';
import Modal from '../../components/Modal';
import { useStateValue } from '../../context';
import './styles.scss';
import { updateSchedule } from '../../context/actions';

// const FreeHourCard = ({ data, list, setList }: { data: any, list: any[], setList: Function }) => {
//   const handelDelete = () => {
//     const index = list.indexOf(data);
//     list.splice(index, 1);
//     setList([...list]);
//   }

//   return (
//     <div className='FreeHourCard'>
//       <p>{`${data.date}`}</p>
//       <button
//         type='button'
//         title='Eliminar'
//         onClick={handelDelete}
//         className='btn-link-danger'
//       >
//         <BsTrash />
//       </button>
//     </div>
//   );
// }

const days = [
  {
    day: 'Lunes',
    list: [],
  },
  {
    day: 'Martes',
    list: [],
  },
  {
    day: 'Miercoles',
    list: [],
  },
  {
    day: 'Jueves',
    list: [],
  },
  {
    day: 'Viernes',
    list: [],
  },
  {
    day: 'Sabado',
    list: [],
  },
  {
    day: 'Domingo',
    list: [],
  }
];

const Weekend = () => {
  const { user, dispatch } = useStateValue();
  const [items, setItems] = useState(user?.schedule || days);
  const { register, handleSubmit, reset } = useForm();
  const [selected, setSelected] = useState<any>();
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handelDelete = async ({ item, hour }) => {
    const newItem = item;
    const itemIndex = items.indexOf(item);
    const hourIndex = newItem.list.indexOf(hour);

    if (itemIndex >= 0 && hourIndex >= 0) {
      newItem.list.splice(hourIndex, 1);
      items.splice(itemIndex, 1, newItem);
      setItems([...items]);
      const result = await updateSchedule({ id: user._id, schedule: items, dispatch });
      if (result) {
        setError(false);
      } else {
        setError(true);
      }
    }
  }

  const onSubmit = async (data) => {
    const index = items.indexOf(selected);
    const aux = selected.list.find((item) => item === data.time);
    if (aux) {
      return;
    }
    if (index >= 0) {
      selected.list.push(data.time);
      items.splice(index, 1, selected);
      setItems([...items]);
      const result = await updateSchedule({ id: user._id, schedule: items, dispatch });
      if (result) {
        setShowModal(false);
        setError(false);
        reset();
      } else {
        setError(true);
      }
    }
  }

  return (
    <section className='Weekend'>
      <div className='gap-8'>
        <p><strong>¿Cómo va tu semana?</strong></p>
        <p>Te ayudaremos a administrar las horas para tus reuniones de esta semana</p>
      </div>

      <div className='FreeHours'>
        {items.map((item) => (
          <div key={item.day} className='DaysCard'>
            <div className='DaysCard__header'>
              <p className='color-accent'><strong>{item.day}</strong></p>
              <button
                type='button'
                title='Agregar hora disponible'
                className='btn-link txt-xxl'
                onClick={() => {
                  setError(false);
                  setSelected(item);
                  setShowModal(true);
                }}
              >
                <RiAddCircleLine />
              </button>
            </div>
            {item?.list?.length <= 0 && (
              <div className='DaysCard__body empty'>
                <p>Sin horas libres</p>
              </div>
            )}
            {item?.list?.length !== 0 && (
              <div className='DaysCard__body scroll-auto'>
                {item?.list?.map((freeHour) => (
                  <div key={freeHour} className='FreeHourCard'>
                    <div className='flex items-center'>
                      <span><AiOutlineClockCircle /></span>
                      <p>{freeHour}</p>
                    </div>
                    <button
                      type='button'
                      title='Eliminar'
                      onClick={() => handelDelete({ item, hour: freeHour })}
                      className='btn-link-danger'
                    >
                      <BsTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        show={showModal}
        onClose={setShowModal}
        title='Agregar horario para reunión'
      >
        <form onSubmit={handleSubmit(onSubmit)} className='FreeHourModal'>
          {error && <p className='color-danger'>¡Ocurrio un error!, por favor intentalo de nuevo</p>}
          <TextField
            id='Time'
            name='time'
            type='time'
            label='Selecciona el horario'
            placeholder='Selecciona el horario'
            register={register('time', { required: true })}
          />
          <div className='flex justify-self-end'>
            <button
              type='button'
              className='btn-link-danger'
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='btn-success'
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default Weekend;