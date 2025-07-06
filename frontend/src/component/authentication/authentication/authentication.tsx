import { useState, useRef, useEffect } from 'react';
import LoginPage from '../login/login';
import RegisterPage from '../register/register';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const hasRendered = useRef(false); // ใช้เช็คว่าคือการ render ครั้งแรกไหม

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    hasRendered.current = true;
  }, []);

  return (
    <>
      {isLogin ? (
        <LoginPage onSwitch={handleSwitch} isFirstRender={!hasRendered.current} />
      ) : (
        <RegisterPage onSwitch={handleSwitch} />
      )}
    </>
  );
};

export default Authentication;
