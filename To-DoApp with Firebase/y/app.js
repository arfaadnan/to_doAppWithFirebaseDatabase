// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, push, remove, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration (replace with your own Firebase project credentials)

  // Import the functions you need from the SDKs you need
  // import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDFKq_R20LOshaymCigSXVXQ6Bw3hzDksM",
    authDomain: "to-doappwithfirebasedatabse.firebaseapp.com",
    databaseURL: "https://to-doappwithfirebasedatabse-default-rtdb.firebaseio.com",
    projectId: "to-doappwithfirebasedatabse",
    storageBucket: "to-doappwithfirebasedatabse.firebasestorage.app",
    messagingSenderId: "25357688678",
    appId: "1:25357688678:web:495874e81b584f830cb2a7"
  };

  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const addTodoBtn = document.getElementById('add-todo-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');
const todoItemInput = document.getElementById('todo-item');
const todoList = document.getElementById('todo-list');
const todoContainer = document.getElementById('todo-container');
const authContainer = document.getElementById('auth-container');

// Sign Up
signupBtn.addEventListener('click', () => {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            console.log('User signed up:', userCredential.user);
        })
        .catch(error => {
            console.error('Error signing up:', error);
        });
});

// Login
loginBtn.addEventListener('click', () => {
    const email = prompt('Enter email:');
    const password = prompt('Enter password:');
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            console.log('User logged in:', userCredential.user);
            showTodoContainer();
        })
        .catch(error => {
            console.error('Error logging in:', error);
        });
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User logged out');
            showAuthContainer();
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
});

// Add Todo
addTodoBtn.addEventListener('click', () => {
    const todoItem = todoItemInput.value;
    if (todoItem && auth.currentUser) {
        const userId = auth.currentUser.uid;
        const todoRef = ref(database, 'todos/' + userId);
        const newTodoRef = push(todoRef);
        set(newTodoRef, {
            task: todoItem,
            timestamp: Date.now()
        });
        todoItemInput.value = '';  // Clear input
    }
});

// Delete All Todos
deleteAllBtn.addEventListener('click', () => {
    if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const todoRef = ref(database, 'todos/' + userId);
        remove(todoRef);
    }
});

// Show Todo Container
function showTodoContainer() {
    todoContainer.style.display = 'block';
    authContainer.style.display = 'none';
    fetchTodos();
}

// Show Auth Container
function showAuthContainer() {
    todoContainer.style.display = 'none';
    authContainer.style.display = 'block';
}

// Fetch Todos
function fetchTodos() {
    if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const todoRef = ref(database, 'todos/' + userId);

        onValue(todoRef, snapshot => {
            todoList.innerHTML = '';  // Clear existing todos
            const todos = snapshot.val();
            if (todos) {
                Object.keys(todos).forEach(todoId => {
                    const li = document.createElement('li');
                    li.textContent = todos[todoId].task;
                    todoList.appendChild(li);
                });
            } else {
                console.log('No todos found');
            }
        });
    }
}

// Authentication State Change Listener
onAuthStateChanged(auth, user => {
    if (user) {
        console.log('User is logged in:', user);
        showTodoContainer();
    } else {
        console.log('User is not logged in');
        showAuthContainer();
    }
});
