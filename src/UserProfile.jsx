import App from './App.jsx';

function UserProfile(props) {
  return (
    <div className="kartu-profil">
          <h1 className="nama">Ini {props.name}</h1>
          <p className="bio">{props.bio}</p>
      </div>
  );
}

export default UserProfile;