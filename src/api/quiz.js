import axios from 'axios';
const staticUrl = 'https://quiz-builder-server.onrender.com';

export const createQuize = async (
  { quizeName, quizeType },
  timer,
  slides,
  quizAnalytic,
) => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const res = await axios.post(`${staticUrl}/api/v1/quize/createQuiz`, {
      quizeName,
      quizeType,
      slides,
      timer,
      quizAnalytic,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    return 400;
  }
};

export const getAllquizes = async () => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const res = await axios.get(`${staticUrl}/api/v1/quize/getAllquize`);
    return res.data.quizes;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizbyid = async (id) => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const res = await axios.get(`${staticUrl}/api/v1/quize/getQuizebyid/${id}`);
    return res.data.quizSlide;
  } catch (error) {
    console.log(error);
  }
};

export const editQuiz = async (id, slides, timer) => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const res = await axios.patch(
      `${staticUrl}/api/v1/quize/updateQuize/${id}`,
      { slides, timer },
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuize = async (id) => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const res = await axios.delete(
      `${staticUrl}/api/v1/quize/deleteQuize/${id}`,
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
//getting the details of the quize
export const getQuizDetailbyid = async (id) => {
  try {
    const res = await axios.get(
      `${staticUrl}/api/v1/quize/getQuizeDetailbyid/${id}`,
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//getting the datas of qiuzes for designing dashboard component
export const getDataQuize = async () => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const res = await axios.get(`${staticUrl}/api/v1/quize/getAllquizeData`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//setting up the impression counts of quizes

export const setImpressions = async (id) => {
  try {
    const res = await axios.patch(
      `${staticUrl}/api/v1/quize/setImpressins/${id}`,
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTrendings = async () => {
  try {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    const res = await axios.get(`${staticUrl}/api/v1/quize/getTrendingQuize`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// counting the analytics

export const setupAnalytics = async (id, cur, optionIdx) => {
  try {
    await axios.put(`${staticUrl}/api/v1/quize/setAnalytics/${id}`, {
      cur,
      optionIdx,
    });
  } catch (error) {
    console.log(error);
  }
};
