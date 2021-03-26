import React, { useContext } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../../firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

// Initialize Firebase
if(firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
} 


const LogIn = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };

    const handleGoogleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then((result) => {
            var credential = result.credential;
            var token = credential.accessToken;
            const {displayName, email} = result.user;
            const signInUser = {name: displayName, email};
            setLoggedInUser(signInUser);
            storeAuthToken();
            history.replace(from);
            // console.log(token);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    //Token server
    const storeAuthToken = () => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(function(idToken) {
            // Send token to your backend via HTTPS
            // console.log(idToken);
            sessionStorage.setItem('token', idToken);
        })
        .catch(function(error) {
            // Handle error
        });
    }

    
    return (
        <div style={{textAlign: 'center'}}>
            {
                !loggedInUser ? <h1>Already Sign In</h1> : 
                <div>
                    <h1>This is Login</h1>
                    <button onClick={handleGoogleSignIn}>Google SignIn</button>
                </div>
                
                
            }
        </div>
    );
};

export default LogIn;