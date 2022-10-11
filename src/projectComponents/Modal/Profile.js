import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import styles from '../../styles/components/Modal/Profile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModalProfile } from '../../store/features/modalSlice';
import * as yup from 'yup';
import Button from '../../components/Button';
import {
  useChangePassword,
  useUpdateUser,
  useUpdateUserAvatar,
} from '../../api/useUser';
import { toast } from 'react-toastify';
import { setUser } from '../../store/features/authSlice';
import Resource from '../../Resource';
import { useFilePicker } from 'use-file-picker';

const SingleChatModal = () => {
  const user = useSelector((state) => state.auth.user);

  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();

  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email,
  });

  const onChangeUser = (e) => {
    setUserData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();

  const onUpdateSuccess = (data) => {
    toast.success('بروزرسانی موفق');
    dispatch(setUser(data));
  };

  const onUpdateFail = (err) => {
    err.response.data?.error && err.response.data?.error.length
      ? err.response.data?.error.forEach((err) => toast.error(err))
      : toast.error(err.response.data.message);
  };

  const onChangePasswordSuccess = (data) => {
    toast.success(data.message);
    setPassword('');
    setNewPassword('');
  };

  const onChangePasswordFail = (err) => {
    err.response.data?.error && err.response.data?.error.length
      ? err.response.data?.error.forEach((err) => toast.error(err))
      : toast.error(err.response.data.message);
  };

  const onAvatarUpdateSuccess = (data) => {
    toast.success('تصویر با موفقیت بروزرسانی شد.');
    setFile('');
    setFilePreview('');
    dispatch(setUser(data));
  };

  const onAvatarUpdateFail = (err) => {
    console.log(err);
    toast.error('خطا در بروزرسانی عکس پروفایل');
  };

  const { mutate: update, isLoading: isLoadingUpdate } = useUpdateUser(
    onUpdateSuccess,
    onUpdateFail
  );

  const { mutate: changePassword, isLoading: isLoadingChangePassword } =
    useChangePassword(onChangePasswordSuccess, onChangePasswordFail);

  const { mutate: updateAvatar, isLoading: isLoadingAvatar } =
    useUpdateUserAvatar(onAvatarUpdateSuccess, onAvatarUpdateFail);

  const UserSchema = yup.object({
    username: yup.string().required('نام کاربری نمی‌تواند خالی باشد'),
    email: yup
      .string()
      .required('ایمیل نمی‌تواند خالی باشد.')
      .email('ایمیل صحیحی را وارد نمایید.'),
  });

  const PasswordSchema = yup.object({
    password: yup
      .string()
      .min(6, 'رمز عبور حداقل 6 کاراکتر می‌باشد')
      .required('پسورد فعلی را وارد نمایید'),
    newPassword: yup
      .string()
      .min(6, 'رمز عبور حداقل 6 کاراکتر می‌باشد')
      .required('پسورد جدید را وارد نمایید'),
  });

  const isOpen = useSelector((state) => state.modal.modalProfile);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(toggleModalProfile());
  };

  const updateUser = (e) => {
    e.preventDefault();
    UserSchema.validate(userData)
      .then(() => {
        update([user.id, userData]);
      })
      .catch((err) => {
        toast.error(err.toString());
      });
  };

  const changePasswordClick = (e) => {
    e.preventDefault();
    const data = {
      password,
      newPassword,
    };

    PasswordSchema.validate(data)
      .then(() => {
        changePassword([user.id, data]);
      })
      .catch((err) => {
        toast.error(err.toString());
      });
  };

  const [openFileSelector, { filesContent, plainFiles, clear, errors }] =
    useFilePicker({
      readAs: 'Text',
      accept: ['image/*'],
      multiple: false,
      limitFilesConfig: { max: 1 },
      maxFileSize: 4,
    });

  useEffect(() => {
    if (filesContent.length) {
      console.log(plainFiles[0]);
      setFilePreview(URL.createObjectURL(plainFiles[0]));
      setFile(plainFiles[0]);
    }
    // eslint-disable-next-line
  }, [filesContent]);

  const updateUserAvatar = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', file);
    data.append('user', user.username);
    updateAvatar([user.id, data]);
  };

  if (errors.length) {
    if (errors[0].fileSizeToolarge) {
      toast.error('اندازه فایل حداکثر 4 مگابایت می‌باشد.');
      clear();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'ProfileModal',
        afterOpen: 'ProfileModal__after-open',
        beforeClose: 'ProfileModal__before-close',
      }}
      overlayClassName={{
        base: 'ProfileOverlay',
        afterOpen: 'ProfileOverlay__after-open',
        beforeClose: 'ProfileOverlay__before-close',
      }}
    >
      <form className={styles.container}>
        <img
          name='file'
          onClick={openFileSelector}
          className={styles.profileImg}
          src={
            filePreview
              ? filePreview
              : user.avatar
              ? `${process.env.REACT_APP_SOCKET_ROUTE}${user.avatar}`
              : 'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
          }
          alt='user-img'
        />
        {file && (
          <Button
            onClick={updateUserAvatar}
            className='PerformBtn'
            title={!isLoadingAvatar && 'بروزرسانی تصویر'}
            disabled={isLoadingAvatar}
            icon={isLoadingAvatar && Resource.Gifs.BTN_LOADER}
          />
        )}
        <Input
          fieldClassName={'ProfileField'}
          className={'ProfileInput'}
          type={'text'}
          value={userData.username}
          onChange={onChangeUser}
          placeholder={'نام کاربری'}
          name='username'
        />
        <Input
          fieldClassName={'ProfileField'}
          className={'ProfileInput'}
          type={'email'}
          value={userData.email}
          onChange={onChangeUser}
          placeholder={'ایمیل'}
          name='email'
        />
        <Button
          onClick={updateUser}
          className='PerformBtn'
          title={!isLoadingUpdate && 'اعمال تغییرات'}
          disabled={isLoadingUpdate}
          icon={isLoadingUpdate && Resource.Gifs.BTN_LOADER}
        />
        <h4>تغییر رمز عبور</h4>
        <Input
          fieldClassName={'ProfileField'}
          className={'ProfileInput'}
          type={'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={'رمز عبور فعلی'}
        />
        <Input
          fieldClassName={'ProfileField'}
          className={'ProfileInput'}
          type={'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={'رمز عبور جدید'}
        />
        <Button
          onClick={changePasswordClick}
          className='PerformBtn'
          title={!isLoadingChangePassword && 'تغییر رمز عبور'}
          disabled={isLoadingChangePassword}
          icon={isLoadingChangePassword && Resource.Gifs.BTN_LOADER}
        />
      </form>
    </Modal>
  );
};

export default SingleChatModal;
