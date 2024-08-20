export const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!re.test(email)) {
    return {valid: false, message: 'Enter a valid email'};
  }

  const normalizedEmail = email.trim().toLowerCase();

  return {valid: true, normalizedEmail};
};

export const validatePasswordRegister = password => {
  const errors = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain a number');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain a special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateDisplayName = displayName => {
  const errors = [];

  if (typeof displayName !== 'string' || displayName.trim() === '') {
    errors.push('Display name must be a valid string');
  } else {
    const trimmedDisplayName = displayName.trim();

    if (trimmedDisplayName.length < 4) {
      errors.push('Display name must be at least 4 characters long');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateConfirmationCode = code => {
  const codePattern = /^\d{6}$/;
  return codePattern.test(code);
};
