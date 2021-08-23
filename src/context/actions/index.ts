import axios from 'axios';

export const setError = (error: any) => ({
  type: 'SET_THEME',
  error,
});

export const setTheme = (theme: string) => ({
  type: 'SET_THEME',
  theme,
});

export const setUser = (user: any) => ({
  type: 'SET_USER',
  user,
});

export const loginRequest = (user: {}) => ({
  type: 'LOGIN_REQUEST',
  user,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const updateTheme = ({ theme, dispatch }: { theme: 'light' | 'dark', dispatch: Function }) => {
  try {
    document.cookie = `theme=${theme}`;
    dispatch(setTheme(theme));
  } catch (error) {
    dispatch(setError(error));
  }
};

export const logoutUser = ({ dispatch }) => {
  try {
    document.cookie = 'id=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'token=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.location.href = '/';
    dispatch(logoutRequest({}));
  } catch (error) {
    dispatch(setError(error));
  }
};

export const loginUser = async ({ email, password, dispatch }) => {
  try {
    const { token } = await axios({
      url: 'http://localhost:8000/api/auth/sign-in',
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + btoa(`${email}:${password}`)
      }
    }).then(({ data }) => {
      console.log(data);
      document.cookie = `id=${data.user.id}`;
      document.cookie = `token=${data.token};path=/`;
      return data.token;
    });
    document.location.href = '/';
    return token;
  } catch (error) {
    dispatch(setError(error));
    return null;
  }
};

export const updateSchedule = async ({ id, schedule, dispatch }) => {
  try {
    const user = await axios({
      url: `http://localhost:8000/api/user/${id}`,
      method: 'PUT',
      data: {
        schedule,
      }
    }).then(({ data }) => {
      dispatch(setUser(data.data));
      return data.data;
    });
    return user;
  } catch (error) {
    dispatch(setError(error));
    return null;
  }
}

export const scheduleMeeting = async ({ userId, partnerId, data, dispatch }) => {
  try {
    const user = await axios({
      url: `http://localhost:8000/api/user/${userId}`,
      method: 'PUT',
      data: {
        meetings: data.userMeetings,
      }
    }).then(({ data }) => {
      dispatch(setUser(data.data));
      return data.data;
    });
    const partner = await axios({
      url: `http://localhost:8000/api/user/${partnerId}`,
      method: 'PUT',
      data: {
        schedule: data.partnerSchedule,
        meetings: data.partnerMeetings
      }
    }).then(({ data }) => {
      return data.data;
    });
    return [user, partner];
  } catch (error) {
    dispatch(setError(error));
    return null;
  }
}
