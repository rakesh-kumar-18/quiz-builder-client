import React, { useEffect, useState } from 'react';
import { getQuizDetailbyid } from '../../api/quiz';
import Style from './QnAnalysis.module.css';
const QnAnalysis = ({ qnId }) => {
  const [questionData, setQuestionData] = useState({});
  useEffect(() => {
    setQnData();
  }, []);
  const setQnData = async () => {
    const res = await getQuizDetailbyid(qnId);
    setQuestionData(res?.quiz);
  };
  const formatDate = (dateString) => {
    const newDate = new Date(dateString);
    const option = { day: '2-digit', month: 'long', year: 'numeric' };
    return newDate.toLocaleDateString('en-US', option);
  };
  return (
    <div className={Style.container}>
      <div className={Style.QAcontainer}>
        <div className={Style.hero}>
          {' '}
          <p>{questionData?.quizeName} Question Analysis</p>{' '}
          <div className={Style.dateDiv}>
            {' '}
            <span>
              Created on : {formatDate(questionData?.dateCreated)}
            </span>{' '}
            <span>Impressions : {questionData?.impressionCount}</span>
          </div>
        </div>

        {questionData?.slides?.map((slide, index) => {
          return (
            <div className={Style.qnchip}>
              <p>
                <span>Q.{index + 1} </span>
                {slide?.question} ?
              </p>
              {questionData?.quizeType === 'Q&A' ? (
                <div className={Style.analysis}>
                  <div className={Style.Qncard}>
                    <span style={{ fontSize: '2rem', fontWeight: '600' }}>
                      {questionData?.analytics[index]?.attempts}{' '}
                    </span>

                    <span style={{ fontWeight: '500' }}>
                      people Attempted the question
                    </span>
                  </div>
                  <div className={Style.Qncard}>
                    <span style={{ fontSize: '2rem', fontWeight: '600' }}>
                      {questionData?.analytics[index]?.correctAnswer}{' '}
                    </span>

                    <span style={{ fontWeight: '500' }}>
                      people Answered Correctly
                    </span>
                  </div>
                  <div className={Style.Qncard}>
                    <span style={{ fontSize: '2rem', fontWeight: '600' }}>
                      {questionData?.analytics[index]?.attempts -
                        questionData?.analytics[index]?.correctAnswer}
                    </span>

                    <span style={{ fontWeight: '500' }}>
                      people Answered Incorrectly
                    </span>
                  </div>
                </div>
              ) : (
                <div className={Style.analysis}>
                  {questionData?.analytics[index]?.options?.map(
                    (option, idx) => {
                      return (
                        <div className={Style.pollCard}>
                          <span
                            style={{ fontSize: '2rem', marginRight: '7px' }}
                          >
                            {option?.count}
                          </span>{' '}
                          option{idx + 1}
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              <hr
                style={{
                  color: 'rgba(215, 215, 215, 1)',
                  border: '1.5px solid',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QnAnalysis;
