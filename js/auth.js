// auth.js - JavaScript for authentication pages

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.closest('.input-with-icon').querySelector('input');
            
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Account type selector (for signup page)
    const accountTypes = document.querySelectorAll('.account-type');
    
    if (accountTypes.length > 0) {
        accountTypes.forEach(type => {
            type.addEventListener('click', function() {
                accountTypes.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Password strength meter
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const requirements = document.querySelectorAll('.requirement');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
    
    function updatePasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        
        // Check requirements
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        
        // Update requirement indicators
        if (requirements.length > 0) {
            toggleRequirement('length', hasLength);
            toggleRequirement('uppercase', hasUppercase);
            toggleRequirement('lowercase', hasLowercase);
            toggleRequirement('number', hasNumber);
            toggleRequirement('special', hasSpecial);
        }
        
        // Calculate strength
        if (password.length > 0) strength++;
        if (hasUppercase && hasLowercase) strength++;
        if (hasNumber) strength++;
        if (hasSpecial) strength++;
        
        // Update strength meter
        if (strengthMeter) {
            strengthMeter.setAttribute('data-strength', strength);
        }
        
        // Check password confirmation if available
        if (confirmPasswordInput && confirmPasswordInput.value) {
            validatePasswordMatch();
        }
    }
    
    function toggleRequirement(name, isValid) {
        const req = document.querySelector(`.requirement[data-requirement="${name}"]`);
        if (req) {
            if (isValid) {
                req.classList.add('valid');
            } else {
                req.classList.remove('valid');
            }
        }
    }
    
    // Password confirmation validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    
    function validatePasswordMatch() {
        if (passwordInput.value === confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('');
        } else {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        }
    }
    
    // Form validation
    const forms = document.querySelectorAll('.auth-form');

})

const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        const role = document.querySelector('.account-type.active')?.id === 'provider-type'
            ? 'provider' : 'customer';

        try {
            const res = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, phone, password, role })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Signup successful!');
                // You can also store the token like:
                // localStorage.setItem('token', data.token);
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Something went wrong');
        }
    });
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Login successful!');
                // Optional: Store the token
                localStorage.setItem('token', data.token);
                // Redirect to landing or dashboard page
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Something went wrong');
        }
    });
}
