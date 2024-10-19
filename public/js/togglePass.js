const togglePassword = document.querySelector('#togglePass');
const password = document.querySelector('#password');
const passImg = document.querySelector('#passImg');

togglePassword.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text';
        // change the image shown
        passImg.src = '/images/icons/eye-slash-regular.svg';
        passImg.title = 'Hide Password';
    } else {
        password.type = 'password';
        // change the image shown
        passImg.src = '/images/icons/eye-regular.svg';
        passImg.title = 'Show Password';
    }
});