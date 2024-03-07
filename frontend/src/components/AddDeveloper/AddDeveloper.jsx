import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function AddDeveloper() {
  const [developer, setDeveloper] = useState({
    name: "",
    position: "",
    image: null,
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeveloper((prevDeveloper) => ({
      ...prevDeveloper,
      [name]: value,
    }));
  };

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const imageArray = developer.images ? [...developer.images] : []; // Check if developer.images is defined

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (reader.readyState === FileReader.DONE) {
  //           // Check if the image already exists in the image array
  //           if (!imageArray.includes(reader.result)) {
  //             imageArray.push(reader.result);
  //             setDeveloper((prevdeveloper) => ({
  //               ...prevdeveloper,
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
    setDeveloper(
      (prevDeveloper) => ({
        ...prevDeveloper,
        image: file,
      }),
      () => {
        console.log(developer); // This will log the updated state
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", developer.name);
    formData.append("position", developer.position);
    formData.append("image", developer.image);
    const token = localStorage.getItem("token");
    axios
      .post(`${SERVER_URL}/admin/add-developer`, formData, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Developer added successfully");
          setDeveloper({
            name: "",
            position: "",
            image: null,
          });
        }
      })
      .catch((err) => {
        console.log(err);
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
                    <h6 className="card-title">Add developer</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="developerName" className="form-label">
                          developer Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          autoComplete="off"
                          placeholder="name"
                          name="name"
                          value={developer.name}
                          onChange={handleChange}
                        />
                      </div>
                
            

                      <div className="mb-3">
                        <label htmlFor="position" className="form-label">
                          Position
                        </label>
                        <textarea
                          className="form-control"
                          id="position"
                          rows="4"
                          placeholder="Position"
                          name="position"
                          value={developer.position}
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

export default AddDeveloper;
