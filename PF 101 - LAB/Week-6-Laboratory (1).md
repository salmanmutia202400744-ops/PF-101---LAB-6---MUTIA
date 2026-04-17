# PF 102: Event-Driven Programming

## Week 6: Lab – Build Your First Data Dashboard

---

## Goal

By end of this lab, you'll build a page that:
- Fetches user data from the internet
- Shows "Loading..." while waiting
- Displays users on screen
- Handles errors nicely

---

## The API We'll Use

We'll use a free fake API: **JSONPlaceholder**

```
URL: https://jsonplaceholder.typicode.com/users
```

This returns a list of 10 fake users.

---

## Important: What are resolve and reject?

When we use fetch(), the browser gives us a Promise. Inside a Promise:

- **resolve** = "Got the data!" - When fetch succeeds
- **reject** = "Something failed!" - When fetch fails

```javascript
// This is what happens inside fetch()
// (You don't need to write this - fetch does it for you!)
return new Promise((resolve, reject) => {
    try {
        const data = getDataFromInternet();
        resolve(data);  // Success! Here's the data.
    } catch (error) {
        reject(error);  // Failed! Here's the error.
    }
});
```

When you use `await fetch()`, JavaScript waits for either resolve (success) or reject (error).

---

## Step 1: Create the HTML

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>User Dashboard</h1>
    
    <button id="loadBtn">Load Users</button>
    
    <!-- Loading message (hidden by default) -->
    <div id="loading" class="hidden">Loading...</div>
    
    <!-- Error message (hidden by default) -->
    <div id="error" class="hidden"></div>
    
    <!-- Where users will appear -->
    <div id="usersContainer"></div>
    
    <script src="script.js"></script>
</body>
</html>
```

---

## Step 2: Create the CSS

Create `style.css`:

```css
/* Basic styling */
body {
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

/* Button styling */
#loadBtn {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

#loadBtn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

/* User card styling */
.user-card {
    border: 1px solid #ddd;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.user-card h3 {
    margin: 0 0 10px 0;
}

.user-card p {
    margin: 5px 0;
    color: #666;
}

/* Utility classes */
.hidden {
    display: none;
}

#error {
    color: red;
    padding: 10px;
    background-color: #ffe6e6;
    border-radius: 5px;
    margin: 10px 0;
}
```

---

## Step 3: Create the JavaScript

Create `script.js`:

### Part 3a: Setup variables

```javascript
// Get HTML elements
const loadBtn = document.getElementById("loadBtn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const usersContainer = document.getElementById("usersContainer");

// State variable to store users
let users = [];
```

### Part 3b: Function to fetch users

```javascript
// This is an async function - it can wait!
async function fetchUsers() {
    // Step 1: Get data from API
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    
    // Step 2: Convert to JSON format
    const data = await response.json();
    
    // Step 3: Return the data
    return data;
}
```

### Part 3c: Function to display one user

```javascript
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
```

### Part 3d: Function to render all users

```javascript
function renderUsers(userList) {
    // Clear existing content
    usersContainer.innerHTML = "";
    
    // Loop through each user and add to page
    userList.forEach(user => {
        const card = createUserCard(user);
        usersContainer.appendChild(card);
    });
}
```

### Part 3e: Click handler (put it all together!)

```javascript
// When button is clicked
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
```

---

## Step 4: Test It!

1. Open `index.html` in your browser
2. Click "Load Users" button
3. You should see 10 user cards appear!

---

## Bonus: Add Search (Try if you have time!)

Add this to your HTML:
```html
<input type="text" id="searchInput" placeholder="Search by name...">
```

Add this to your JavaScript:

```javascript
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
```

---

## Troubleshooting

### Problem: "CORS error" or "Network error"
- This happens when running from file://
- Solution: Use a local server or check your internet

### Problem: Nothing shows
- Check browser console (F12) for errors
- Make sure your fetch URL is correct

### Problem: Button stays disabled
- Make sure you have `loadBtn.disabled = false` in the finally block

---

## Checklist - Did You Complete?

- [ ] index.html created with all elements
- [ ] style.css created with styling
- [ ] script.js has fetchUsers() function
- [ ] Click button loads and displays users
- [ ] Loading message shows while fetching
- [ ] Error message shows if something fails
- [ ] Button re-enables after loading

---

## Reflection (Write in your notebook)

1. What does `await` do? Why do we need it?
2. What happens if the API is down? How does our code handle that?
3. What's the difference between `try` and `catch`?

---

## Bonus Challenge (Optional)

Try to add a "Refresh" button that reloads the data without refreshing the whole page!

---

**Related:**
- [[Week 6 - Lecture]]
- [[Week 5 - Laboratory]] (Midterm)