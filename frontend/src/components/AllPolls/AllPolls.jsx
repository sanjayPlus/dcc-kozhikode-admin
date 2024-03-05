import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { toast } from 'react-hot-toast';

function AllPolls() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [name, setName] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    axios
      .get(`${SERVER_URL}/admin/protected`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200) {
           
            axios
                .get(`${SERVER_URL}/admin/poll`)
                .then((res) => {
                setPolls(res.data);
                })
                .catch((err) => {
                
                console.log(err);
                });
        }else{
            
            localStorage.removeItem("token");
            navigate("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);
const handleDelete = (id) => {
    axios
      .delete(`${SERVER_URL}/admin/poll/${id}`,{
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Poll Deleted Successfully");
          setPolls(polls.filter((poll) => poll._id !== id));
        }
      })
      .catch((err) => {
        console.log(err);
      });
}

  return (
    <>
      <div className="main-wrapper">
        <SideBar />
        <div className="page-wrapper">
          <NavBar name={name} setName={setName} link="all-polls" />
          <div className="page-content">
            <div className="row">
            {polls.map((poll, index) => (
                <>
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                <div className="order-container">
                    <div className="order-cards-container">
                
                        <div className="order-card" key={index}>
                          
                          <div className="order-card-right">
                            <div className="order-card-shipping">
                              <h2 className="m-3">{poll.title}</h2>
                              <ul>
                                    {poll.options.map((option)=>(<>
                                <li>
                                    <p>Option: {option.option}</p>
                                    <p>Votes : {option.votes}</p>
                                    <p>Percentage: {option.percentage}</p>
                                        
                                </li>
                                    </>))}
                              </ul>
                              
                            
                            </div>
                            <div className="order-card-button m-5">
                              <button className="btn btn-danger" onClick={() => handleDelete(poll._id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                          
                        </div>
                    </div>
                  </div>
                 
                </div>
              </div>
              </>
            ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AllPolls;
