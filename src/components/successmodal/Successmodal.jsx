import { useContext, useEffect, useState } from 'react';
import Style from './successmodal.module.css';
import { quizContext } from '../../Quizcontext';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Successmodal = () => {
  const { setSuccessModal, setisOpen, documentId } = useContext(quizContext);
  const [inputVlaue, setInputValue] = useState();
  const shareClick = async () => {
    try {
      await navigator.clipboard.writeText(inputVlaue);
      toast.success('Link copied Successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelHandeler = () => {
    setSuccessModal(false);
    setisOpen(true);
  };
  useEffect(() => {
    if (documentId) handleCopyBaseUrl();
  }, []);
  const handleCopyBaseUrl = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}/quiz/${documentId}`;
    setInputValue(baseUrl);
  };

  return (
    <div className={Style.mainContainer}>
      <div className={Style.container}>
        <h1 className={Style.header}>Congrats your Quiz is Published!</h1>

        <div className={Style.shareBtn}>
          <input type="text" value={inputVlaue} />
          <button onClick={shareClick}>share</button>
        </div>

        <span className={Style.spanCross} onClick={cancelHandeler}>
          x
        </span>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Successmodal;
