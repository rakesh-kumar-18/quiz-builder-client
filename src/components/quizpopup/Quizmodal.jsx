import React, { useContext, useState } from 'react';
import Style from './Quizmodal.module.css';
import Quizform from '../quizform/Quizform';
import { quizContext } from '../../Quizcontext';
const Quizmodal = ({ isQuizmodalopen, setisQuizmodalopen }) => {
  const { isOpen, setisOpen } = useContext(quizContext);
  // const [] = useState(true);
  const [quizeDetail, setQuizedetail] = useState({
    quizeName: '',
    quizeType: '',
  });

  const [err, setErr] = useState('');

  const cancelclick = () => {
    setisQuizmodalopen(false);
  };

  const continueClick = () => {
    if (
      quizeDetail.quizeName.trim() === '' ||
      quizeDetail.quizeType.trim() === ''
    ) {
      setErr('All fields are required ');
      return;
    }
    setisOpen(false);
  };
  const quiztypehandel = (type) => {
    setQuizedetail((prev) => ({ ...prev, quizeType: type }));
  };
  return (
    <div className={Style.mainContainer}>
      {isOpen ? (
        <div className={Style.container}>
          <input
            type="text"
            placeholder="Qiuz name"
            value={quizeDetail.quizeName}
            onChange={(e) =>
              setQuizedetail((prev) => ({ ...prev, quizeName: e.target.value }))
            }
          />
          <div className={Style.buttons}>
            <p>Quize type</p>
            <button
              style={{
                background: quizeDetail.quizeType === 'Q&A' ? 'green' : '',
              }}
              onClick={() => quiztypehandel('Q&A')}
            >
              Q&A
            </button>
            <button
              style={{
                background:
                  quizeDetail.quizeType === 'poll Type' ? 'green' : '',
              }}
              onClick={() => quiztypehandel('poll Type')}
            >
              Poll Type
            </button>
          </div>
          <div className={Style.cancelCont}>
            <button className={Style.btnChip} onClick={cancelclick}>
              cancel
            </button>
            <button
              style={{ background: 'rgba(96, 184, 75, 1)', color: 'white' }}
              className={Style.btnChip}
              onClick={continueClick}
            >
              continue
            </button>
          </div>
          {err ? <span style={{ color: 'red' }}>{err}</span> : ''}
        </div>
      ) : (
        <Quizform
          quizeDetail={quizeDetail}
          setisQuizmodalopen={setisQuizmodalopen}
          setQuizedetail={setQuizedetail}
        />
      )}
    </div>
  );
};

export default Quizmodal;
