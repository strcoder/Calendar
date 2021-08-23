import axios from 'axios';
const API_URL = 'https://crea-api.vercel.app';

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

export const setTeam = (team: any) => ({
  type: 'SET_TEAM',
  team,
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
      url: `${API_URL}/auth/sign-in`,
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + btoa(`${email}:${password}`)
      }
    }).then(({ data }) => {
      document.cookie = `id=${data.user.id}`;
      document.cookie = `token=${data.token};path=/`;
      document.location.href = '/';
      return data.token;
    });
    return token;
  } catch (error) {
    dispatch(setError(error));
    return null;
  }
};

export const updateSchedule = async ({ id, schedule, dispatch }) => {
  try {
    const user = await axios({
      url: `${API_URL}/user/${id}`,
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

export const updateTeamSchedule = async ({ id, schedule, dispatch }) => {
  try {
    const user = await axios({
      url: `${API_URL}/user/${id}`,
      method: 'PUT',
      data: {
        schedule,
      }
    }).then(({ data }) => {
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
      url: `${API_URL}/user/${userId}`,
      method: 'PUT',
      data: {
        meetings: data.userMeetings,
      }
    }).then(({ data }) => {
      dispatch(setUser(data.data));
      return data.data;
    });
    const partner = await axios({
      url: `${API_URL}/user/${partnerId}`,
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

export const scheduleTeamMeeting = async ({ teamId, meetings, dispatch }) => {
  try {
    const team = await axios({
      url: `${API_URL}/team/${teamId}`,
      method: 'PUT',
      data: {
        meetings,
      }
    }).then(({ data }) => {
      dispatch(setTeam(data.data));
      return data.data;
    });
    return team;
  } catch (error) {
    dispatch(setError(error));
    return null;
  }
}
