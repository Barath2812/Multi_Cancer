// Global variables
let selectedFile = null;

// File upload handling
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (!fileInput || !uploadArea) return;
    
    // File input change event
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('click', (e) => {
        // Avoid reopening file dialog when clicking buttons/preview after upload
        if (selectedFile) return;
        if (e.target.closest('#previewContainer')) return;
        fileInput.click();
    });
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
});

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PNG, JPG, or JPEG image.');
        return;
    }
    
    // Validate file size (16MB max)
    const maxSize = 16 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('File size must be less than 16MB.');
        return;
    }
    
    selectedFile = file;
    displayPreview(file);
}

function displayPreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const uploadContent = document.getElementById('uploadContent');
        const previewContainer = document.getElementById('previewContainer');
        const imagePreview = document.getElementById('imagePreview');
        
        imagePreview.src = e.target.result;
        uploadContent.style.display = 'none';
        previewContainer.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
}

function removeImage() {
    selectedFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadContent').style.display = 'block';
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
}

async function analyzeImage() {
    if (!selectedFile) {
        alert('Please select an image first.');
        return;
    }
    
    // Show results section with loading state
    const resultsSection = document.getElementById('resultsSection');
    const loadingState = document.getElementById('loadingState');
    const resultsContent = document.getElementById('resultsContent');
    
    resultsSection.style.display = 'block';
    loadingState.style.display = 'block';
    resultsContent.style.display = 'none';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
        // Make API request
        const response = await fetch(`/predict/${cancerType}`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            displayResults(data);
        } else {
            throw new Error(data.message || 'Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        loadingState.innerHTML = `
            <div style="color: var(--danger-color);">
                <svg viewBox="0 0 24 24" fill="none" style="width: 50px; height: 50px; margin: 0 auto; stroke: currentColor;">
                    <circle cx="12" cy="12" r="10" stroke-width="2"/>
                    <path d="M12 8v4M12 16h.01" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3 style="margin-top: 1rem;">Analysis Failed</h3>
                <p style="color: var(--text-secondary); margin-top: 0.5rem;">${error.message}</p>
                <button onclick="resetAnalysis()" class="action-button primary" style="margin-top: 1.5rem;">Try Again</button>
            </div>
        `;
    }
}

function displayResults(data) {
    const loadingState = document.getElementById('loadingState');
    const resultsContent = document.getElementById('resultsContent');
    const predictionResult = document.getElementById('predictionResult');
    const confidenceValue = document.getElementById('confidenceValue');
    const confidenceFill = document.getElementById('confidenceFill');
    const allPredictions = document.getElementById('allPredictions');
    
    // Hide loading, show results
    loadingState.style.display = 'none';
    resultsContent.style.display = 'block';
    
    // Display main prediction
    predictionResult.textContent = data.prediction;
    
    // Determine color based on prediction
    if (data.prediction.toLowerCase().includes('malignant') || 
        data.prediction.toLowerCase().includes('tumor') ||
        data.prediction.toLowerCase().includes('cancer') ||
        data.prediction.toLowerCase().includes('abnormal') ||
        data.prediction.toLowerCase().includes('stone')) {
        predictionResult.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        predictionResult.style.webkitBackgroundClip = 'text';
        predictionResult.style.webkitTextFillColor = 'transparent';
    } else {
        predictionResult.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        predictionResult.style.webkitBackgroundClip = 'text';
        predictionResult.style.webkitTextFillColor = 'transparent';
    }
    
    // Display confidence
    confidenceValue.textContent = `${data.confidence}%`;
    setTimeout(() => {
        confidenceFill.style.width = `${data.confidence}%`;
    }, 100);
    
    // Display all predictions
    allPredictions.innerHTML = '<h3 style="margin-bottom: 1rem; font-size: 1.1rem;">Detailed Results</h3>';
    for (const [className, probability] of Object.entries(data.all_predictions)) {
        allPredictions.innerHTML += `
            <div class="prediction-item">
                <span>${className}</span>
                <span style="font-weight: 600; color: var(--primary-light);">${probability}%</span>
            </div>
        `;
    }
}

function resetAnalysis() {
    // Reset file input
    removeImage();
    
    // Scroll back to upload area
    document.getElementById('uploadArea').scrollIntoView({ behavior: 'smooth' });
}

// Utility function for formatting
function formatClassName(className) {
    return className
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
