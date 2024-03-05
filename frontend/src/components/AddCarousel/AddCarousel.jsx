import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

function AddCarousel() {
  const [carousel, setCarousel] = useState({
    name: "",
    href: "",
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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarousel((prevCarousel) => ({
      ...prevCarousel,
      [name]: value,
    }));
  };

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const imageArray = carousel.images ? [...carousel.images] : []; // Check if carousel.images is defined

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (reader.readyState === FileReader.DONE) {
  //           // Check if the image already exists in the image array
  //           if (!imageArray.includes(reader.result)) {
  //             imageArray.push(reader.result);
  //             setCarousel((prevCarousel) => ({
  //               ...prevCarousel,
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
    setCarousel(
      (prevCarousel) => ({
        ...prevCarousel,
        image: file,
      }),
      () => {
        console.log(carousel); // This will log the updated state
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", carousel.name);
    formData.append("href", carousel.href);
    formData.append("image", carousel.image);
    const token = localStorage.getItem("token");
    axios
      .post(`${SERVER_URL}/admin/carousel`, formData, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("carousel added successfully");
          setCarousel({
            name: "",
            href: "",
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
                    <h6 className="card-title">Add carousel</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="carouselName" className="form-label">
                          carousel Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          autoComplete="off"
                          placeholder="name"
                          name="name"
                          value={carousel.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="carouselHref" className="form-label">
                          carousel Link
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="href"
                          autoComplete="off"
                          placeholder="href"
                          name="href"
                          value={carousel.href}
                          onChange={handleChange}
                        />
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

export default AddCarousel;
