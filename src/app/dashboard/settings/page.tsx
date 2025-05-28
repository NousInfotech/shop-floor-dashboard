"use client";
import React, { useState } from 'react';
import { User, Mail, Lock, Edit, Save, X, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface PasswordForm {
  current: string;
  new: string;
  confirm: string;
  isEditing: boolean;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
}
const SettingsPage = () => {
  type Errors = {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};


  // Current user data (simulated)
  const [currentUser, setCurrentUser] = useState({
    username: 'john_doe',
    email: 'john.doe@example.com',
    lastLogin: 'May 27, 2025'
  });

  // Form states
  const [usernameForm, setUsernameForm] = useState({
    current: '',
    new: '',
    isEditing: false
  });
  
  const [emailForm, setEmailForm] = useState({
    current: '',
    new: '',
    isEditing: false
  });
  
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
  current: '',
  new: '',
  confirm: '',
  isEditing: false,
  showCurrent: false,
  showNew: false,
  showConfirm: false
});


  // Dialog states
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    title: '',
    message: ''
  });
  type ConfirmDialog = {
  open: boolean;
  title: string;
  message: string;
  action: (() => void) | null; // Allow both function or null
};

const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
  open: false,
  title: '',
  message: '',
  action: null,
});

  const [forgotPasswordDialog, setForgotPasswordDialog] = useState({
    open: false,
    email: '',
    step: 1 // 1: enter email, 2: confirmation
  });

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Validation errors
const [errors, setErrors] = useState<Errors>({});

 const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

  // Handle username change
  const handleUsernameEdit = () => {
    setUsernameForm({
      ...usernameForm,
      current: currentUser.username,
      new: '',
      isEditing: true
    });
    setErrors({});
  };

  const handleUsernameSave = () => {
    if (!usernameForm.new.trim()) {
      setErrors({ username: 'Username cannot be empty' });
      return;
    }
    
    if (usernameForm.new.length < 3) {
      setErrors({ username: 'Username must be at least 3 characters' });
      return;
    }

   setConfirmDialog({
  open: false,
  title: '',
  message: '',
  action: null, // ← TypeScript expects this to be null, but earlier you set it to a function
});

  };

  // Handle email change
  const handleEmailEdit = () => {
    setEmailForm({
      ...emailForm,
      current: currentUser.email,
      new: '',
      isEditing: true
    });
    setErrors({});
  };

  const handleEmailSave = () => {
    if (!validateEmail(emailForm.new)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Confirm Email Change',
      message: `Are you sure you want to change your email from "${emailForm.current}" to "${emailForm.new}"? You will need to verify the new email address.`,
      action: () => {
        setCurrentUser({ ...currentUser, email: emailForm.new });
        setEmailForm({ current: '', new: '', isEditing: false });
        setSuccessDialog({
          open: true,
          title: 'Email Updated',
          message: 'Your email has been updated! Please check your new email for verification.'
        });
        setConfirmDialog({ open: false, title: '', message: '', action: null });
      }
    });
  };

  // Handle password change
  const handlePasswordEdit = () => {
    setPasswordForm({
      current: '',
      new: '',
      confirm: '',
      isEditing: true,
      showCurrent: false,
      showNew: false,
      showConfirm: false
    });
    setErrors({});
  };

 const handlePasswordSave = () => {
  const newErrors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  } = {};

  if (!passwordForm.current) {
    newErrors.currentPassword = 'Current password is required';
  }

  if (!validatePassword(passwordForm.new)) {
    newErrors.newPassword = 'Password must be at least 8 characters';
  }

  if (passwordForm.new !== passwordForm.confirm) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setConfirmDialog({
    open: true,
    title: 'Confirm Password Change',
    message: 'Are you sure you want to change your password?',
    action: () => {
      setPasswordForm({
        current: '',
        new: '',
        confirm: '',
        isEditing: false,
        showCurrent: false,
        showNew: false,
        showConfirm: false
      });
      setSuccessDialog({
        open: true,
        title: 'Password Updated',
        message: 'Your password has been successfully updated!'
      });
      setConfirmDialog({
        open: false,
        title: '',
        message: '',
        action: null

      });
    }
  });
};


  // Handle forgot password
  const handleForgotPassword = () => {
    setForgotPasswordDialog({
      open: true,
      email: currentUser.email,
      step: 1
    });
  };

  const handleForgotPasswordSubmit = () => {
    if (!validateEmail(forgotPasswordDialog.email)) {
      setNotification({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }

    setForgotPasswordDialog({
      ...forgotPasswordDialog,
      step: 2
    });
  };

  const handleCancel = (type : string) => {
    switch (type) {
      case 'username':
        setUsernameForm({ current: '', new: '', isEditing: false });
        break;
      case 'email':
        setEmailForm({ current: '', new: '', isEditing: false });
        break;
      case 'password':
        setPasswordForm({
          current: '',
          new: '',
          confirm: '',
          isEditing: false,
          showCurrent: false,
          showNew: false,
          showConfirm: false
        });
        break;
    }
    setErrors({});
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600">Manage your account information and security settings</p>
            </div>
          </div>
        </div>

        {/* Current Account Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-medium text-gray-900">{currentUser.username}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-900">{currentUser.email}</p>
            </div>
            <div className="col-span-full">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Last login: {currentUser.lastLogin}
              </span>
            </div>
          </div>
        </div>

        {/* Username Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Username</h2>
            </div>
            {!usernameForm.isEditing && (
              <button
                onClick={handleUsernameEdit}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="w-4 h-4" />
                Change Username
              </button>
            )}
          </div>

          {usernameForm.isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Username</label>
                <input
                  type="text"
                  value={usernameForm.current}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Username</label>
                <input
                  type="text"
                  value={usernameForm.new}
                  onChange={(e) => setUsernameForm({ ...usernameForm, new: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUsernameSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleCancel('username')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Current username: <strong>{currentUser.username}</strong>
            </p>
          )}
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Email</h2>
            </div>
            {!emailForm.isEditing && (
              <button
                onClick={handleEmailEdit}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="w-4 h-4" />
                Change Email
              </button>
            )}
          </div>

          {emailForm.isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Email</label>
                <input
                  type="email"
                  value={emailForm.current}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
                <input
                  type="email"
                  value={emailForm.new}
                  onChange={(e) => setEmailForm({ ...emailForm, new: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEmailSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleCancel('email')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Current email: <strong>{currentUser.email}</strong>
            </p>
          )}
        </div>

        {/* Password Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Password</h2>
            </div>
            <div className="flex gap-3">
              {!passwordForm.isEditing && (
                <>
                  <button
                    onClick={handlePasswordEdit}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="w-4 h-4" />
                    Change Password
                  </button>
                  <button
                    onClick={handleForgotPassword}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Forgot Password?
                  </button>
                </>
              )}
            </div>
          </div>

          {passwordForm.isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={passwordForm.showCurrent ? 'text' : 'password'}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showCurrent: !passwordForm.showCurrent })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {passwordForm.showCurrent ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={passwordForm.showNew ? 'text' : 'password'}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showNew: !passwordForm.showNew })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {passwordForm.showNew ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword ? (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={passwordForm.showConfirm ? 'text' : 'password'}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showConfirm: !passwordForm.showConfirm })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {passwordForm.showConfirm ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePasswordSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleCancel('password')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Password last changed: May 15, 2025
            </p>
          )}
        </div>

        {/* Success Dialog */}
        {successDialog.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{successDialog.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{successDialog.message}</p>
              <button
                onClick={() => setSuccessDialog({ open: false, title: '', message: '' })}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDialog.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{confirmDialog.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog({ open: false, title: '', message: '', action: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
               <button
  onClick={confirmDialog.action ?? undefined}
  // or more explicitly:
 
  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
>
  Confirm
</button>

              </div>
            </div>
          </div>
        )}

        {/* Forgot Password Dialog */}
        {forgotPasswordDialog.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {forgotPasswordDialog.step === 1 ? 'Reset Password' : 'Check Your Email'}
                </h3>
              </div>
              
              {forgotPasswordDialog.step === 1 ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    {"Enter your email address and we'll send you a link to reset your password."}
                  </p>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={forgotPasswordDialog.email}
                      onChange={(e) => setForgotPasswordDialog({ ...forgotPasswordDialog, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setForgotPasswordDialog({ open: false, email: '', step: 1 })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleForgotPasswordSubmit}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Link Sent!</h4>
                  <p className="text-gray-600 mb-6">
                   {" We've sent a password reset link to"} <strong>{forgotPasswordDialog.email}</strong>.
                    Please check your email and follow the instructions to reset your password.
                  </p>
                  <button
                    onClick={() => setForgotPasswordDialog({ open: false, email: '', step: 1 })}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notification */}
        {notification.open && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`p-4 rounded-md shadow-lg ${
              notification.severity === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
              notification.severity === 'error' ? 'bg-red-50 border-l-4 border-red-400' :
              'bg-blue-50 border-l-4 border-blue-400'
            }`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm ${
                  notification.severity === 'success' ? 'text-green-800' :
                  notification.severity === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {notification.message}
                </p>
                <button
                  onClick={closeNotification}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;