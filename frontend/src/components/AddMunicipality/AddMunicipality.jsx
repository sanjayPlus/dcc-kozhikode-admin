import axios from "axios";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import SERVER_URL from "../../config/SERVER_URL";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function AddMunicipality() {
  const [Constituency, setConstituency] = useState("");
  const [ConstituencyList, setConstituencyList] = useState([]);

  const [districtList, setDistrictList] = useState([]);
  const [district, setDistrict] = useState("");
  const [assembly, setAssembly] = useState([]);
  const [assemblyList, setAssemblyList] = useState([]);
  const [Municipality, setMunicipality] = useState("");
  const [MunicipalityList, setMunicipalityList] = useState([]);
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
  }, [navigate]);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value; // Get the selected district from the event

    setDistrict(selectedDistrict); // Update the district state with the selected district

    axios
      .get(`${SERVER_URL}/admin/districtV3?district=${selectedDistrict}`, {
        // Use the updated district value
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((userResponse) => {
        if (userResponse.status === 200) {
          setConstituencyList(userResponse.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const handleConstituencyChange = (e) => {
    if (district == "") {
      toast.error("Select The District");
    }
    const selectedConstituency = e.target.value; // Get the selected district from the event

    setConstituency(selectedConstituency); // Update the district state with the selected district

    axios
      .get(
        `${SERVER_URL}/admin/districtV3?district=${district}&constituency=${selectedConstituency}`,
        {
          // Use the updated district value
          headers: { "x-access-token": localStorage.getItem("token") },
        }
      )
      .then((userResponse) => {
        if (userResponse.status === 200) {
          setAssemblyList(userResponse.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  const handleAssemblyChange = (e) => {
    if (district == "") {
      toast.error("Select The District");
    }
    if (Constituency == "") {
      toast.error("Select The Constituency");
    }
    const selectedAssembly = e.target.value; // Get the selected district from the event

    setAssembly(selectedAssembly); // Update the district state with the selected district

    axios
      .get(
        `${SERVER_URL}/admin/districtV4?district=${district}&constituency=${Constituency}&assembly=${selectedAssembly}&local=municipality`,
        {
          // Use the updated district value
          headers: { "x-access-token": localStorage.getItem("token") },
        }
      )
      .then((userResponse) => {
        if (userResponse.status === 200) {
          setMunicipalityList(userResponse.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //check the Constituency already exist in ConstinuencyList
    if (MunicipalityList?.includes(Municipality)) {
      toast.error("Municipality Already Exist");
      return;
    }
    if (district == "") {
      toast.error("Select The District");
    }
    if (Constituency == "") {
      toast.error("Select The Constituency");
    }
    if (assembly == "") {
      toast.error("Select The Assembly");
    }
    axios
      .post(
        `${SERVER_URL}/admin/add-municipality`,
        {
          name: Municipality,
          district: district,
          constituency: Constituency,
          assembly: assembly,
        },
        { headers: { "x-access-token": localStorage.getItem("token") } }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setMunicipalityList((prev) => [...prev, Municipality]);

          setMunicipality("");
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  const handleDelete = (name) => {
    if (district == "") {
      toast.error("Select The District");
    }
    if (Constituency == "") {
      toast.error("Select The Constituency");
    }
    if (assembly == "") {
      toast.error("Select The Assembly");
    }
    axios
      .post(
        `${SERVER_URL}/admin/delete-municipality`,
        {
          municipality: name,
          district: district,
          constituency: Constituency,
          assembly: assembly,
        },
        { headers: { "x-access-token": localStorage.getItem("token") } }
      )
      .then((res) => {
        if (res.status === 200) {
          setMunicipalityList(
            MunicipalityList?.filter((product) => product !== name)
          );
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

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
                  <h6 className="card-title">Add Municipality</h6>
                  <select className="form-control my-4" onChange={(e) => handleDistrictChange(e)}>
                    <option value="">Select District</option>
                    {districtList?.map((dis) => (
                      <option key={dis} value={dis}>
                        {dis}
                      </option>
                    ))}
                  </select>
                  <select  className="form-control my-4" onChange={(e) => handleConstituencyChange(e)}>
                    <option value="">Select Constituency</option>
                    {ConstituencyList?.map((dis) => (
                      <option key={dis} value={dis}>
                        {dis}
                      </option>
                    ))}
                  </select>
                  <select className="form-control my-4" onChange={(e) => handleAssemblyChange(e)}>
                    <option value="">Select Assembly</option>
                    {assemblyList?.map((dis) => (
                      <option key={dis} value={dis}>
                        {dis}
                      </option>
                    ))}
                  </select>

                  <form className="forms-sample" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="ConstituencyName" className="form-label">
                        Municipality Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Municipality"
                        autoComplete="off"
                        placeholder="Municipality"
                        name="Municipality"
                        value={Municipality}
                        onChange={(e) => setMunicipality(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary me-2 m-2">
                      Submit
                    </button>
                  </form>
                  <div className="table-responsive">
                    <table id="dataTableExample" className="table">
                      <thead>
                        <tr>
                          <th>Municipality</th>
                          {/* <th>Edit</th> */}
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MunicipalityList?.map((dis) => (
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
                                onClick={() => handleDelete(dis)}
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
  );
}

export default AddMunicipality;
