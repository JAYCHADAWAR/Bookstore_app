import {React,useEffect,useState} from 'react';
import '../CSS/Profile.css';
const Profile = () => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({name:'',email:''});


  const fetchUserProfile = async () => {
    try {
      console.log('in fetch rpofile');
      const backendUrl = 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/getProfile`,{method: 'GET',headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }})
      if (!response.ok) {
       alert('Failed to fetch profile data');
      }
      const profileData = await response.json();
      console.log("profile after fetching",profileData.profile[0]);
      const data=profileData.profile[0];
      setProfile(data); 
      // console.log('profile after setting',profile);

    } catch (error) {


      console.error('Error fetching profile:', error);
    }
  };
  useEffect(() => {
    console.log('profile after setting', profile);
  }, [profile]);


  useEffect(() => {
    fetchUserProfile();
  }, []);
 
  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(profile => ({
      ...profile,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    //console.log(token);
    const backendUrl = 'http://localhost:3001';
    console.log('in submit',profile);
    const response = await fetch(`${backendUrl}/updateprofile`,{ method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(profile)
    });

    if (!response.ok) {
      console.log('could not update');
      alert('could not update');
    }

    console.log('Updated profile:', profile);
    setIsEditing(false);
    fetchUserProfile();


  };

  

 
  return (
    <div className="profile-form">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Username:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={profile.name}
          
          onChange={handleInputChange}
        /><br />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={profile.email}
         
          onChange={handleInputChange}
        /><br />

        

        {isEditing ? (
          <input type="submit" value="Save" />
        ) : (
          <button onClick={handleEdit}>Edit Profile</button>
        )}
      </form>
    </div>
  );
};


  
export default Profile;