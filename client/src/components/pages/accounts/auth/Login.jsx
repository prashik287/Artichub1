import React, { useState } from 'react';
import './Login.css';
import { Tabs } from 'radix-ui';
import { Flex, Select } from '@radix-ui/themes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export const Login = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Validate Registration Inputs
  const validateRegister = () => {
    let newErrors = {};
    if (!registerData.first_name.trim()) newErrors.first_name = 'First Name is required';
    if (!registerData.last_name.trim()) newErrors.last_name = 'Last Name is required';
    if (!registerData.username.trim()) newErrors.username = 'Username is required';
    if (!registerData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(registerData.email)) newErrors.email = 'Invalid email format';
    if (!registerData.password.trim()) newErrors.password = 'Password is required';
    if (!registerData.role) newErrors.role = 'Role selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Validate Login Inputs
  const validateLogin = () => {
    let newErrors = {};
    if (!loginData.username.trim()) newErrors.username = 'Username is required';
    if (!loginData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Registration Input Change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  // ✅ Handle Login Input Change
  const handleLchange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // ✅ Handle Role Selection
  const handleSelection = (value) => {
    setRegisterData({ ...registerData, role: value });
  };

  // 🚀 Handle Registration Submit
  const handleSubmit = async () => {
    if (!validateRegister()) return;
    setDialogMessage('');
    setDialogOpen(true);
    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/user/register/',
        registerData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setIsSuccess(true);
      setDialogMessage('Registration successful! 🎉 Check Your Inbox');
    } catch (error) {
      setIsSuccess(false);
      setDialogMessage(error.response?.data?.username?.[0] || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Handle Login Submit
  const handleLSubmit = async () => {
    if (!validateLogin()) return;
    setDialogMessage('');
    setDialogOpen(true);
    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/user/login/',
        loginData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('access-token', response.data.access_token);
      localStorage.setItem('refresh-token', response.data.refresh_token);
      setIsSuccess(true);
      setDialogMessage('Login successful! 🎉');
      navigate('/'); // Redirect after successful login
    } catch (error) {
      setIsSuccess(false);
      setDialogMessage(error.response?.data?.message?.[0] || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Redirect to Reset Password
  const navigatereset = () => {
    navigate('/reset-password/');
  };

  return (
    <div className="login">
      <Tabs.Root className="TabsRoot" defaultValue="tab1">
        <Tabs.List className="TabsList">
          <Tabs.Trigger className="TabsTrigger" value="tab1">
            Register
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="tab2">
            Login
          </Tabs.Trigger>
        </Tabs.List>

        {/* 📝 Registration Form */}
        <Tabs.Content className="TabsContent" value="tab1">
          <Flex gap="2">
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="first_name">
                First Name
              </label>
              <input
                className="Input"
                id="first_name"
                name="first_name"
                placeholder="First Name"
                required
                onChange={handleChange}
                value={registerData.first_name}
              />
              {errors.first_name && <span className="error text-red-600">{errors.first_name}</span>}
            </fieldset>

            <fieldset className="Fieldset">
              <label className="Label" htmlFor="last_name">
                Last Name
              </label>
              <input
                className="Input"
                id="last_name"
                name="last_name"
                placeholder="Last Name"
                required
                onChange={handleChange}
                value={registerData.last_name}
              />
              {errors.last_name && <span className="error text-red-600">{errors.last_name}</span>}
            </fieldset>
          </Flex>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="username">
              Username
            </label>
            <input
              className="Input"
              id="username"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              value={registerData.username}
            />
            {errors.username && <span className="error text-red-600">{errors.username}</span>}
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="Input"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={registerData.email}
              required
            />
            {errors.email && <span className="error text-red-600">{errors.email}</span>}
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="Input"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={registerData.password}
              required
            />
            {errors.password && <span className="error text-red-600">{errors.password}</span>}
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="role">
              Account Type
            </label>
            <Select.Root value={registerData.role} onValueChange={handleSelection} required>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="customer">Customer</Select.Item>
                <Select.Item value="artist">Artist</Select.Item>
              </Select.Content>
            </Select.Root>
            {errors.role && <span className="error text-red-600">{errors.role}</span>}
          </fieldset>

          <button className="Button green" onClick={handleSubmit}>
            Register
          </button>
        </Tabs.Content>

        {/* 🔐 Login Form */}
        <Tabs.Content className="TabsContent" value="tab2">
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="login_username">
              Username
            </label>
            <input
              className="Input"
              id="login_username"
              name="username"
              placeholder="Username"
              required
              onChange={handleLchange}
              value={loginData.username}
            />
            {errors.username && <span className="error text-red-600">{errors.username}</span>}
          </fieldset>

          <fieldset className="Fieldset">
            <label className="Label" htmlFor="login_password">
              Password
            </label>
            <input
              type="password"
              className="Input"
              id="login_password"
              name="password"
              placeholder="Password"
              onChange={handleLchange}
              value={loginData.password}
              required
            />
            {errors.password && <span className="error text-red-600">{errors.password}</span>}
          </fieldset>

          <div className="flex flex-col space-y-2">
            <button className="Button green" onClick={handleLSubmit}>
              Login
            </button>
            <button className="Button blue" onClick={navigatereset}>
              Forgot Password
            </button>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* 🎉 Dialog Box for Status */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{loading ? 'Loading...' : isSuccess ? 'Success' : 'Error'}</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress color="success" />
          ) : (
            <DialogContentText>{dialogMessage}</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus disabled={loading}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
