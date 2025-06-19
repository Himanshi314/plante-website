/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}


/*=============== REMOVE MENU MOBILE ===============*/
const navLink=document.querySelectorAll('.nav__link')
const linkAction=()=>{
    const navMenu= document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n=> n.addEventListener('click',linkAction))
    
/*=============== SWIPER HOME ===============*/
document.addEventListener('DOMContentLoaded', function () {
  const homeSwiper = new Swiper('.home__swiper', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    effect: 'fade',
  });
});



/*=============== CHANGE BACKGROUND HEADER ===============*/
function bgHeader() {
  const nav = document.querySelector('.header');
  if (window.scrollY >= 50) nav.classList.add('bg-header');
  else nav.classList.remove('bg-header');
}
window.addEventListener('scroll', bgHeader);




// Cart logic
let cart = [];

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  cartItemsDiv.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" style="width:40px;height:40px;border-radius:8px;margin-right:8px;">
      <span>${item.name} - $${item.price}</span>
      <button onclick="removeFromCart(${idx})" style="margin-left:10px;background:none;border:none;color:#a68a64;cursor:pointer;">Remove</button>
    </div>
  `).join("");
}

window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  updateCartCount();
  renderCart();
};

document.querySelectorAll('.shop__cart-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const name = this.dataset.name;
    const price = this.dataset.price;
    const img = this.dataset.img;
    cart.push({ name, price, img });
    updateCartCount();
    renderCart();
  });
});

// Cart modal logic
const cartModal = document.getElementById('cart-modal');
const cartButton = document.getElementById('cart-button');
const cartClose = document.getElementById('cart-close');

cartButton.addEventListener('click', () => {
  cartModal.classList.add('open');
  renderCart();
});
cartClose.addEventListener('click', () => {
  cartModal.classList.remove('open');
});

// Optional: Hide modal on outside click
cartModal.addEventListener('click', function(e){
  if(e.target === cartModal) cartModal.classList.remove('open');
});

// Initialize
updateCartCount();

/*=============== SWIPER TESTIMONIAL ===============*/

const swiperTestimonial= new Swiper('.testimonial__swiper', {

loop: true,
slidesPerView:'auto',
spaceBetween: 48,
grabCursor:true,
navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
})

/*=============== SHOW SCROLL UP ===============*/ 

/*=============== VOICE ASSISTANT ===============*/
const voiceButton = document.getElementById('voice-button');
const voicePanel = document.getElementById('voice-panel');
const voiceStatus = document.getElementById('voice-status');
const voiceAssistant = document.getElementById('voice-assistant');
let threadId = null;

async function sendToAI(transcript) {
  const response = await fetch('http://localhost:3000/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: transcript, threadId })
  });
  const data = await response.json();
  threadId = data.threadId; // For conversation context
  return data.reply;
}


// Show/hide panel on button click
voiceButton.addEventListener('click', () => {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    voicePanel.classList.remove('hidden');
    voiceButton.classList.add('listening');
    startListening();
  } else {
    voicePanel.classList.remove('hidden');
    voiceStatus.textContent = "Voice not supported in this browser.";
  }
});

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.start();
  voiceStatus.textContent = "Listening... Speak now";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("Transcript:", transcript); // Debug
    voiceStatus.textContent = `Heard: "${transcript}"`;
    processVoiceCommand(transcript);
    voiceButton.classList.remove('listening');
  };

  recognition.onerror = (event) => {
    console.log("SpeechRecognition error:", event.error); // Debug
    voiceStatus.textContent = "Error: " + event.error;
    voiceButton.classList.remove('listening');
  };

  recognition.onend = () => {
    voiceButton.classList.remove('listening');
    setTimeout(() => voicePanel.classList.add('hidden'), 1500);
  };
}


function processVoiceCommand(transcript) {
  // Navigation
  if (transcript.includes('home')) {
    window.location.hash = '#home';
    speakResponse("Going to home");
  } else if (transcript.includes('shop') || transcript.includes('store')) {
    window.location.hash = '#shop';
    speakResponse("Opening shop");
  } else if (transcript.includes('vibe') || transcript.includes('mood')) {
    window.location.hash = '#vibe';
    speakResponse("Showing plant vibes");
  } else if (transcript.includes('testimonial') || transcript.includes('review')) {
    window.location.hash = '#testimonial';
    speakResponse("Showing testimonials");
  }
  // Cart
  else if (transcript.includes('add to cart') || transcript.includes('buy')) {
    const firstItem = document.querySelector('.shop__cart-btn');
    if (firstItem) {
      firstItem.click();
      speakResponse("Item added to cart");
    } else {
      speakResponse("No item found to add");
    }
  }
  else if (transcript.includes('view cart') || transcript.includes('my cart')) {
    const cartBtn = document.getElementById('cart-button');
    if (cartBtn) {
      cartBtn.click();
      speakResponse("Showing your cart");
    } else {
      speakResponse("Cart button not found");
    }
  }
  // Dashboard
  else if (transcript.includes('my plant') || transcript.includes('dashboard')) {
    window.location.href = 'checklist.html';
    speakResponse("Showing your plant dashboard");
  }
  // Scrolling
  else if (transcript.includes('scroll down')) {
    window.scrollBy(0, 500);
    speakResponse("Scrolling down");
  }
  else if (transcript.includes('scroll up')) {
    window.scrollBy(0, -500);
    speakResponse("Scrolling up");
  }
  else {
    speakResponse("Sorry, I didn't understand that");
  }
}

function speakResponse(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  }
}

// Optional: Hide panel when clicking outside
document.addEventListener('click', function(e) {
  if (!voiceAssistant.contains(e.target)) {
    voicePanel.classList.add('hidden');
    voiceButton.classList.remove('listening');
  }
});


/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)
/*=============== DARK LIGHT THEME ===============*/ 
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-fill' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-fill' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})
const sr= ScrollReveal({
    origin:'top',
    distance:'60px',
    duration: 2000,
    delay: 300,
})
sr.reveal('.home__container,.testimonial__container')
sr.reveal('.home__title',{delay:600})
sr.reveal('.home__description',{delay:900})
sr.reveal('.home__data .button',{delay:1200})
sr.reveal('.shop__card',{interval:100})
sr.reveal('.join__data',{origin: 'left'})
sr.reveal('.join__img',{origin: 'right'})
document.addEventListener('DOMContentLoaded', () => {
  const signupLink = document.querySelector('a[href="#signup"]'); // Adjust selector if needed
  const blurOverlay = document.getElementById('blur-overlay');
  const signupSidebar = document.getElementById('signup-sidebar');
  const closeBtn = document.getElementById('close-signup');

  function openSignup() {
    blurOverlay.classList.remove('hidden');
    signupSidebar.classList.add('active');
    signupSidebar.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeSignup() {
    signupSidebar.classList.remove('active');
    blurOverlay.classList.add('hidden');
    // Delay hiding sidebar to allow transition
    setTimeout(() => signupSidebar.classList.add('hidden'), 300);
    document.body.style.overflow = ''; // Restore scroll
  }

  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    openSignup();
  });

  closeBtn.addEventListener('click', closeSignup);
  blurOverlay.addEventListener('click', closeSignup);

  // Optional: handle form submission
  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Signup form submitted! Implement your logic here.');
    closeSignup();
  });
});
