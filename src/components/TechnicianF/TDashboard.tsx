import React from "react";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const userInfoString = localStorage.getItem("userInfo") || "{}";
const userInfo: any = JSON.parse(userInfoString);

export const TDashboard = () => {
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState(""); // default value
  const [inProgressJobs, setInProgressJobs] = useState(""); // default value
  const [pendingJobs, setPendingJobs] = useState(""); // default value
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [otp,setOtp] = useState('')
  const [verify,setVerify] = useState<any>('')
  const [customer,setCustomer]=useState<any>(null)

  useEffect(() => {
    fetchOngoingJob();
    fetchJobCount();
  }, []);

  const fetchOngoingJob = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8088/jobRequestRoutes/ongoingjob",
        { user: userInfo._id }
      );
      const fetchedJobs = Array.isArray(response.data.job)
        ? response.data.job
        : [];
      setOngoingJobs(fetchedJobs);
    } catch (error) {
      console.log(error);
    }
  };
  //complete job request
  const handleComplete = async (job: any) => {
    try {
      setCustomer(job);
      setShowCompleteForm(true);
      const response = await axios.put(
        "http://localhost:8088/jobRequestRoutes/confirmationjobrequest",
        {
          custId: job.customerId,
        }
      );
      console.log(response.data)
      setVerify(response.data.otp)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (verify) {
      console.log("Updated verify state:", verify);
    }
  }, [verify]);


  const handleCancel = () => {
    setVerify(null)
    setShowCompleteForm(false)
  };
  
  const handleFormSubmit = async (event: any) => {
   event.preventDefault();
    try{
      if(otp == verify){
        console.log("otp is correct")
        const response = await axios.put('http://localhost:8088/jobRequestRoutes/completejobrequest',{
          id:customer._id,
        })
        setShowCompleteForm(false);
        window.location.reload();
      }
     else{
      alert('Entered Otp Is Incorrect')
     }
    }
    catch(error){
      console.log(error);
    }
  };
  //decline the job request
  const handleCancelJob = async (job: any) => {
    try {
      const response = await axios.put(
        "http://localhost:8088/jobRequestRoutes/canceljobrequest",{ 
          custId: job.customerId ,
          id:job._id
        }
      );
      // console.log(response.data)
      window.location.reload();
      // fetchOngoingJob()
    } catch (error) {
      console.log(error);
    }
  };
  //count of job request
  const fetchJobCount = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8088/jobRequestRoutes/countjob",
        { servicerId: userInfo._id }
      );
      console.log(response.data);
      setCompletedJobs(response.data.complete);
      setInProgressJobs(response.data.progress);
      setPendingJobs(response.data.pending);
    } catch (error) {
      console.log(error);
    }
  };
  const chartData = {
    labels: ["In Progress", "Pending", "Completed"],
    datasets: [
      {
        label: "Jobs",
        data: [inProgressJobs, pendingJobs, completedJobs],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: ["none", "none", "none"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <div className="dashboard-boxes">
        <h2>Locos</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <div>
              <p>Total Jobs</p>
              <h3>In-Progress</h3>
            </div>
            <span>{inProgressJobs}</span>
          </div>
          <div className="stat-box">
            <div>
              <p>Total Jobs</p>
              <h3>Pending</h3>
            </div>
            <span>{pendingJobs}</span>
          </div>
          <div className="stat-box">
            <div>
              <p>Total Jobs </p>
              <h3>Finished</h3>
            </div>
            <span>{completedJobs}</span>
          </div>
        </div>
      </div>
      <div className="techdash">
        <h3>Ongoing Works</h3>
        <div className="tech-ongoing-works">
          <ul className="tech-ongoing-jobs-list">
            {/* {ongoingJobs.length === 0 ? (
            <p>No Ongoing Jobs Found</p>
             ) : ( */}
            {Array.isArray(ongoingJobs) && ongoingJobs.length === 0 ? (
              <p>No Ongoing Jobs Found</p>
            ) : (
              ongoingJobs.map((job: any) => (
                <li key={job.id} className="ongoing-job-item">
                  <h4>{job.service}</h4>
                  <p>Provider: {job.customerName}</p>
                  <p>
                    Date:{" "}
                    {new Date(job.bookingDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>Status: {job.status}</p>
                  <button
                    className="btn btn-dark"
                    style={{ marginRight: "20px" }}
                    onClick={() => handleCancelJob(job)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => handleComplete(job)}
                  >
                    Complete
                  </button>
                  {showCompleteForm && (
                    <div className="modal" style={{ display: "block" }}>
                      <center><form onSubmit={handleFormSubmit} className="complete-form">
                        {/* Form fields go here */}
                        <label htmlFor="">Enter OTP</label><br /><br />
                        <input
                          type="text"
                          className="form-control"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        /> <br />
                        <button type="button" className="btn btn-dark" onClick={() =>handleCancel() } style={{ marginRight: "20px" }}>Cancel</button>
                        <button type="submit" className="btn btn-dark">Submit</button>
                      </form></center>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <div className="tech-chart-container">
        <Bar data={chartData} />
      </div>
    </>
  );
};
