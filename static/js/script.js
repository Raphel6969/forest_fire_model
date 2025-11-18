// Get DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const analyzeBtn = document.getElementById('analyzeBtn');
const spinner = document.getElementById('spinner');
const result = document.getElementById('result');
const resultLabel = document.getElementById('resultLabel');

let selectedFile = null;

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File selection handler
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// Handle file selection
function handleFile(file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.add('show');
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// Analyze button handler
analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    // Hide previous result
    result.classList.remove('show', 'result-fire', 'result-no-fire');

    // Show spinner and disable button
    spinner.classList.add('show');
    analyzeBtn.disabled = true;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        // Hide spinner
        spinner.classList.remove('show');

        if (data.success) {
            resultLabel.textContent = data.label;
            if (data.label.includes('Fire')) {
                result.classList.add('result-fire');
            } else {
                result.classList.add('result-no-fire');
            }
            result.classList.add('show');
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        spinner.classList.remove('show');
        alert('Error analyzing image: ' + error.message);
    } finally {
        analyzeBtn.disabled = false;
    }
});
