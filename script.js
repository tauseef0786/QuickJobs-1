// Global variables for pagination and filtered data
let filteredJobs = [];
let postsPerPage = 8; // Default number of posts per page
let currentPage = 1;  // Start from the first page
let allJobs = [];  // To store the original list of all jobs

// Function to fetch job data from Firebase
function fetchJobs() {
    const apiUrl = 'https://quickjobs-1-default-rtdb.firebaseio.com/jobs.json';  // Firebase endpoint

    fetch(apiUrl)
        .then(response => response.json())  // Parse the response to JSON
        .then(data => {
            if (data) {
                allJobs = Object.values(data); // Store all jobs in the allJobs array
                filteredJobs = [...allJobs]; // Set filteredJobs to all jobs initially
                displayJobs();  // Display the jobs
            } else {
                document.getElementById('job-list').innerHTML = 'No job listings available.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('job-list').innerHTML = 'Error loading data.';
        });
}

// Function to display job data on the UI
function displayJobs() {
    const jobListContainer = document.getElementById('job-list');
    jobListContainer.innerHTML = '';  // Clear previous job items

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const jobsToDisplay = filteredJobs.slice(startIndex, endIndex); // Get jobs for current page

    // Loop through the jobs array and create elements for each job
    jobsToDisplay.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.classList.add('job-item');

        jobDiv.innerHTML = `
            <h3 class="job-title">${job.job_title}</h3>
            <div class="date-posted">${new Date(job.date_posted).toLocaleDateString()}</div>
            <p class="job-company">${job.company}</p>
            <p class="job-type">${job.job_type}</p>
            <div class="skills">
                ${job.skills_required.map(skill => `<span>${skill}</span>`).join('')}
            </div>
            <p class="hourly-rate">${job.hourly_rate}</p>
            <button class="view-details">View Details</button>
        `;

        jobListContainer.appendChild(jobDiv);
    });

    updatePagination();  // Update pagination display
}

// Function to handle search
document.getElementById('search-bar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    // If search box is cleared, show all jobs again
    if (searchTerm === '') {
        filteredJobs = [...allJobs];  // Reset filteredJobs to all jobs
        currentPage = 1; // Reset to the first page when clearing search
    } else {
        // Filter jobs based on search term
        filteredJobs = allJobs.filter(job => 
            job.job_title.toLowerCase().includes(searchTerm) || 
            job.company.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // Reset to the first page when searching
    }

    displayJobs();
});

// Function to handle sorting
document.getElementById('sort-by').addEventListener('change', function() {
    const sortBy = this.value;
    
    if (sortBy === 'date') {
        filteredJobs.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    } else if (sortBy === 'job_title') {
        filteredJobs.sort((a, b) => a.job_title.localeCompare(b.job_title));
    }

    displayJobs();
});

// Function to handle posts per page selection
document.getElementById('posts-per-page').addEventListener('change', function() {
    postsPerPage = parseInt(this.value);
    currentPage = 1; // Reset to the first page when changing posts per page
    displayJobs();
});

// Function to handle pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredJobs.length / postsPerPage);
    const pageNumberElement = document.getElementById("page-number");
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    pageNumberElement.textContent = `Page ${currentPage} of ${totalPages}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Handle previous page click
document.getElementById("prev-page").addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        displayJobs();
    }
});

// Handle next page click
document.getElementById("next-page").addEventListener("click", function() {
    const totalPages = Math.ceil(filteredJobs.length / postsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayJobs();
    }
});

// Initial fetch and display
window.onload = function() {
    fetchJobs();  // Fetch jobs from Firebase when the page loads
};
