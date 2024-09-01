import React, { useContext } from 'react';
import Style from './Deletemodal.module.css';
import { quizContext } from '../../Quizcontext';
import { deleteQuize } from '../../api/quiz';
const Deletemodal = () => {
  const {
    deleteId,
    setdeleteId,
    deleteModal,
    setdeleteModal,
    deletDetect,
    setDeletDetect,
  } = useContext(quizContext);
  const deleteclick = async () => {
    await deleteQuize(deleteId);
    setDeletDetect(!deletDetect);
  };
  const cancelclick = () => {
    setdeleteModal(false);
  };
  return (
    <div className={Style.mainContainer}>
      <div className={Style.container}>
        <h1 className={Style.header}>Are you confirm you want to delete ?</h1>

        <div className={Style.cancelCont}>
          <button
            style={{ padding: '8px 24px', background: 'red', color: 'white' }}
            onClick={deleteclick}
          >
            Confirm Delete
          </button>
          <button onClick={cancelclick}>cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Deletemodal;
