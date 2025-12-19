import { useEffect, useState } from 'react';

import { BsPencilSquare, BsArrowRepeat, BsChevronLeft, BsCheckCircleFill, BsTrashFill, BsCaretRightFill } from 'react-icons/bs';

import { useUser } from '../User';
import Alert from '../alert';

function Account({ onBack, onLogout }) {
  const { userEmail, googleAccount, updateUser, deleteUser, checkUserExist } = useUser();
  const [isEdit, setIsEdit] = useState(false);
  const [isEditPwd, setIsEditPwd] = useState(false);
  const [newEmail, setNewEmail] = useState(userEmail);
  const [newPassword, setNewPassword] = useState("");
  const [newCPassword, setNewCPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePwdError, setDeletePwdError] = useState("");
  // const [newGoogle, setNewGoogle] = useState(googleAccount);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setNewEmail(userEmail);
  }, [userEmail]);
  
  const handleDeleteUser = async () => {
    if (!deletePassword || deletePassword.length < 4) {
      setDeletePwdError("Password must be at least 4 characters to delete");
      return;
    }

    const res = await deleteUser(deletePassword);
    if (res.ok) {
      setShowConfirm(false);
      setDeletePassword("");
      onLogout();
    } else setDeletePwdError(res.message || "Delete failed");
  };

  /* EDIT/SUBMIT BUTTON EVENT */
  const handleButtonClick = async (e) => {
    e.preventDefault();
  
    if (isEdit && e.nativeEvent.submitter?.type === "submit") {
      if (newCPassword !== newPassword) {
        setPwdError("Password does not match");
        return;
      }
      if (newPassword && newPassword.length < 4) {
        setPwdError("Password must be at least 4 characters");
        return;
      }
      
      if (newEmail !== userEmail) {
        const exists = await checkUserExist(newEmail);
        if (exists) {
          setEmailError("This email already exists");
          return;
        }
      }
      await updateUser({ email: newEmail, password: newPassword || undefined });
      setNewPassword("");
      setNewCPassword("");
    }
  
    setIsEdit((prev) => !prev);
    setIsEditPwd(false);
  };

  const handleGoogleChange = () => {  // need recheck 
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <form className="account m-3 pb-1 rounded-3 text-light" onSubmit={handleButtonClick}>
        <h4 className="d-flex ms-4 pt-3 align-items-center text-white">
          <BsChevronLeft className="me-3 cursor-pointer" onClick={onBack} />
          Account
          <div className="d-flex flex-grow-1 justify-content-end align-items-center">
            <button 
              className={`delete-account btn d-flex align-items-center fs-4 ${isEdit ? "text-white" : "text-secondary"}`}
              onClick={() => setShowConfirm(true)}
              disabled={isEdit ? false : true}
            >
              <BsTrashFill />
            </button>
            <button 
              type={isEdit ? "submit" : ""}
              className="edit-account btn d-flex me-3 align-items-center text-white fs-4"
            >
              {isEdit ? <BsCheckCircleFill /> : <BsPencilSquare />}
            </button>
          </div>
        </h4>

        <div className="account-content m-3 p-4 pb-3 rounded-4">
          {/* USER EMAIL */}
          <p className="fw-semibold">Email (username): 
            {isEdit ?
              <>
                <input 
                  type="email"
                  className="form-control mt-1"
                  placeholder="Email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onFocus={() => setEmailError("")}
                  required={newPassword || newCPassword}
                />
                {emailError && <p className="mt-2 text-danger fw-normal">{emailError}</p>}
              </>
              : <span className={`${newEmail ? "" : "text-secondary"}`}>{newEmail ? newEmail : "unknown"}</span>
            }
          </p>
          
          {/* USER PASSWORD */}
          <p className="fw-semibold">
            {isEdit ?
              <>
                {isEditPwd ? 
                  <>
                    Password:
                    <input 
                      type="password"
                      className={`form-control my-1 ${pwdError ? "border-danger" : ""}`}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setPwdError("")}
                    />
                    Confirm password:
                    <input 
                      type="password"
                      className={`form-control my-1 ${pwdError ? "border-danger" : ""}`}
                      placeholder="Confirm new password"
                      value={newCPassword}
                      onChange={(e) => setNewCPassword(e.target.value)}
                      onFocus={() => setPwdError("")}
                      required={newPassword}
                    />
                    {pwdError && <p className="mt-2 text-danger fw-normal">{pwdError}</p>}
                  </>
                  : 
                  <p 
                    className="d-flex py-2 fw-semibold text-light align-items-center cursor-pointer"
                    onClick={() => setIsEditPwd(true)}
                  >
                    <BsCaretRightFill className="me-3 text-light fs-5" /> Change Password?
                  </p>
                } 
              </>
              : 
              <>
                Password:
                <span className={`${newEmail ? "" : "text-secondary"}`}>{newEmail ? "* hidden *" : "unknown"}</span>
              </>
            }
          </p>
          
          {/* GOOGLE ACCOUNT */}
          <p className={`mb-2 ${isEdit ? "mt-4" : ""} fw-semibold`}>
            Google account: 
              <span className={`${googleAccount ? "" : "text-secondary"}`}>{googleAccount ? googleAccount : "not sync"}</span>
              {isEdit && 
                <BsArrowRepeat className="ms-3 cursor-pointer" onClick={handleGoogleChange} />
              }
          </p>
        </div>
      </form>
      
      {/* ALERT POPUP */}
      <Alert
        isOpen={showConfirm}
        message={
          <div>
            <div className="mb-2">Delete the account? This cannot be recovered.</div>
            <input
              type="password"
              className="form-control mt-2"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => { setDeletePassword(e.target.value); setDeletePwdError(""); }}
            />
            {deletePwdError && <div className="text-danger mt-2">{deletePwdError}</div>}
          </div>
        }
        onConfirm={handleDeleteUser}
        onCancel={() => { setShowConfirm(false); setDeletePassword(""); setDeletePwdError(""); }}
      />
    </>
  );
}

export default Account;