// Application state
let appState = {
    csvData: null,
    companiesCount: 0,
    competitorMethod: 'auto',
    competitors: ['Zendesk', 'Salesforce', 'HubSpot', 'Intercom']
};

// DOM elements
const form = document.getElementById('prioritizationForm');
const fileUploadArea = document.getElementById('fileUploadArea');
const csvFileInput = document.getElementById('csvFile');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const rowCount = document.getElementById('rowCount');
const companyCount = document.getElementById('companyCount');
const totalCost = document.getElementById('totalCost');
const manualCompetitors = document.getElementById('manualCompetitors');
const competitorPreview = document.getElementById('competitorPreview');
const competitorTags = document.getElementById('competitorTags');
const competitorList = document.getElementById('competitorList');
const submitButton = document.getElementById('submitButton');
const progressIndicator = document.getElementById('progressIndicator');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCostCalculator();
});

// Setup event listeners
function setupEventListeners() {
    // File upload events
    fileUploadArea.addEventListener('click', () => csvFileInput.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('drop', handleDrop);
    fileUploadArea.addEventListener('dragenter', handleDragEnter);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    csvFileInput.addEventListener('change', handleFileSelect);

    // Radio button events
    document.querySelectorAll('input[name="competitorMethod"]').forEach(radio => {
        radio.addEventListener('change', handleCompetitorMethodChange);
    });

    // Manual competitor input
    competitorList.addEventListener('input', handleManualCompetitorInput);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Company URL input for auto-competitor detection
    document.getElementById('companyUrl').addEventListener('input', handleCompanyUrlChange);
}

// File upload handlers
function handleDragOver(e) {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
}

function handleDragEnter(e) {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file.');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
    }

    // Display file information
    fileName.textContent = `File: ${file.name}`;
    fileSize.textContent = `Size: ${formatFileSize(file.size)}`;
    fileInfo.style.display = 'block';

    // Read and parse CSV
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        parseCsvData(csvContent);
    };
    reader.readAsText(file);
}

function parseCsvData(csvContent) {
    const lines = csvContent.split('\n');
    const dataRows = lines.filter(line => line.trim().length > 0);
    
    // Remove header row
    const companiesData = dataRows.slice(1);
    
    appState.csvData = companiesData;
    appState.companiesCount = companiesData.length;
    
    rowCount.textContent = `Companies: ${appState.companiesCount}`;
    updateCostCalculator();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Competitor method handlers
function handleCompetitorMethodChange(e) {
    appState.competitorMethod = e.target.value;
    
    if (appState.competitorMethod === 'manual') {
        manualCompetitors.style.display = 'block';
        competitorPreview.style.display = 'none';
    } else {
        manualCompetitors.style.display = 'none';
        competitorPreview.style.display = 'block';
        updateAutoCompetitors();
    }
}

function handleManualCompetitorInput(e) {
    const competitors = e.target.value.split('\n').filter(comp => comp.trim().length > 0);
    appState.competitors = competitors;
    
    // Update competitor tags display
    competitorTags.innerHTML = '';
    competitors.forEach(competitor => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = competitor.trim();
        competitorTags.appendChild(tag);
    });
}

function handleCompanyUrlChange(e) {
    if (appState.competitorMethod === 'auto') {
        updateAutoCompetitors();
    }
}

function updateAutoCompetitors() {
    // Simulate competitor detection based on company URL
    const companyUrl = document.getElementById('companyUrl').value;
    let detectedCompetitors = ['Zendesk', 'Salesforce', 'HubSpot', 'Intercom'];
    
    // Simple simulation based on company URL
    if (companyUrl.includes('zendesk')) {
        detectedCompetitors = ['Freshdesk', 'Intercom', 'Help Scout', 'Drift'];
    } else if (companyUrl.includes('salesforce')) {
        detectedCompetitors = ['HubSpot', 'Pipedrive', 'Zoho CRM', 'Monday.com'];
    } else if (companyUrl.includes('slack')) {
        detectedCompetitors = ['Microsoft Teams', 'Discord', 'Zoom', 'Mattermost'];
    }
    
    appState.competitors = detectedCompetitors;
    
    // Update competitor tags
    competitorTags.innerHTML = '';
    detectedCompetitors.forEach(competitor => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = competitor;
        competitorTags.appendChild(tag);
    });
}

// Cost calculation
function updateCostCalculator() {
    companyCount.textContent = appState.companiesCount;
    const cost = appState.companiesCount * 0.10;
    totalCost.textContent = `$${cost.toFixed(2)}`;
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show progress indicator
    submitButton.disabled = true;
    progressIndicator.style.display = 'block';
    
    // Simulate processing
    simulateProcessing();
}

function validateForm() {
    const requiredFields = [
        'companyName',
        'companyUrl',
        'industry',
        'targetPersona',
        'problemDescription',
        'termsAccepted'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value || (field.type === 'checkbox' && !field.checked)) {
            field.focus();
            isValid = false;
            return;
        }
    });
    
    if (!appState.csvData || appState.companiesCount === 0) {
        alert('Please upload a CSV file with your prospect companies.');
        isValid = false;
    }
    
    return isValid;
}

function simulateProcessing() {
    const steps = [
        { progress: 20, text: 'Analyzing your company and competitors...' },
        { progress: 40, text: 'Processing CSV data...' },
        { progress: 60, text: 'Enriching company profiles...' },
        { progress: 80, text: 'Calculating priority scores...' },
        { progress: 100, text: 'Finalizing results...' }
    ];
    
    let currentStep = 0;
    
    function nextStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progressFill.style.width = `${step.progress}%`;
            progressText.textContent = step.text;
            currentStep++;
            
            setTimeout(nextStep, 1500);
        } else {
            // Processing complete
            setTimeout(() => {
                showResults();
            }, 1000);
        }
    }
    
    nextStep();
}

function showResults() {
    // Hide progress indicator
    progressIndicator.style.display = 'none';
    
    // Update results table with processed data
    updateResultsTable();
    
    // Show success message
    progressText.textContent = 'Processing complete! Your prioritized prospect list is ready.';
    progressText.style.color = 'var(--color-success)';
    progressText.style.display = 'block';
    
    // Scroll to results
    document.querySelector('.preview-container').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = 'Download Results';
}

function updateResultsTable() {
    const tableBody = document.getElementById('previewTableBody');
    
    // Sample data based on form inputs
    const sampleResults = [
        {
            name: 'TechCorp Inc',
            score: 92,
            competitors: appState.competitors.slice(0, 2).join(', '),
            contacts: 'Sarah Johnson (VP Customer Success)',
            action: 'High Priority - Contact Immediately'
        },
        {
            name: 'InnovateLabs',
            score: 78,
            competitors: appState.competitors.slice(1, 3).join(', '),
            contacts: 'Mike Chen (Head of Sales)',
            action: 'Medium Priority - Schedule Call'
        },
        {
            name: 'GrowthCo',
            score: 85,
            competitors: appState.competitors.slice(0, 2).join(', '),
            contacts: 'Lisa Rodriguez (Customer Support Manager)',
            action: 'High Priority - Send Demo'
        },
        {
            name: 'StartupXYZ',
            score: 45,
            competitors: 'None Found',
            contacts: 'John Smith (CEO)',
            action: 'Low Priority - Nurture Campaign'
        }
    ];
    
    tableBody.innerHTML = '';
    
    sampleResults.forEach(company => {
        const row = document.createElement('tr');
        
        const scoreClass = company.score >= 80 ? 'high' : company.score >= 60 ? 'medium' : 'low';
        const actionClass = company.action.includes('High') ? 'high' : 
                           company.action.includes('Medium') ? 'medium' : 'low';
        
        row.innerHTML = `
            <td>${company.name}</td>
            <td><span class="priority-score ${scoreClass}">${company.score}</span></td>
            <td>${company.competitors}</td>
            <td>${company.contacts}</td>
            <td><span class="action-badge ${actionClass}">${company.action}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize competitor preview
updateAutoCompetitors();