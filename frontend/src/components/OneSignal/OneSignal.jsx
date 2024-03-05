import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function OneSignal() {
  const [gallery, setGallery] = useState({
    title: "",
    url: "",
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
    setGallery((prevGallery) => ({
      ...prevGallery,
      [name]: value,
    }));
  };

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const imageArray = gallery.images ? [...gallery.images] : []; // Check if gallery.images is defined

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (reader.readyState === FileReader.DONE) {
  //           // Check if the image already exists in the image array
  //           if (!imageArray.includes(reader.result)) {
  //             imageArray.push(reader.result);
  //             setGallery((prevgallery) => ({
  //               ...prevgallery,
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
    setGallery(
      (prevGallery) => ({
        ...prevGallery,
        image: file,
      }),
      () => {
        console.log(gallery); // This will log the updated state
      }
    );
  };
  const handleSubmit = (e) => {
    //any of three is need title or url or image  any one of them should be present
   
    e.preventDefault();
    if (!gallery.title && !gallery.url && !gallery.image) {
      toast.error("Please enter title or url or image");
      return;
    }
    
    const formData = new FormData();
    formData.append("title", gallery.title);
    formData.append("url", gallery.url);
    formData.append("image", gallery.image);
    const token = localStorage.getItem("token");
    axios
      .post(`${SERVER_URL}/admin/firebase-notification`, formData, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Notification added successfully");
          setGallery({
            title: "",
            url: "",
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
                    <h6 className="card-title">Add Notification</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="galleryName" className="form-label">
                        title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          autoComplete="off"
                          placeholder="title"
                          name="title"
                          value={gallery.name}
                          onChange={handleChange}
                        />
                      </div>
                
            

                      <div className="mb-3">
                        <label htmlFor="url" className="form-label">
                          url
                        </label>
                        <textarea
                          className="form-control"
                          id="url"
                          rows="4"
                          placeholder="url"
                          name="url"
                          value={gallery.url}
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

export default OneSignal;
