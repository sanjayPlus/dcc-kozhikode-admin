import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function AddPoll() {
  const [poll, setPoll] = useState({
    title:"",
    options: [{
        option: "",
    }],
  });

  const navigate = useNavigate();

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
        if (res.status !== 200) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);



  const handleTitleChange = (e) => {
    setPoll({ ...poll, title: e.target.value });
  };

  const addOption = () => {
    setPoll({
      ...poll,
      options: [...poll.options, { option: "" }],
    });
  };

  const removeOption = (index) => {
    const updatedOptions = [...poll.options];
    updatedOptions.splice(index, 1);
    setPoll({
      ...poll,
      options: updatedOptions,
    });
  };

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...poll.options];
    updatedOptions[index].option = e.target.value;
    setPoll({
      ...poll,
      options: updatedOptions,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.post(`${SERVER_URL}/admin/poll`, {title:poll.title,options:poll.options}, {
      headers: { "x-access-token": token },
    }).then((res)=>{
        if(res.status===200 || res.status===201){
            toast.success("Poll added successfully");
            setPoll({
                title:"",
                options: [{
                    option: "",
                }],
              });
        }
        
    }).catch(()=>{
        toast.error("Something went wrong")
    })
    // Handle form submission logic
  };

  return (
    <>
      <div className="main-wrapper">
        <SideBar />
        <div className="page-wrapper">
          <NavBar />
          <div className="page-content">
            <div className="row">
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Add poll</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                    <div className="mb-3">
        <label htmlFor="pollName" className="form-label">
          Poll Title
        </label>
        <input
          type="text"
          className="form-control"
          id="poll"
          autoComplete="off"
          placeholder="Enter poll title"
          value={poll.title}
          onChange={handleTitleChange}
        />
      </div>

      <h6 className="mt-4 mb-3">Options</h6>
      {poll.options.map((option, index) => (
        <div key={index} className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Option ${index + 1}`}
            value={option.option}
            onChange={(e) => handleOptionChange(e, index)}
          />
          <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => removeOption(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-success mb-3" onClick={addOption}>
        Add Option
      </button>
                
                      <button
                        type="submit"
                        className="btn btn-primary me-2 m-2"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPoll;
