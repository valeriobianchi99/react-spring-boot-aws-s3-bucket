import './App.css';
import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react'
import { useDropzone } from 'react-dropzone';

function MyDropzone({userProfileId, getUsersCallback}) {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    axios.post(
      `http://localhost:8080/api/v1/user-profile/${userProfileId}/image/upload`,
       formData,
       {
        headers: {
          "Content-Type": "multipart/form-data"
        }
       }
    ).then(
        response => {
          console.log("File uploaded successfully", response);
          getUsersCallback();
        }
    ).catch(
      error => {
        console.error("Error uploading image ", error);
      }
    );
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className={'dropzone' + (isDragActive ? ' active' : '')}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the image here ...</p> :
          <p>Drag & drop profile image here, or click to select image from file explorer</p>
      }
    </div>
  )
}

const UserProfiles = () => {

  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = () => {
    axios.get('http://localhost:8080/api/v1/user-profile').then(
      res => {
        //console.log(res);
        const data = res.data;
        setUserProfiles(data);
      }
    );
  }

  useEffect(() => {
    fetchUserProfiles()
  }, [])

  return (
    <>
    {
      userProfiles.map((userProfile, index) => {
        return (
          <div key={index} className='user-profile'>
            <h1>{userProfile.username}</h1>
            <MyDropzone userProfileId={userProfile.userProfileId} getUsersCallback={fetchUserProfiles}/>
            {
              userProfile.userProfileId ? <img src={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`}/> : null
            }
            <p>{userProfile.userProfileId}</p>
          </div>
        )
      })
    }
    </>
  )
}

function App() {

  
  return (
    <div className="App">
      <UserProfiles />
    </div>
  );
}

export default App;
