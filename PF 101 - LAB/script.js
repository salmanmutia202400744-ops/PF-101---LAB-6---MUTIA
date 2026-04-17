const loadBtn = document.getElementById("loadBtn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const usersContainer = document.getElementById("usersContainer");

// State variable to store users
let users = []

async function fetchUsers() {
    // Step 1: Get data from API
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    
    // Step 2: Convert to JSON format
    const data = await response.json();
    
    // Step 3: Return the data
    return data;
}

function createUserCard(user) {
    // Create a div for the user
    const card = document.createElement("div");
    card.className = "user-card";
    
    // Add user info inside
    card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
    `;
    
    return card;
}

function renderUsers(userList) {
    // Clear existing content
    usersContainer.innerHTML = "";
    
    // Loop through each user and add to page
    userList.forEach(user => {
        const card = createUserCard(user);
        usersContainer.appendChild(card);
    });
}

loadBtn.addEventListener("click", async () => {
    // 1. Reset state
    errorDiv.classList.add("hidden");
    usersContainer.innerHTML = "";
    
    // 2. Show loading
    loadingDiv.classList.remove("hidden");
    loadBtn.disabled = true;
    loadBtn.textContent = "Loading...";
    
    try {
        // 3. Fetch data (this might fail!)
        users = await fetchUsers();
        
        // 4. Display users
        renderUsers(users);
        
    } catch (error) {
        // 5. If something goes wrong
        errorDiv.textContent = "Error: Could not load users. Please try again.";
        errorDiv.classList.remove("hidden");
        console.log("Error:", error);
        
    } finally {
        // 6. Always run this - hide loading, re-enable button
        loadingDiv.classList.add("hidden");
        loadBtn.disabled = false;
        loadBtn.textContent = "Load Users";
    }
});

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filter users by name
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    
    // Show filtered results
    renderUsers(filtered);
});


const refreshBtn = document.getElementById("refreshBtn");

refreshBtn.addEventListener("click", async () => {
    loadingDiv.classList.remove("hidden");

    try {
        users = await fetchUsers();
        renderUsers(users);
    } catch (error) {
        errorDiv.textContent = "Error refreshing data.";
        errorDiv.classList.remove("hidden");
    } finally {
        loadingDiv.classList.add("hidden");
    }
});