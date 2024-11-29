// Scroll to the results section if there's a prediction
window.onload = function () {
    const predictionSection = document.getElementById('prediction-section');
    if (predictionSection && predictionSection.innerText.trim()) {
        predictionSection.scrollIntoView({ behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    let isAnimating = false;

    function toggleMenu() {
        if (isAnimating) return;
        isAnimating = true;

        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Update ARIA attributes
        const isExpanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);

        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    // Toggle menu on button click
    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInside = navLinks.contains(e.target) || 
                            navToggle.contains(e.target);
        
        if (!isClickInside && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
});

        
// Get DOM elements
const fileUpload = document.getElementById('file-upload');
const previewContainer = document.getElementById('preview');
const previewImage = document.getElementById('preview-image');
const cameraContainer = document.getElementById('camera-container');
const cameraPreview = document.getElementById('camera-preview');
const captureButton = document.getElementById('capture-button');
const cancelCamera = document.getElementById('cancel-camera');
let stream = null;

// Function to handle file preview
function handleFilePreview(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.hidden = false;
            previewContainer.style.display = 'flex';
            previewContainer.style.justifyContent = 'center';
            previewContainer.style.alignItems = 'center';
            cameraContainer.hidden = true;
        }
        reader.readAsDataURL(file);
    }
}

// Handle file upload
fileUpload.addEventListener('change', function(e) {
    handleFilePreview(e.target.files[0]);
});

// Start camera stream
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }, 
            audio: false 
        });
        cameraPreview.srcObject = stream;
        previewContainer.hidden = true;
        previewContainer.removeAttribute('style');
        cameraContainer.hidden = false;
    } catch (err) {
        alert('Unable to access camera: ' + err.message);
    }
}

// Stop camera stream
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    cameraContainer.hidden = true;
}

// Handle camera button click
document.querySelector('.camera-label').addEventListener('click', function(e) {
    e.preventDefault();
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        startCamera();
    } else {
        alert('Sorry, your browser doesn\'t support accessing the camera');
    }
});

// Handle capture button click
captureButton.addEventListener('click', function() {
    const canvas = document.createElement('canvas');
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    canvas.getContext('2d').drawImage(cameraPreview, 0, 0);
    
    canvas.toBlob(function(blob) {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        
        // Create a new FileList containing the captured image
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileUpload.files = dataTransfer.files;
        
        handleFilePreview(file);
        stopCamera();
    }, 'image/jpeg');
});

// Handle cancel button click
cancelCamera.addEventListener('click', stopCamera);

// Handle drag and drop
const uploadBox = document.querySelector('.upload-box');

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFilePreview(file);
        fileUpload.files = e.dataTransfer.files;
    }
});


const fileInput = document.getElementById("file-upload");
const errorMessage = document.getElementById("error-message");
const allowedExtensions = ["png", "jpg", "jpeg", "gif"]; // Allowed file extensions
const maxSize = 5 * 1024 * 1024; // 2 MB max size

// Handle form submission
document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();


    // Reset error message
    errorMessage.textContent = "";

    if (!fileInput.files.length) {
        errorMessage.hidden = false;
        errorMessage.textContent = "No file selected. Please upload a file.";
        return;
    }

    const file = fileInput.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Validate file type
    if (!allowedExtensions.includes(fileExtension)) {
        errorMessage.hidden = false;
        errorMessage.textContent = "Invalid file type. Please upload an image file (png, jpg, jpeg, gif).";
        return;
    }

    // Validate file size
    if (file.size > maxSize) {
        errorMessage.hidden = false;
        errorMessage.textContent = `File size exceeds 2 MB. Your file size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`;
        return;
    }
    this.submit();
});

 // Event listener for file selection
 fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileExtension = file.name.split(".").pop().toLowerCase();

        // Validate file type
        if (!allowedExtensions.includes(fileExtension)) {
            errorMessage.textContent = "Invalid file type. Please upload an image file (png, jpg, jpeg, gif).";
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            errorMessage.textContent = `File size exceeds 2 MB. Your file size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`;
            return;
        }

        // Clear error message if file is valid
        errorMessage.textContent = "";
    }
});


function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const contactSection = document.querySelector('.contact-section');
    
    // Create thank you message
    const thankYouMessage = document.createElement('div');
    thankYouMessage.className = 'thank-you-message';
    thankYouMessage.innerHTML = `
        <div class="thank-you-content">
            <i class="fas fa-check-circle"></i>
            <h2>Thank You!</h2>
            <p>Your message has been sent successfully. We'll get back to you soon.</p>
            <button onclick="resetForm()" class="reset-btn">Send Another Message</button>
        </div>
    `;
    
    // Hide the form container and show thank you message
    const contactContainer = document.querySelector('.contact-container');
    contactContainer.style.display = 'none';
    contactSection.appendChild(thankYouMessage);
    
    // Reset the form
    form.reset();
}

function resetForm() {
    const thankYouMessage = document.querySelector('.thank-you-message');
    const contactContainer = document.querySelector('.contact-container');
    
    // Remove thank you message and show form
    if (thankYouMessage) {
        thankYouMessage.remove();
    }
    contactContainer.style.display = 'grid';
}