import axios from "axios";
import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar"
import SERVER_URL from "../../config/SERVER_URL";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function AddDistrict() {
    const [District, setDistrict] = useState("");
    const [districtList, setDistrictList] = useState([]);
    const [change, setChange] = useState(false);
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
            if (res.status === 200) {
              axios
                .get(`${SERVER_URL}/admin/districtV3`, {
                  headers: { "x-access-token": token },
                })
                .then((userResponse) => {
                  if (userResponse.status === 200) {
                    setDistrictList(userResponse?.data);
                  }
                })
                .catch((err) => {
                  console.log(err.response.data);
                });
            }
          })
          .catch(() => {
            localStorage.removeItem("token");
            navigate("/login");
          });
    },[change, navigate])
   
    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(
            `${SERVER_URL}/admin/add-district`,
            { name:District },
            { headers: { "x-access-token": localStorage.getItem("token") } }
            )
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                setChange(!change);
                setDistrict("");
            }
            })
            .catch((err) => {
            console.log(err.response.data);
            });
    }
   const handleDelete =(name)=>{
    axios
    .post(
      `${SERVER_URL}/admin/delete-district`,{
        name:name
      },
      { headers: { "x-access-token": localStorage.getItem("token") } }
    )
    .then((res) => {
      if (res.status === 200) {
        setDistrictList(districtList?.filter((product) => product !== name));
      }
    })
    .catch((err) => {
      console.log(err.response.data);
    });
   }
  return (
    <div className="main-wrapper">
    <SideBar />
    <div className="page-wrapper">
      <NavBar />
      <div className="page-content">
        <div className="row">
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Add District</h6>
                <form className="forms-sample" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="DistrictName" className="form-label">
                      District Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="District"
                      autoComplete="off"
                      placeholder="District"
                      name="District"
                      value={District}
                      onChange={(e)=>setDistrict(e.target.value)}
                    />
                  </div>
            
        

                  
                  <button
                    type="submit"
                    className="btn btn-primary me-2 m-2"
                  >
                    Submit
                  </button>
                </form>
                <div className="table-responsive">
                      <table id="dataTableExample" className="table">
                        <thead>
                          <tr>
                            <th>District</th>
                            {/* <th>Edit</th> */}
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {districtList?.map((dis) => (
                            <tr key="">
                              <th>{dis}</th>
                          
                              

                             
                              {/* <th>
                                <p
                                  className="btn btn-primary"
                                  onClick={() =>
                                    navigate("/edit-product/" + product._id)
                                  }
                                >
                                  Edit
                                </p>
                              </th> */}
                              <th>
                                <p
                                  className="btn btn-danger"
                                    onClick={()=>handleDelete(dis)}
                                >
                                  Delete
                                </p>
                              </th>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AddDistrict
