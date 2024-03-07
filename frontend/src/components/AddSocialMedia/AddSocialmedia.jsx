import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddSocialMedia() {
  const [socialMedia, setSocialMedia] = useState({
    name: "",
    postion: "",
    facebook: "",
    instagram: "",
    youtube: "",
    category: "",
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
    setSocialMedia((prevSocialMedia) => ({
      ...prevSocialMedia,
      [name]: value,
    }));
  };

  //   const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const imageArray = socialMedia.images ? [...socialMedia.images] : []; // Check if socialMedia.images is defined

  //     files.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (reader.readyState === FileReader.DONE) {
  //           // Check if the image already exists in the image array
  //           if (!imageArray.includes(reader.result)) {
  //             imageArray.push(reader.result);
  //             setSocialMedia((prevsocialMedia) => ({
  //               ...prevsocialMedia,
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
    setSocialMedia(
      (prevSocialMedia) => ({
        ...prevSocialMedia,
        image: file,
      }),
      () => {
        console.log(socialMedia); // This will log the updated state
      }
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", socialMedia.name);
    formData.append("image", socialMedia.image);
    formData.append("category", socialMedia.category);
    formData.append("position", socialMedia.postion);
    formData.append("facebook", socialMedia.facebook);
    formData.append("instagram", socialMedia.instagram);
    formData.append("youtube", socialMedia.youtube);
    const token = localStorage.getItem("token");
    axios
      .post(`${SERVER_URL}/admin/add-social-media-details`, formData, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("SocialMedia added successfully");
          setSocialMedia({
            name: "",

            image: null,

            category: "",
            postion: "",
            facebook: "",
            instagram: "",
            youtube: "",
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
                    <h6 className="card-title">Add socialMedia</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="socialMediaName" className="form-label">
                          socialMedia Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          autoComplete="off"
                          placeholder="name"
                          name="name"
                          value={socialMedia.name}
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
                          value={socialMedia.postion}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="facebook" className="form-label">
                          Facebook
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="facebook"
                          autoComplete="off"
                          placeholder="facebook"
                          name="facebook"
                          value={socialMedia.facebook}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="instagram" className="form-label">
                          Instagram
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="instagram"
                          autoComplete="off"
                          placeholder="instagram"
                          name="instagram"
                          value={socialMedia.instagram}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="youtube" className="form-label">
                          Youtube
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="youtube"
                          autoComplete="off"
                          placeholder="youtube"
                          name="youtube"
                          value={socialMedia.youtube}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                          Category
                        </label>
                        <select
                          className="form-select"
                          name="category"
                          value={socialMedia.category}
                          onChange={handleChange}
                        >
                          <option value="">Select Category</option>
                          <option value="AICC">AICC</option>
                          <option value="KPCC">KPCC</option>
                          <option value="DCC">DCC</option>
                          <option value="UDF">UDF</option>
                        </select>
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

export default AddSocialMedia;
