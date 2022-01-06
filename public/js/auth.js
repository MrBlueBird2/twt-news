var login = document.getElementsByClassName("form-content")[0];
var register = document.getElementsByClassName("form-content")[1];
var loginRoot = document.getElementsByClassName("login-container")[0];
var registerRoot = document.getElementsByClassName("register-container")[0];
var formInputs = document.getElementsByClassName("form-input");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const registerFormError = document.getElementById("register-form-error");
const loginFormError = document.getElementById("login-form-error");

loginForm.addEventListener("submit", submitLoginForm);
registerForm.addEventListener("submit", submitRegisterForm);

for (let i = 0; i < formInputs.length; i++) {
	formInputs[i].addEventListener(
		"keydown",
		function (event) {
			if (event.key === "Enter") {
				formInputs[i].blur();
				event.preventDefault();
				return false;
			}
			return true;
		},
		true
	);
}

function remake(ele) {
	setTimeout(() => {
		let val = ele.value;
		let id = ele.id;
		ele.outerhtml = ele.outerhtml;
		document.getElementById(id).value = val;
		return true;
	});
}

function registerRedirect() {
	loginRoot.style.zIndex = "0";
	registerRoot.style.zIndex = "1";
	login.classList.add("tilt-in-rev-tl");
	register.classList.add("tilt-in-fwd-br");
	register.classList.remove("hidden");
	setTimeout(() => {
		register.classList.remove("tilt-in-fwd-br");
		login.classList.remove("tilt-in-rev-tl");
		login.classList.add("hidden");
	}, 600);
}

function loginRedirect() {
	registerRoot.style.zIndex = "0";
	loginRoot.style.zIndex = "1";
	register.classList.add("tilt-in-rev-br");
	login.classList.add("tilt-in-fwd-tl");
	login.classList.remove("hidden");
	setTimeout(() => {
		login.classList.remove("tilt-in-fwd-tl");
		register.classList.remove("tilt-in-rev-br");
		register.classList.add("hidden");
	}, 600);
}

async function submitLoginForm(event) {
	event.preventDefault();
	const email = document.getElementById("login-email-input").value;
	const password = document.getElementById("login-password-input").value;
	const result = await fetch("/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	})
		.then(async (data) => await data.json())
		.catch((err) => {
			console.log(err);
			loginFormError.innerText = "An error occurred.";
			loginFormError.classList.remove("hidden");
		});
	if (result.status === "error") {
		loginFormError.innerText = result.error;
		loginFormError.classList.remove("hidden");
	} else {
		loginFormError.classList.add("hidden");
		window.location.href = "/posts";
	}
}

async function submitRegisterForm(event) {
	event.preventDefault();
	grecaptcha.ready(function() {
		grecaptcha.execute('6LdluvUdAAAAAHzi7lV8XpHwj5gpv1yfDEjeYVoL', { action: 'submit' }).then(registerUser);
	});
}

async function registerUser(token) {
	const name = document.getElementById("register-name-input").value;
	const email = document.getElementById("register-email-input").value;
	const password = document.getElementById("register-password-input").value;
	const captchaToken = token;
	const result = await fetch("/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			email,
			password,
			captchaToken
		}),
	})
		.then(async (data) => await data.json())
		.catch((err) => {
			console.log(err);
			registerFormError.innerText = "An error occurred.";
			registerFormError.classList.remove("hidden");
		});
	if (result.status === "error") {
		registerFormError.innerText = result.error;
		registerFormError.classList.remove("hidden");
	} else {
		registerFormError.classList.add("hidden");
		window.location.href = "/posts";
	}
}
