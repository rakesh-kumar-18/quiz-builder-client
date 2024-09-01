/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import Style from './Analytics.module.css';
import { getAllquizes, getQuizbyid } from '../../api/quiz';
import { quizContext } from '../../Quizcontext';
import edImg from '../../assets/edit.svg';
import delImg from '../../assets/delete.svg';
import shImg from '../../assets/share.svg';
import QnAnalysis from '../questionAnalysis/QnAnalysis';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Analytics = ({ setisQuizmodalopen }) => {
  const [allquzizedata, setAllquizedata] = useState([]);
  const [isQnAnalysis, setIsQnAnalysis] = useState(false);
  const [qnId, setQnId] = useState();
  const {
    setisOpen,
    setupdateData,
    setIsedit,
    updateData,
    setUpdateTimer,
    setdeleteId,
    setdeleteModal,
    deletDetect,
    editDetect,
  } = useContext(quizContext);
  useEffect(() => {
    setupQuizedata();
  }, [deletDetect, editDetect]);

  const setupQuizedata = async () => {
    const quizeData = await getAllquizes();
    //formating the dates
    const formattedQuizeData = quizeData.map((data) => ({
      ...data,
      dateCreated: formatDate(data.dateCreated),
    }));
    setAllquizedata(formattedQuizeData);
  };

  const formatDate = (dateString) => {
    const newDate = new Date(dateString);
    const option = { day: '2-digit', month: 'long', year: 'numeric' };
    return newDate.toLocaleDateString('en-US', option);
  };
  const updateHandeler = async (id) => {
    setisQuizmodalopen(true);
    setisOpen(false);
    setIsedit(true);
    const dataSlide = await getQuizbyid(id);

    setupdateData(dataSlide);
    setUpdateTimer(dataSlide.timer);
  };
  const deleteHandeler = async (id) => {
    setdeleteId(id);
    setdeleteModal(true);
  };
  const shareHandeler = async (id) => {
    const baseUrl = `${window.location.protocol}//${window.location.host}/quiz/${id}`;
    try {
      await navigator.clipboard.writeText(baseUrl);
      toast.success('Link copied to clipboard', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Slide,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const analysisClick = (data) => {
    setQnId(data._id);
    setIsQnAnalysis(true);
  };

  return (
    <>
      {isQnAnalysis !== true ? (
        <div className={Style.container}>
          <h1 className={Style.heading}>Quiz Analysis</h1>
          <div className={Style.detailContainer}>
            <div className={Style.detailNav}>
              <span>Sl.No</span> <span>Quiz Name</span> <span>Created on</span>{' '}
              <span>impression</span>{' '}
            </div>
            {allquzizedata?.map((data, index) => {
              return (
                <div
                  key={index}
                  style={{
                    background:
                      index % 2 === 0 ? 'white' : 'rgba(179, 196, 255, 1)',
                  }}
                  className={Style.quizeDetail}
                >
                  <span className={Style.span1}>{index + 1}</span>
                  <span className={Style.span2}>{data.quizeName}</span>
                  <span className={Style.span3}>{data.dateCreated}</span>
                  <span className={Style.span4}>{data.impressionCount}</span>
                  <div className={Style.quizFunc}>
                    <span onClick={() => updateHandeler(data._id)}>
                      <img src={edImg} />
                    </span>
                    <span onClick={() => deleteHandeler(data._id)}>
                      <img src={delImg} />
                    </span>
                    <span onClick={() => shareHandeler(data._id)}>
                      <img src={shImg} />
                    </span>
                  </div>
                  <span
                    onClick={() => analysisClick(data)}
                    className={Style.qnAnalysis}
                  >
                    <u style={{ width: '10rem', fontSize: '14px' }}>
                      Question Wise Analysis
                    </u>
                  </span>
                </div>
              );
            })}
          </div>
          <ToastContainer />
        </div>
      ) : (
        <QnAnalysis qnId={qnId} />
      )}
    </>
  );
};

export default Analytics;
