import React, { useEffect, useRef, useState } from 'react';
import Style from './Quize.module.css';
import { useParams } from 'react-router-dom';
import {
  getQuizDetailbyid,
  setImpressions,
  setupAnalytics,
} from '../../api/quiz';
import winner from '../../assets/winner.png';
const Quize = () => {
  const [quizDetail, setQuizDetail] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectOption, setSelectoption] = useState(null);
  const [isQuizcompleted, setIsQuizcompleted] = useState(false);
  const [totalAns, setTotalAns] = useState(0);
  const [ansArray, setAnsArray] = useState([]);
  const [countTimer, setCountTimer] = useState(null);
  const { id } = useParams();
  const timerId = useRef();
  useEffect(() => {
    getDetailsquize();
  }, []);
  //setting up quiz id for immpressions
  useEffect(() => {
    if (quizDetail?._id) setImpressions(quizDetail?._id);
  }, [quizDetail]);

  //setting of timer
  useEffect(() => {
    if (quizDetail?.timer === 'off') return;
    if (quizDetail?.timer) {
      if (quizDetail?.timer === '5sec') {
        setCountTimer(5);
      } else if (quizDetail?.timer === '10sec') {
        setCountTimer(10);
      } else {
        setCountTimer(0);
      }
    }

    timerId.current = setInterval(() => {
      setCountTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId.current);
  }, [quizDetail, currentSlide]);
  //handelling for if timer gets zero
  useEffect(() => {
    if (quizDetail?.timer === 'off') return;
    if (countTimer === 0 || countTimer < 0) {
      clearInterval(timerId.current);
      if (currentSlide < quizDetail?.slides?.length - 1) {
        setupAnalytics(id, currentSlide, selectOption);
        setCurrentSlide((prev) => prev + 1);
        setSelectoption(null);
      }
      if (countTimer === 0 && currentSlide === quizDetail?.slides?.length - 1) {
        if (!isQuizcompleted) {
          submitHandeler();
        }
      }
    }
  }, [countTimer]);

  const getDetailsquize = async () => {
    const res = await getQuizDetailbyid(id);
    setQuizDetail(res.quiz);
    setAnsArray(Array(res?.quiz?.slides?.length).fill('null'));

    //set impressions
  };
  const nextHandeler = async () => {
    if (currentSlide < quizDetail?.slides?.length - 1) {
      setCurrentSlide((prev) => prev + 1);
      await setupAnalytics(id, currentSlide, selectOption);
    }
    setSelectoption(null);
  };

  const optionClick = (index) => {
    setSelectoption(index);
    //Aborting if quize is a polltype
    if (quizDetail?.quizeType !== 'Q&A') {
      return;
    }
    const ans = Number(quizDetail?.slides[currentSlide]?.answer);
    if (ansArray[currentSlide] !== 'null' && ansArray[currentSlide] === index) {
      return;
    }
    if (ansArray[currentSlide] !== 'null' && ansArray[currentSlide] !== index) {
      setTotalAns((prev) => prev - 1);
      setAnsArray((prev) => {
        const upd = [...prev];
        upd[currentSlide] = 'null';
        return upd;
      });
      return;
    }
    if (ans === index) {
      setTotalAns((prev) => prev + 1);
      setAnsArray((prev) => {
        const upd = [...prev];

        upd[currentSlide] = index;
        return upd;
      });
    }
  };

  const submitHandeler = () => {
    setIsQuizcompleted(true);
    setupAnalytics(id, currentSlide, selectOption);
  };
  const questionDiv = () => {};
  return (
    <div className={Style.mainContainer}>
      {isQuizcompleted ? (
        <div className={Style.successContainer}>
          {quizDetail?.quizeType !== 'Q&A' ? (
            <div className={Style.pollDiv}>
              <span className={Style.pollSuccess}>
                Thank you for participating in the Poll
              </span>
            </div>
          ) : (
            <>
              <h1>Congrats Quiz is completed</h1>
              <img className={Style.winImg} src={winner} alt="" />
              <p>
                Your score is{' '}
                <span style={{ color: 'green' }}>
                  {`0${totalAns}`}/{`0${quizDetail?.slides?.length}`}
                </span>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className={Style.container}>
          <div
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            className={Style.slides}
          >
            {quizDetail?.slides?.map((quizslide, idx) => {
              return (
                <div key={idx} className={Style.questionDiv}>
                  <span className={Style.slidNo}>
                    0{idx + 1}/0{quizDetail?.slides?.length}
                  </span>

                  <div className={Style.quizes}>
                    {quizDetail?.quizeType === 'Q&A' &&
                      quizDetail.timer !== 'off' && (
                        <span className={Style.countDown}>
                          00:{countTimer}s
                        </span>
                      )}

                    <p>{quizslide?.question}</p>
                    <div className={Style.optionDiv}>
                      {quizslide?.type === 'imageurl' && (
                        <>
                          {quizslide?.options?.map((option, idx) => {
                            return (
                              <div
                                style={{
                                  border:
                                    selectOption === idx
                                      ? '3px solid blue'
                                      : '',
                                  boxSizing: 'border-box',
                                }}
                                onClick={() => optionClick(idx)}
                                key={idx}
                                className={Style.imgOption}
                              >
                                <img src={option} alt="" />
                              </div>
                            );
                          })}
                        </>
                      )}
                      {quizslide?.type === 'text' && (
                        <>
                          {quizslide?.options?.map((option, idx) => {
                            return (
                              <div
                                style={{
                                  border:
                                    selectOption === idx
                                      ? '3px solid blue'
                                      : '',
                                  boxSizing: 'border-box',
                                }}
                                onClick={() => optionClick(idx)}
                                className={Style.textOption}
                                key={idx}
                              >
                                {option}
                              </div>
                            );
                          })}
                        </>
                      )}
                      {quizslide?.type === 'text&image' && (
                        <>
                          {quizslide?.options?.map((option, idx) => {
                            return (
                              <div
                                style={{
                                  border:
                                    selectOption === idx
                                      ? '3px solid blue'
                                      : '',
                                  boxSizing: 'border-box',
                                }}
                                onClick={() => optionClick(idx)}
                                key={idx}
                                className={Style.texImage}
                              >
                                <p>{option?.text}</p>
                                <img src={option?.imgUrl} alt="" />
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {currentSlide !== quizDetail?.slides?.length - 1 ? (
            <button className={Style.nextBtn} onClick={nextHandeler}>
              Next
            </button>
          ) : (
            <button className={Style.nextBtn} onClick={submitHandeler}>
              Submit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quize;
