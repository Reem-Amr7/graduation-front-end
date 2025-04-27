import React, { useState, useEffect } from 'react';

import styles from "./Profile.module.css";
import ProfileLeftside from './ProfileLeftside';
import axios from 'axios';
import { FaCalendarAlt, FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaRedo } from "react-icons/fa";
import NewPost from '../Home/newpost';
import PostSettings from '../Home/postSetting';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageURL: "",
  });

  const [newSkill, setNewSkill] = useState(""); 
  const [userSkills, setUserSkills] = useState([]); 

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    if (!userId || !token) {
      setError("لم يتم العثور على بيانات المستخدم. تأكد من تسجيل الدخول.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://ourheritage.runasp.net/api/Users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setUserData(response.data);
          setUserSkills(response.data.skills || []); 
        } else {
          throw new Error("حدث خطأ أثناء جلب البيانات.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401) {
          setError("خطأ 401: غير مصرح بالوصول. تأكد من تسجيل الدخول.");
        } else {
          setError("حدث خطأ أثناء جلب البيانات. تحقق من الاتصال وصلاحيات الوصول.");
        }
      }
    };

    const fetchUserPosts = async () => {
      try {
        const pageIndex = 1;
        const pageSize = 100;
        const response = await axios.get(
          `https://ourheritage.runasp.net/api/Articles?PageIndex=${pageIndex}&PageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          }
        );

        if (Array.isArray(response.data.items)) {
          const filteredPosts = response.data.items.filter(post => post.userId == userId);
          setUserPosts(filteredPosts); 
        } else {
          throw new Error("شكل البيانات غير متوقع.");
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("حدث خطأ أثناء جلب البوستات. تحقق من الاتصال.");
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchUserData(), fetchUserPosts()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem("profilePicture");
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }

    const storedCoverImage = localStorage.getItem("coverImage");
    if (storedCoverImage) {
      setCoverImage(storedCoverImage);
    }
  }, []);

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleAddSkills = async (e) => {
    e.preventDefault();

    if (!newSkill) {
      setError("يجب إدخال مهارة.");
      return;
    }

    const updatedSkills = [...userSkills, newSkill];
    setUserSkills(updatedSkills);

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("userToken");

      const response = await axios.put(
        `https://ourheritage.runasp.net/api/Users/${userId}`,
        {
          skills: updatedSkills,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNewSkill("");
        setError(null);
      } else {
        throw new Error("حدث خطأ أثناء تحديث المهارات.");
      }
    } catch (err) {
      console.error("Error updating skills:", err);
      setError("حدث خطأ أثناء إضافة المهارة.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost((prevState) => ({
          ...prevState,
          imageURL: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    if (!newPost.title || !newPost.content) {
      setError("يجب إدخال عنوان ومحتوى المنشور");
      return;
    }

    try {
      const response = await axios.post(
        'https://ourheritage.runasp.net/api/Articles',
        {
          title: newPost.title,
          content: newPost.content,
          imageURL: newPost.imageURL,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUserPosts((prevPosts) => [response.data, ...prevPosts]);
        setNewPost({ title: "", content: "", imageURL: "" });
        setError(null);
      } else {
        throw new Error("حدث خطأ أثناء إضافة المنشور.");
      }
    } catch (err) {
      console.error("Error submitting new post:", err);
      setError("حدث خطأ أثناء إضافة المنشور.");
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const profilePicData = reader.result;
        localStorage.setItem("profilePicture", profilePicData);
        setProfilePicture(profilePicData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const coverPicData = reader.result;
        localStorage.setItem("coverImage", coverPicData);
        setCoverImage(coverPicData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverClick = () => {
    document.getElementById("coverImageInput").click();
  };

  if (loading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className={styles.container}>
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-9">
          <div
            className={styles.coverContainer}
         
           
          >
           
            <input
              type="file"
              id="coverImageInput"
              style={{ display: 'none' }}
              // accept="image/*"
              onChange={handleCoverImageChange}
            />
          </div>

          <div
            className={styles.profileContainer}
            style={{
              backgroundImage: `url(${coverImage || ''})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={handleCoverClick}
          >
            <div className={styles.profileContent}>
            <div className={styles.profilePictureLabel}>
  <img
    src={profilePicture || "https://via.placeholder.com/150"}
    alt="Profile"
    className={`${styles.profilePicture} cursor-pointer`}
    onClick={() => document.getElementById("profilePictureInput").click()}
  />
  <input
    type="file"
    id="profilePictureInput"
    style={{ display: 'none' }}
    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"

    onChange={handleProfilePictureChange}
  />
</div>

              <h2>{userData.fullName || `${userData.firstName} ${userData.lastName}`}</h2>
              <p>رقم الهاتف: {userData.phone || "غير متوفر"}</p>
            </div>
          </div>

          <div className={styles.skillsSection}>
            <h3 className="text-xl font-bold mb-4">إضافة مهارات جديدة</h3>
            <form onSubmit={handleAddSkills} className="space-y-4">
              <input
                type="text"
                value={newSkill}
                onChange={handleSkillChange}
                placeholder="أدخل مهارة جديدة"
                className="w-full p-3 border rounded-md"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                إضافة مهارة
              </button>
            </form>
          </div>

          <div className={styles.stats}>
            <div>
              <strong>المهارات:</strong>
              <p>{userSkills?.length > 0 ? userSkills.join(", ") : "لا توجد مهارات"}</p>
            </div>
            <div>
              <strong>عدد الاتصالات:</strong>
              <p>{userData.connections?.length || 0}</p>
            </div>
            <div>
              <strong>تاريخ الانضمام:</strong>
              <p>{new Date(userData.dateJoined).toLocaleDateString()}</p>
            </div>
          </div>

          <NewPost />

          <div className={styles.postsSection}>
            <h3 className="text-xl font-bold mb-4">منشورات المستخدم</h3>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className="mb-8 p-4 bg-white shadow-md rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={profilePicture || "https://via.placeholder.com/50"}
                        alt="صورة المستخدم"
                        className="w-12 h-12 border-2 border-red-900 rounded-full"
                      />
                      <div>
                        <p className="font-bold text-red-800">
                          {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                        </p>
                        <div className="flex items-center text-gray-600 text-sm gap-1">
                          <FaCalendarAlt />
                          <span>{new Date(post.dateCreated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <PostSettings post={post} setUserPosts={setUserPosts} />
                  </div>

                  {post.imageURL && (
                    <div className="w-full h-96 rounded-md mb-4">
                      <img
                        src={post.imageURL}
                        alt="Post"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}

                  <h4 className="text-lg font-bold mb-2">{post.title || "عنوان غير متوفر"}</h4>
                  <p className="border-b-2 border-black pb-2 mb-2">
                    {post.content || "لا يوجد محتوى لهذا المنشور"}
                  </p>

                  <div className="flex justify-between items-center mt-4 text-red-900">
                    <div className="flex gap-8 items-center">
                      <div className="flex items-center gap-1 cursor-pointer">
                        <FaThumbsUp />
                        <span>إعجاب</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <FaComment />
                        <span>تعليق</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <FaShare />
                        <span>مشاركة</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <span>إعادة نشر</span>
                      <FaRedo />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>لا توجد منشورات متاحة لهذا المستخدم.</p>
            )}
          </div>
        </div>

        <div className="col-span-3">
          <ProfileLeftside />
        </div>
      </div>
    </div>
  );
}
