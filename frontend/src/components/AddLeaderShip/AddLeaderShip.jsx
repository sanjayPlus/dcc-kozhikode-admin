import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddLeaderShip() {
  const [leaderShip, setLeaderShip] = useState({
    name: "",
    postion: "",
    address: "",
    phone: [],
    email: [],
    image: null,
    category: "",
    link: "",
  });
  const [leadershipList, setLeadershipList] = useState([]);
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
          axios.get(`${SERVER_URL}/admin/leadership`).then((res) => {
            if (res.status === 200) {
              setLeadershipList(res.data);
            }
          });
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "email") {
      // If it's phone or email, update the corresponding array
      setLeaderShip((prevLeaderShip) => ({
        ...prevLeaderShip,
        [name]: [...prevLeaderShip[name], value],
      }));
    } else {
      // Otherwise, update as usual
      setLeaderShip((prevLeaderShip) => ({
        ...prevLeaderShip,
        [name]: value,
      }));
    }
  };
  const handleAddArrayItem = (type) => {
    setLeaderShip((prevLeaderShip) => ({
      ...prevLeaderShip,
      [type]: [...prevLeaderShip[type], ""],
    }));
  };

  const handleRemoveArrayItem = (index, type) => {
    setLeaderShip((prevLeaderShip) => {
      const newArray = [...prevLeaderShip[type]];
      newArray.splice(index, 1);
      return {
        ...prevLeaderShip,
        [type]: newArray,
      };
    });
  };

  const handleArrayChange = (e, index, type) => {
    const { value } = e.target;
    setLeaderShip((prevLeaderShip) => {
      const newArray = [...prevLeaderShip[type]];
      newArray[index] = value;
      return {
        ...prevLeaderShip,
        [type]: newArray,
      };
    });
  };

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const imageArray = leaderShip.images ? [...leaderShip.images] : []; // Check if leaderShip.images is defined

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (reader.readyState === FileReader.DONE) {
  //           // Check if the image already exists in the image array
  //           if (!imageArray.includes(reader.result)) {
  //             imageArray.push(reader.result);
  //             setLeaderShip((prevleaderShip) => ({
  //               ...prevleaderShip,
  //               images: imageArray,
  //             }));
  //           }
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the selected files
    setLeaderShip(
      (prevLeaderShip) => ({
        ...prevLeaderShip,
        image: file,
      }),
      () => {
        console.log(leaderShip); // This will log the updated state
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", leaderShip.name);
    formData.append("address", leaderShip.address);
    formData.append("image", leaderShip.image);
    formData.append("phone", leaderShip.phone);
    formData.append("email", leaderShip.email);
    formData.append("category", leaderShip.category);
    formData.append("position", leaderShip.postion);
    formData.append("link", leaderShip.link);
    const token = localStorage.getItem("token");
    axios
      .post(`${SERVER_URL}/admin/add-leadership`, formData, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("LeaderShip added successfully");
          setLeaderShip({
            name: "",
            address: "",
            image: null,
            phone: [],
            email: [],
            category: "",
            postion: "",
            link: "",
          });
          axios.get(`${SERVER_URL}/admin/leadership`).then((res) => {
            if (res.status === 200) {
              setLeadershipList(res.data);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = (id) => {
    axios
      .delete(`${SERVER_URL}/admin/delete-leadership/${id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("LeaderShip deleted successfully");
          setLeadershipList((prev) => prev.filter((item) => item._id !== id));
        }
      });
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
                    <h6 className="card-title">Add leaderShip</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="leaderShipName" className="form-label">
                          leaderShip Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          autoComplete="off"
                          placeholder="name"
                          name="name"
                          value={leaderShip.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="link" className="form-label">
                          Link
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="link"
                          autoComplete="off"
                          placeholder="link"
                          name="link"
                          value={leaderShip.link}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="postion" className="form-label">
                          Postion
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="postion"
                          autoComplete="off"
                          placeholder="postion"
                          name="postion"
                          value={leaderShip.postion}
                          onChange={handleChange}
                        />
                      </div>
                      {/* Phone */}
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone
                        </label>
                        <div>
                          {leaderShip?.phone.map((phoneNumber, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center mb-2"
                            >
                              <input
                                type="text"
                                className="form-control me-2"
                                autoComplete="off"
                                placeholder="Phone"
                                name="phone"
                                value={phoneNumber}
                                onChange={(e) =>
                                  handleArrayChange(e, index, "phone")
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleRemoveArrayItem(index, "phone")
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleAddArrayItem("phone")}
                          >
                            Add Phone
                          </button>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Emails
                        </label>
                        <div>
                          {leaderShip?.email.map((email, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center mb-2"
                            >
                              <input
                                type="text"
                                className="form-control me-2"
                                autoComplete="off"
                                placeholder="Email"
                                name="email"
                                value={email}
                                onChange={(e) =>
                                  handleArrayChange(e, index, "email")
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleRemoveArrayItem(index, "email")
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleAddArrayItem("email")}
                          >
                            Add Email
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <textarea
                          className="form-control"
                          id="address"
                          rows="4"
                          placeholder="Address"
                          name="address"
                          value={leaderShip.address}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                          Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="image"
                          placeholder="image"
                          name="image"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                          Category
                        </label>
                        <select
                          className="form-select"
                          name="category"
                          value={leaderShip.category}
                          onChange={handleChange}
                        >
                          <option value="">Select Category</option>
                          <option value="AICC">AICC</option>
                          <option value="KPCC">KPCC</option>
                          <option value="DCC">DCC</option>
                          <option value="UDF">UDF</option>
                        </select>
                      </div>

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
          <div className="page-content">
            <div className="row">
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Data Table</h6>

                    <div className="table-responsive">
                      <table id="dataTableExample" className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Category</th>

                            {/* <th>Edit</th> */}
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadershipList?.map((product) => (
                            <tr key="">
                              <th>{product?.name}</th>
                              <th>
                                <img
                                  src={
                                    product?.image ||
                                    "https://www.intuc.net/images/logo.jpg"
                                  }
                                  style={{ width: "10%" }}
                                  alt=""
                                />
                              </th>
                              <th>{product?.category}</th>

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
                                  onClick={() => handleDelete(product._id)}
                                >
                                  Delete
                                </p>
                              </th>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* <div className="card-footer py-4">
                      <nav aria-label="...">
                        <ul className="pagination justify-content-end mb-0">
                          <li
                            className={`page-item {page===1&& disable}`}
                            onClick={() => {
                              if (page > 1) {
                                setPage(page - 1);
                              }
                            }}
                          >
                            <a className="page-link">
                              <i className="fas fa-angle-left" />
                              <span className="sr-only">Previous</span>
                            </a>
                          </li>
                          <li className="page-item active">
                            <a className="page-link">{page}</a>
                          </li>
                          {leadershipList.length !== 0 && (
                            <li
                              className="page-item"
                              onClick={() => {
                                setPage(page + 1);
                              }}
                            >
                              <a className="page-link">{page + 1}</a>
                            </li>
                          )}
                          {leadershipList.length !== 0 && (
                            <li
                              className="page-item"
                              onClick={() => {
                                if (leadershipList.length !== 0) {
                                  setPage(page + 1);
                                }
                              }}
                            >
                              <a className="page-link">
                                <i className="fas fa-angle-right" />
                                <span className="sr-only">Next</span>
                              </a>
                            </li>
                          )}
                        </ul>
                      </nav>
                    </div> */}
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

export default AddLeaderShip;
