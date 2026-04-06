
let directoryData = [];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('card-container');
    const loadingState = document.getElementById('loading-state');
    const tabsContainer = document.getElementById('tabs-container');

    // Fetch data from local JSON file
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            directoryData = data;
            loadingState.remove();
            
            if (data.length > 0) {
                renderTabs();
                // Automatically select the first tab
                selectCluster(data[0].divisionCluster);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loadingState.innerHTML = `<span class="text-red-500">Failed to load directory data.</span>`;
        });
});

function renderTabs() {
    const tabsContainer = document.getElementById('tabs-container');
    tabsContainer.innerHTML = ''; // Clear existing

    directoryData.forEach(cluster => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn text-sm md:text-base';
        btn.textContent = cluster.divisionClusterInitial;
        btn.dataset.cluster = cluster.divisionCluster;
        
        btn.addEventListener('click', () => {
            selectCluster(cluster.divisionCluster);
        });

        tabsContainer.appendChild(btn);
    });
}

function selectCluster(clusterName) {
    // Update active state on buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.dataset.cluster === clusterName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update title
    const titleEl = document.getElementById('cluster-title');
    titleEl.textContent = `${clusterName}`;
    titleEl.classList.remove('hidden');

    // Find the selected cluster data
    const selectedClusterData = directoryData.find(c => c.divisionCluster === clusterName);
    
    // Render the cards for this cluster
    renderCards(selectedClusterData ? selectedClusterData.units : []);
}

function renderCards(units) {
    const container = document.getElementById('card-container');
    container.innerHTML = ''; // Clear existing cards

    if (units.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-gray-500 py-10">No units found for this cluster.</div>`;
        return;
    }

    units.forEach(unit => {
        container.appendChild(createCard(unit));
    });
}

function createCard(data) {
    // Handle potentially empty arrays for emails and numbers safely
    const emailsHTML = (data.contact.emails || []).map(email => 
        `<a href="mailto:${email}" class="block hover:underline truncate" title="${email}">${email}</a>`
    ).join('') || '<span class="text-gray-400 italic">No email provided</span>';
    
    const numbersHTML = (data.contact.mobileNumbers || []).map(num => 
        `<a href="tel:${num.replace(/\s+/g, '')}" class="block hover:underline">${num}</a>`
    ).join('') || '<span class="text-gray-400 italic">No number provided</span>';

    const cardDiv = document.createElement('div');
    cardDiv.className = 'directory-card p-6 flex flex-col h-full';

    cardDiv.innerHTML = `
        <h2 class="text-xl font-bold text-center text-doh-green-dark mb-6 uppercase tracking-wide">
            ${data.unitName}
        </h2>

        <div class="flex flex-col sm:flex-row gap-6">
            <div class="flex flex-col items-center sm:items-start w-full sm:w-1/3 shrink-0">
                <div class="w-28 h-28 mb-4 bg-doh-green-light rounded-xl border-2 border-doh-green overflow-hidden shadow-sm shrink-0">
                    <img src="${data.imageUrl}" alt="Logo" class="w-full h-full object-cover" loading="lazy">
                </div>

                <div class="text-center sm:text-left w-full">
                    <h3 class="font-bold text-gray-900 leading-tight mb-1 text-sm">${data.head.name}</h3>
                    <p class="text-xs text-doh-gray-dark font-medium uppercase tracking-wider mb-0.5">${data.head.position}</p>
                    ${data.head.designation ? `<p class="text-xs text-gray-500 italic">${data.head.designation}</p>` : ''}
                </div>
            </div>

            <div class="flex-1 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6 min-w-0">
                <h3 class="text-sm font-bold text-doh-green-dark mb-3 uppercase tracking-wider">Contact Information</h3>
                
                <div class="space-y-4">
                    <div class="flex items-start gap-2 overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div class="text-sm text-gray-700 w-full overflow-hidden">
                            ${emailsHTML}
                        </div>
                    </div>

                    <div class="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div class="text-sm text-gray-700">
                            ${numbersHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return cardDiv;
}