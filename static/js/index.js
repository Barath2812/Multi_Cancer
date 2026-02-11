// Cancer types configuration with Streamlit deployment links
const cancerTypes = {
    brain_tumor: {
        name: "Brain Tumor",
        description: "Detection of brain tumors from MRI scans using deep learning",
        status: "ready",
        link: "https://brain--tumor.streamlit.app/"
    },
    lymphoma_cancer: {
        name: "Lymphoma Cancer",
        description: "Classification of lymphoma cancer from medical images",
        status: "ready",
        link: "https://lymphoma-cancer.streamlit.app/"
    },
    oral_cancer: {
        name: "Oral Cancer",
        description: "Early detection of oral cancer from clinical images",
        status: "ready",
        link: "https://oral--cancer.streamlit.app/"
    },
    cervical_cancer: {
        name: "Cervical Cancer",
        description: "Cervical cancer screening from pap smear images",
        status: "ready",
        link: "https://cervical.streamlit.app/"
    },
    breast_cancer: {
        name: "Breast Cancer",
        description: "Breast cancer detection from mammography and ultrasound images",
        status: "ready",
        link: "https://breast-cancer-he.streamlit.app/"
    },
    lung_colon_cancer: {
        name: "Lung & Colon Cancer",
        description: "Detection of lung and colon cancer from histopathology images",
        status: "ready",
        link: "https://lungcolon.streamlit.app/"
    },
    kidney_stone: {
        name: "Kidney H&E",
        description: "Detection of kidney grade",
        status: "ready",
        link: "https://kidney-hande.streamlit.app/"
    },
    all_cancer: {
        name: "All Cancer",
        description: "Multi-organ cancer detection from various medical images",
        status: "ready",
        link: "https://all-cancer.streamlit.app/"
    }
};

// Generate cancer cards
function generateCancerCards() {
    const grid = document.getElementById('cancerGrid');

    for (const [cancerId, cancer] of Object.entries(cancerTypes)) {
        const isReady = cancer.status === 'ready';

        const card = document.createElement('div');
        card.className = `cancer-card ${isReady ? 'available' : 'unavailable'}`;
        card.dataset.cancer = cancerId;
        card.dataset.status = cancer.status;

        card.innerHTML = `
            <div class="card-glow"></div>
            <div class="card-content">
                <!-- Status badge -->
                <div class="status-badge ${cancer.status}">
                    ${isReady
                ? '<span class="status-icon">✓</span> Ready'
                : '<span class="status-icon">⏳</span> Coming Soon'}
                </div>

                <!-- Cancer image -->
                <div class="card-image">
                    <img src="static/images/${cancerId}.png" 
                         alt="${cancer.name}"
                         onerror="this.src='static/images/placeholder.png'">
                </div>

                <!-- Cancer info -->
                <div class="card-info">
                    <h2 class="card-title">${cancer.name}</h2>
                    <p class="card-description">${cancer.description}</p>
                </div>

                <!-- Action button -->
                ${isReady
                ? `<a href="${cancer.link}" target="_blank" rel="noopener noreferrer" class="card-button">
                        <span>Start Detection</span>
                        <svg class="button-arrow" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" />
                        </svg>
                       </a>`
                : `<button class="card-button disabled" disabled>
                        <span>Coming Soon</span>
                       </button>`}
            </div>
        `;

        grid.appendChild(card);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateCancerCards();

    // Count and display ready models
    const readyModels = Object.values(cancerTypes).filter(c => c.status === 'ready').length;
    document.getElementById('models-ready').textContent = readyModels;

    // Add hover effects
    document.querySelectorAll('.cancer-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
});
