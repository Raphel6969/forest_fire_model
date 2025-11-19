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
    console.log('Analyze button clicked');
    if (!selectedFile) {
        console.log('No file selected');
        return;
    }
    console.log('File selected:', selectedFile.name);

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

            // Check if button already exists to avoid duplicates
            let analysisBtn = document.getElementById('viewAnalysisBtn');
            if (!analysisBtn) {
                analysisBtn = document.createElement('a');
                analysisBtn.id = 'viewAnalysisBtn';
                analysisBtn.className = 'analyze-button';
                analysisBtn.style.marginTop = '1rem';
                analysisBtn.style.display = 'inline-block';
                analysisBtn.style.textDecoration = 'none';
                analysisBtn.style.background = 'linear-gradient(135deg, #4a90e2, #007bff)'; // Different color to distinguish
                analysisBtn.textContent = 'View Detailed Analysis 📊';
                result.appendChild(analysisBtn);
            }

            // Update href with the image filename
            // We need the filename from the response. 
            // The response returns 'image': 'static/uploads/filename.jpg'
            // We need just the filename.
            const filename = data.image.split('/').pop().split('\\').pop();
            analysisBtn.href = `/analysis/${filename}`;

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
