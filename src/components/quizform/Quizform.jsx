/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react';
import Style from './Quizform.module.css';
import Form from '../form/Form';
import { createQuize, editQuiz } from '../../api/quiz';
import { quizContext } from '../../Quizcontext';
// import { ToastContainer, toast,Bounce } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
const Quizform = ({ quizeDetail, setQuizedetail, setisQuizmodalopen }) => {
  const [slides, setSlides] = useState([
    { question: '', type: 'text', options: ['', ''], answer: '' },
  ]);
  const {
    updateData,
    setIsedit,
    isedit,
    updateTimer,
    setisOpen,
    successModal,
    setSuccessModal,
    setDocumentId,
    editDetect,
    setEditDetect,
  } = useContext(quizContext);

  const [timer, setTimer] = useState('off');
  const [timerIndex, setTimerIndex] = useState(0);
  const [curindex, setCurindex] = useState(0);
  const [err, setErr] = useState();

  useEffect(() => {
    if (isedit) {
      setSlides(updateData.slides);
      setQuizedetail((prev) => ({ ...prev, quizeType: updateData.quizeType }));
      if (updateTimer === '5sec') {
        setTimerIndex(1);
      } else if (updateTimer === '10sec') {
        setTimerIndex(2);
      } else {
        setTimerIndex(0);
      }
      setTimer(updateTimer);
    } else {
      return;
    }
  }, [updateData]);

  //setting up the current index

  useEffect(() => {
    setCurindex(slides?.length - 1);
  }, [slides?.length]);

  const editQuizhandel = async () => {
    const id = updateData._id;
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].question === '') {
        setErr('All quize fields are required');
        return;
      }
      if (quizeDetail?.quizeType === 'Q&A' && slides[i].answer === '') {
        setErr('Answer fields are required');
        return;
      }
      if (slides[i]?.type !== 'text&image') {
        for (let j = 0; j < slides[i]?.options?.length; j++) {
          if (slides[i]?.options[j] === '') {
            setErr('All option field required');
            return;
          }
        }
      } else {
        for (let j = 0; j < slides[i]?.options?.length; j++) {
          if (
            slides[i]?.options[j]?.text === '' ||
            slides[i]?.options[j]?.imgUrl === '' ||
            slides[i]?.options[j] === '' ||
            Object.keys(slides[i]?.options[j])?.length < 2
          ) {
            setErr('All option field of img&url required');
            return;
          }
        }
      }
    }
    setErr('');
    await editQuiz(id, slides, timer);
    setEditDetect(!editDetect);
    setisQuizmodalopen(false);
  };
  const timerHandeler = (idx, time) => {
    setTimerIndex(idx);
    if (time !== '') {
      setTimer(() => time);
    } else {
      setTimer('off');
    }
  };
  const addSlidehandeler = () => {
    if (slides.length <= 4) {
      setSlides((prev) => [
        ...prev,
        {
          question: '',
          type: prev[slides.length - 1].type,
          options: ['', ''],
          answer: '',
        },
      ]);
      setCurindex(slides.length);
    } else {
      return;
    }
  };
  const deletHandeler = (idx) => {
    if (slides.length > 1) {
      setSlides((prev) => {
        const updatedSlide = [...prev];
        updatedSlide.splice(idx, 1);
        return updatedSlide;
      });

      setCurindex(0);
    } else {
      return;
    }
  };

  const cancelModalhandler = () => {
    setisQuizmodalopen(false);
    setIsedit(false);
    setisOpen(true);
  };
  const createQuizehandle = async () => {
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].question === '') {
        setErr('All quize fields are required');
        return;
      }
      if (quizeDetail?.quizeType === 'Q&A' && slides[i].answer === '') {
        setErr('Answer fields are required');
        return;
      }
      if (slides[i]?.type !== 'text&image') {
        for (let j = 0; j < slides[i]?.options?.length; j++) {
          if (slides[i]?.options[j] === '') {
            setErr('All option field required');
            return;
          }
        }
      } else {
        for (let j = 0; j < slides[i]?.options?.length; j++) {
          if (
            slides[i]?.options[j]?.text === '' ||
            slides[i]?.options[j]?.imgUrl === '' ||
            slides[i]?.options[j] === '' ||
            Object.keys(slides[i]?.options[j])?.length < 2
          ) {
            setErr('All option field of img&url required');
            return;
          }
        }
      }
    }

    setErr('');
    //setting up analytics
    let quizAnalytic = [];
    if (quizeDetail?.quizeType === 'Q&A') {
      quizAnalytic = slides?.map(() => ({ attempts: 0, correctAnswer: 0 }));
    } else {
      quizAnalytic = slides?.map((slide) => ({
        options: slide?.options?.map(() => ({ count: 0 })),
      }));
    }

    //---------------------

    const res = await createQuize(quizeDetail, timer, slides, quizAnalytic);
    if (res === 400) {
      console.log(res);
      return;
    }

    setSuccessModal(true);
    setisQuizmodalopen(false);
    setDocumentId(res.documentId);
  };

  return (
    <div className={Style.container}>
      <div className={Style.chipsDiv}>
        {slides?.map((_, index) => (
          <React.Fragment key={index + 6}>
            <div
              style={{ border: index === curindex ? '1px solid gray' : '' }}
              onClick={() => setCurindex(index)}
              key={index}
              className={Style.chip}
            >
              {index}
              {index >= 1 ? (
                <span
                  onClick={!isedit ? () => deletHandeler(index) : null}
                  className={Style.crossButton}
                  style={{
                    cursor: isedit ? 'not-allowed' : 'pointer',
                    opacity: isedit ? 0.5 : 1,
                  }}
                >
                  x
                </span>
              ) : (
                ''
              )}
            </div>
          </React.Fragment>
        ))}
        <div
          onClick={!isedit ? addSlidehandeler : null}
          style={{
            fontSize: '43px',
            cursor: isedit ? 'not-allowed' : 'pointer',
            opacity: isedit ? 0.5 : 1,
          }}
        >
          +
        </div>
      </div>
      {/* mapping the forms */}
      {slides?.map((slide, index) => (
        <React.Fragment key={index}>
          {curindex === index && (
            <Form
              slide={slide}
              setSlides={setSlides}
              curindex={curindex}
              quizeType={quizeDetail.quizeType}
            />
          )}
        </React.Fragment>
      ))}

      {/* timer div */}
      {quizeDetail?.quizeType === 'Q&A' && (
        <div className={Style.timerDiv}>
          <p>Timer</p>
          <span
            style={{
              backgroundColor: timerIndex === 0 ? 'red' : '',
              color: timerIndex === 0 ? 'white' : 'rgba(159, 159, 159, 1)',
            }}
            onClick={() => timerHandeler(0, '')}
          >
            off
          </span>
          <span
            style={{
              backgroundColor: timerIndex === 1 ? 'red' : '',
              color: timerIndex === 1 ? 'white' : 'rgba(159, 159, 159, 1)',
            }}
            onClick={() => timerHandeler(1, '5sec')}
          >
            5sec
          </span>
          <span
            style={{
              backgroundColor: timerIndex === 2 ? 'red' : '',
              color: timerIndex === 2 ? 'white' : 'rgba(159, 159, 159, 1)',
            }}
            onClick={() => timerHandeler(2, '10sec')}
          >
            10sec
          </span>
        </div>
      )}

      {/* creating cancel and submit button  */}

      <div className={Style.footerButton}>
        <button
          onClick={cancelModalhandler}
          style={{ backgroundColor: 'white', color: 'black' }}
        >
          cancel
        </button>

        {isedit ? (
          <button
            onClick={editQuizhandel}
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            Edit Quiz
          </button>
        ) : (
          <button
            onClick={createQuizehandle}
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            Create Quiz
          </button>
        )}
      </div>
      {err ? (
        <span
          style={{
            color: 'red',
            position: 'absolute',
            bottom: '5px',
            right: '36%',
          }}
        >
          {err}
        </span>
      ) : (
        ''
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Quizform;
