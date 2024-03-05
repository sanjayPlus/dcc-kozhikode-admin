import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function AddCalendar() {
  const [date, setDate] = useState(Date.now());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image,setImage] = useState("")
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

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const imageArray = calendar.images ? [...calendar.images] : []; // Check if calendar.images is defined

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (reader.readyState === FileReader.DONE) {
  //           // Check if the image already exists in the image array
  //           if (!imageArray.includes(reader.result)) {
  //             imageArray.push(reader.result);
  //             setCalendar((prevcalendar) => ({
  //               ...prevcalendar,
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
   setImage(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
     const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("image",image);
    const token = localStorage.getItem("token");
    axios
      .post(
        `${SERVER_URL}/admin/calendar-event`,
       formData
       ,
        {
          headers: { "x-access-token": token },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Calendar added successfully");
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
                    <h6 className="card-title">Add calendar</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          calendar Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          autoComplete="off"
                          placeholder="title"
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="date" className="form-label">
                          Date
                        </label>

                        <input
                          type="date"
                          className="form-control"
                          id="date"
                          autoComplete="off"
                          placeholder="date"
                          name="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
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
                          autoComplete="off"
                          placeholder="description"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
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

export default AddCalendar;
