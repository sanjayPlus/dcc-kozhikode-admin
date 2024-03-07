import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";

function AllSocialMedia() {
  const navigate = useNavigate();
  const [gallery, setGallery] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("AICC");

  // const [page, setPage] = useState(1);
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
            .get(`${SERVER_URL}/admin/get-social-media?category=${category}`, {
              headers: { "x-access-token": token },
            })
            .then((userResponse) => {
              if (userResponse.status === 200) {
            
                setGallery(userResponse?.data);
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
const handleCategoryChange = (e) => {
  setCategory(e.target.value);
  axios.get(`${SERVER_URL}/admin/get-social-media?category=${e.target.value}`, {
    headers: { "x-access-token": localStorage.getItem("token") },
  }).then((res) => {
    if (res.status === 200) {
      setGallery(res?.data);
    }
  }).catch((err) => {
    console.log(err.response.data);
  })
}
  // useEffect(() => {
  //   axios
  //     .get(`${SERVER_URL}/product/gallery-with-pagination?page=${page}&limit=10`, {
  //       headers: { "x-access-token": localStorage.getItem("token") },
  //     })
  //     .then((userResponse) => {
  //       if (userResponse.status === 200) {
  //           setgallery(userResponse?.data.gallery);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.response.data);
  //     });
  // }, [page]);
  function handleDelete(socialId,itemId) {
    axios
      .delete(
        `${SERVER_URL}/admin/delete-social-media-details/${socialId}/${itemId}`,
        { headers: { "x-access-token": localStorage.getItem("token") } }
      )
      .then((res) => {
        if (res.status === 200) {
          setGallery(gallery?.socialMediaSchema?.filter((product) => product._id !== socialId));
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  return (
    <>
      <div className="main-wrapper">
        <SideBar />
        <div className="page-wrapper">
          <NavBar name={name} setName={setName} link="all-gallery" />
          <div className="page-content">
            <div className="row">
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Data Table</h6>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                          Category
                        </label>
                        <select
                          className="form-select"
                          name="category"
                          value={category}
                          onChange={handleCategoryChange}
                        >
                          <option value="">Select Category</option>
                          <option value="AICC">AICC</option>
                          <option value="KPCC">KPCC</option>
                          <option value="DCC">DCC</option>
                          <option value="UDF">UDF</option>
                        </select>
                      </div>

                    <div className="table-responsive">
                      <table id="dataTableExample" className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Postion</th>
                            <th>Category</th>
                           
                            {/* <th>Edit</th> */}
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gallery.socialMediaSchema?.map((product) => (
                            <tr key="">
                              <th>{product?.name}</th>
                              <th><img src={product?.image} style={{width:"10%"}} alt="" /></th>
                              <th>{product?.position}</th>
                              <th>{gallery.category}</th>
                              

                             
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
                              onClick={()=>handleDelete(gallery._id,product._id)}
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
                          {gallery.length !== 0 && (
                            <li
                              className="page-item"
                              onClick={() => {
                                setPage(page + 1);
                              }}
                            >
                              <a className="page-link">{page + 1}</a>
                            </li>
                          )}
                          {gallery.length !== 0 && (
                            <li
                              className="page-item"
                              onClick={() => {
                                if (gallery.length !== 0) {
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

export default AllSocialMedia;
