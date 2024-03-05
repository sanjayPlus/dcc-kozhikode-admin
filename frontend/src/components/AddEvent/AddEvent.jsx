import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function AddEvent() {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    url:"",
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
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const imageArray = event.images ? [...event.images] : []; // Check if event.images is defined

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (reader.readyState === FileReader.DONE) {
  //           // Check if the image already exists in the image array
  //           if (!imageArray.includes(reader.result)) {
  //             imageArray.push(reader.result);
  //             setEvent((prevEvent) => ({
  //               ...prevEvent,
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
    setEvent(
      (prevEvent) => ({
        ...prevEvent,
        image: file,
      }),
      () => {
        console.log(event); // This will log the updated state
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", event.title);
    formData.append("description", event.description);
    formData.append("url", event.url);
    formData.append("image", event.image);
    const token = localStorage.getItem("token");
    axios
      .post(`${SERVER_URL}/admin/event`, formData, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("event added successfully");
          setEvent({
            title: "",
            description: "",
            url:"",
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
                    <h6 className="card-title">Add event</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Event Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          autoComplete="off"
                          placeholder="title"
                          name="title"
                          value={event.title}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="url" className="form-label">
                          Url
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="url"
                          autoComplete="off"
                          placeholder="url"
                          name="url"
                          value={event.url}
                          onChange={handleChange}
                        />
                      </div>
                
            

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          rows="4"
                          placeholder="Description"
                          name="description"
                          value={event.description}
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

export default AddEvent;
