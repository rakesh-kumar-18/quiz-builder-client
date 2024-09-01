import { useContext, useEffect, useState } from 'react';
import Style from './Dashboard.module.css';
import Quizmodal from '../../components/quizpopup/Quizmodal';
import Analytics from '../../components/analytics/Analytics';
import { quizContext } from '../../Quizcontext';
import Deletemodal from '../../components/deletemodal/Deletemodal';
import Successmodal from '../../components/successmodal/Successmodal';
import { getDataQuize, getTrendings } from '../../api/quiz';
import { IoEyeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const nav = useNavigate();
  const [toggle, setToggle] = useState();
  const [isQuizmodalopen, setisQuizmodalopen] = useState(false);
  const [navState, setnavState] = useState('Dashboard');
  const [dashBordData, setDashboardData] = useState({});
  const [trendingData, setTrendingData] = useState([]); //setting up the trendings
  const { deleteModal, successModal, setSuccessModal } =
    useContext(quizContext);

  useEffect(() => {
    const user = localStorage.getItem('userId');
    if (!user) {
      nav('/');
    } else {
      getDashboardData();
      const interval = setInterval(() => {
        getDashboardData();
      }, 5000); // Fetch data every 5 seconds

      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, []);

  //setting up the dashboard data
  const getDashboardData = async () => {
    const res = await getDataQuize();
    setDashboardData(res);
    trendingDatasetter();
  };

  const trendingDatasetter = async () => {
    const res = await getTrendings();
    setTrendingData(res?.trendQuiz);
  };

  const quizClickhandeler = () => {
    setisQuizmodalopen(true);
  };

  const dashboarHandeler = () => {
    setnavState('Dashboard');
  };

  const analyticsHandeler = () => {
    setnavState('Analytics');
  };

  const logoutHandeler = () => {
    localStorage.removeItem('userId');
    nav('/');
  };

  const formatDate = (dateString) => {
    const newDate = new Date(dateString);
    const option = { day: '2-digit', month: 'long', year: 'numeric' };
    return newDate.toLocaleDateString('en-US', option);
  };

  const formatImpression = (count) => {
    if (count === 1000) {
      return '1k';
    }
    if (count < 1000) {
      return count;
    }
    count /= 1000;
    count = count.toFixed(1);
    return count + 'K';
  };

  return (
    <>
      <div className={Style.mainContainer}>
        <div className={Style.sidebar}>
          <p className={Style.heding}>QUIZZIE</p>
          <div className={Style.dashboardChip}>
            <p
              className={navState === 'Dashboard' ? Style.liveChip : ''}
              style={{ cursor: 'pointer' }}
              onClick={dashboarHandeler}
            >
              Dashboard
            </p>
            <p
              className={navState === 'Analytics' ? Style.liveChip : ''}
              style={{ cursor: 'pointer' }}
              onClick={analyticsHandeler}
            >
              Analytics
            </p>
            <p style={{ cursor: 'pointer' }} onClick={quizClickhandeler}>
              CreateQuize
            </p>
          </div>
          <div className={Style.logOutdiv}>
            <hr />
            <span onClick={logoutHandeler}>Logout</span>
          </div>
        </div>
        <div className={Style.contenet}>
          {navState === 'Dashboard' ? (
            <div className={Style.dashboardContainer}>
              <div className={Style.dataContainer}>
                <div
                  className={Style.dataDiv}
                  style={{ color: 'rgba(255, 93, 1, 1)' }}
                >
                  <span className={Style.dataNumber}>
                    {dashBordData?.toalQuizeno ? dashBordData?.toalQuizeno : 0}
                  </span>{' '}
                  Quiz Created
                </div>
                <div
                  className={Style.dataDiv}
                  style={{ color: 'rgba(96, 184, 75, 1)' }}
                >
                  <span className={Style.dataNumber}>
                    {dashBordData?.totalQustions
                      ? dashBordData?.totalQustions
                      : 0}
                  </span>{' '}
                  Questions Created
                </div>
                <div
                  className={Style.dataDiv}
                  style={{ color: 'rgba(80, 118, 255, 1)' }}
                >
                  <span className={Style.dataNumber}>
                    {dashBordData?.totalImpression
                      ? formatImpression(dashBordData?.totalImpression)
                      : 0}
                  </span>{' '}
                  Total Impressions
                </div>
              </div>
              <div className={Style.trendingQuize}>
                <h1>Trending Quizs</h1>
                <div className={Style.trendingContainer}>
                  {trendingData?.map((trend, idx) => {
                    return (
                      <div className={Style.chipCard} key={idx}>
                        <div className={Style.chipHero}>
                          {' '}
                          <span
                            style={{ fontWeight: '700', fontSize: '1.7rem' }}
                          >
                            {trend.quizeName}
                          </span>
                          <span
                            style={{
                              fontSize: '1.3rem',
                              fontWeight: '600',
                              color: 'rgba(255, 93, 1, 1)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {trend.impressionCount}
                            <IoEyeOutline style={{ marginLeft: '10px' }} />
                          </span>
                        </div>

                        <span className={Style.crreated}>
                          created on: {formatDate(trend.dateCreated)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <Analytics setisQuizmodalopen={setisQuizmodalopen} />
          )}
        </div>
        {/* adding modals */}
        {isQuizmodalopen ? (
          <Quizmodal
            isQuizmodalopen={isQuizmodalopen}
            setisQuizmodalopen={setisQuizmodalopen}
          />
        ) : (
          ''
        )}
        {/* adding delete modal */}
        {deleteModal ? <Deletemodal /> : ''}
        {/* adding success modal if quize created */}
        {successModal ? <Successmodal /> : ''}
      </div>
    </>
  );
};

export default Dashboard;
