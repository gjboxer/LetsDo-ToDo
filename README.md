# LetsDo - TodoList App

This is a simple TodoList app built using React and Django, designed to help you manage your tasks efficiently. You can add, edit, and delete tasks, sort them by due date or priority, and filter them by their completion status. The app also uses JWT (JSON Web Tokens) for user authentication.

## Features

- **User authentication:** Users can log in to their accounts, and their tasks will be associated with their user ID.
- **Add and Edit Tasks:** You can easily add new tasks and edit existing ones with a title, priority, and due date.
- **Priority Levels:** Tasks can be assigned priority levels (high, medium, low) to help you manage your workload effectively.
- **Sorting and Filtering:** Sort tasks by due date or priority, and filter them by "All," "Completed," or "Active."
- **Task Completion:** Mark tasks as completed or active, and they will be visually represented accordingly.
- **Task Deletion:** Easily delete tasks you no longer need.
- **Responsive Design:** The app is designed to work on both desktop and mobile devices.

## Usage
 
 1. Clone the repository to your local machine.
 2. Install the required dependencies for both the React front-end  and Django back-end.
 3. Configure the Django settings, such as database and JWT  authentication.
 4. Start the Django server.
 
 ```bash
  ## create virtual env
  python -m venv venv
 
  #enable virtual env
  venv\Scripts\Activate.ps1
 
  ## install requirements
  pip install -r requirements.txt
 
  ## Start Django backend
  python manage.py runserver
  ```
  
 5. Install the required dependencies of frontend by running `npm i` in the frontend folder . Start the React development server by running `npm start`.
 6. Access the app in your web browser at `http://localhost:3000`.
 
## Technologies Used
 
- **React:** Front-end development and user interface.
- **Django:** Back-end server and database management.
- **JWT (JSON Web Tokens):** User authentication and authorization.
- **HTML/CSS:** Front-end styling and structure.

## Project Structure

- `frontend/`: Contains the React front-end code.
- `backend_api/`: Contains the Django back-end code.


## API Endpoints

### Task Endpoints

- **List all tasks:**  
  `GET /api/task-list/?user=<user_id>`
  
- **Task details:**  
  `GET /api/task-detail/<str:pk>/`

- **Create a new task:**  
  `POST /api/task-create/`

- **Update a task:**  
  `POST /api/task-update/<str:pk>/`

- **Delete a task:**  
  `DELETE /api/task-delete/<str:pk>/`

### Authentication Endpoints

- **Obtain JWT Token:**  
  `POST /api/token/`

- **Register a new user:**  
  `POST /api/register/`

- **Refresh JWT Token:**  
  `POST /api/token/refresh/`

### Other Endpoints

- **Get available API routes:**  
  `GET /api/routes/`

- **Test endpoint with authentication:**  
  `GET /api/test-endpoint/`
  `POST /api/test-endpoint/`

Use these endpoints to interact with the TodoList app and manage tasks, authentication, and more.

## Authentication Flow

### 1. User Registration

- Users can register by providing an email, username, password, and confirming the password.
- The registration request is sent to the Django back end using a POST request to `/api/register/`.
- If the registration is successful, the user is redirected to the login page.

### 2. User Login

- Users can log in by providing their email and password.
- The login request is sent to the Django back end using a POST request to `/api/token/`.
- If the login is successful, a JSON Web Token (JWT) is obtained and stored in the local storage.
- The user is redirected to the main application page.

### 3. Logout

- Users can log out by clicking the "Log Out" button.
- The stored JWT is removed from local storage.
- The user is redirected to the login page.

### 4. Error Handling

- Proper error handling is in place, and users receive clear messages for successful and failed operations.
- SweetAlert2 is used to display custom alerts for a better user experience.

## Screenshots

<!-- ![TodoList App](screenshot.png) -->


