import { createContext, useEffect, useState } from 'react';

export const quizContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isOpen, setisOpen] = useState(true);
  const [updateData, setupdateData] = useState({});
  const [isedit, setIsedit] = useState(false);
  const [updateTimer, setUpdateTimer] = useState('off');
  const [deleteId, setdeleteId] = useState();
  const [deleteModal, setdeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [documentId, setDocumentId] = useState();
  const [deletDetect, setDeletDetect] = useState(false);
  const [editDetect, setEditDetect] = useState(false);
  return (
    <>
      <quizContext.Provider
        value={{
          isOpen,
          setisOpen,
          updateData,
          setupdateData,
          isedit,
          setIsedit,
          updateTimer,
          setUpdateTimer,
          deleteId,
          setdeleteId,
          deleteModal,
          setdeleteModal,
          successModal,
          setSuccessModal,
          documentId,
          setDocumentId,
          deletDetect,
          setDeletDetect,
          editDetect,
          setEditDetect,
        }}
      >
        {children}
      </quizContext.Provider>
    </>
  );
};
