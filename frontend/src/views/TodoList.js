import jwtDecode from "jwt-decode";
import React from "react";
import "./style.css";

class TodoList extends React.Component {
  constructor(props) {
    var user_id = 0;
    if (localStorage.getItem("authTokens")) {
      const decode = jwtDecode(localStorage.getItem("authTokens"));
      user_id = decode.user_id;
    }

    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
        user: user_id,
        priority: "medium",
        due_date: new Date().toISOString().split("T")[0],
      },
      sortCriteria: "due_date",
      sortOrder: "asc",
      editing: false,
      currentTab: "All",
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);

    this.startEdit = this.startEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.strikeUnstrike = this.strikeUnstrike.bind(this);
  }

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("Fetching...");
    var user_id = 0;
    if (localStorage.getItem("authTokens")) {
      const decode = jwtDecode(localStorage.getItem("authTokens"));
      user_id = decode.username;
    }

    fetch(`http://127.0.0.1:8000/api/task-list/?user=${user_id}`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data,
        })
      );
  }

  switchTab = (tab) => {
    this.setState({ currentTab: tab });
  };

  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handlePriorityChange = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      activeItem: {
        ...prevState.activeItem,
        priority: value,
      },
    }));
  };

  handleDateChange = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      activeItem: {
        ...prevState.activeItem,
        due_date: value,
      },
    }));
  };

  handleSubmit(e) {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);

    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-create/";

    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }
    console.log("__2", this.state.activeItem);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        var user_id = 0;
        if (localStorage.getItem("authTokens")) {
          const decode = jwtDecode(localStorage.getItem("authTokens"));
          user_id = decode.user_id;
        }
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
            user: user_id,
            priority: "medium",
            due_date: new Date().toISOString().split("T")[0],
          },
        });
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  }

  handleSortCriteriaChange = (e) => {
    this.setState({ sortCriteria: e.target.value });
  };

  handleSortOrderChange = (e) => {
    this.setState({ sortOrder: e.target.value });
  };

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    var csrftoken = this.getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  }

  strikeUnstrike(task) {
    task.completed = !task.completed;
    var csrftoken = this.getCookie("csrftoken");
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        completed: task.completed,
        title: task.title,
        user: task.user,
        priority: task.priority,
        date: task.due_date,
      }),
    }).then(() => {
      this.fetchTasks();
    });

    console.log("TASK:", task.completed);
  }

  sortTasks() {
    const { todoList, sortCriteria, sortOrder } = this.state;

    const priorityOrder = ["high", "medium", "low"];

    const sortedTasks = [...todoList].sort((a, b) => {
      const orderMultiplier = sortOrder === "asc" ? 1 : -1;

      if (sortCriteria === "due_date") {
        return orderMultiplier * (a.due_date > b.due_date ? 1 : -1);
      } else if (sortCriteria === "priority") {
        const priorityA = priorityOrder.indexOf(a.priority);
        const priorityB = priorityOrder.indexOf(b.priority);

        return orderMultiplier * (priorityA - priorityB);
      } else {
        return 0;
      }
    });

    return sortedTasks;
  }

  render() {
    const { currentTab } = this.state;
    var tasks = this.sortTasks();
    console.log("__1", tasks);
    var self = this;

    if (localStorage.getItem("authTokens")) {
      const decode = jwtDecode(localStorage.getItem("authTokens"));
      var username = decode.username;
    }

    const filteredTasks = tasks.filter((task) => {
      if (currentTab === "All") {
        return true;
      } else if (currentTab === "Completed") {
        return task.completed;
      } else if (currentTab === "Active") {
        return !task.completed;
      }
      return false;
    });

    return (
      <div className="container">
        <center style={{ marginTop: 10, fontSize: 25, fontWeight: "bold" }}>
          Hello {username}
        </center>
        <div id="task-container">
          <div
            style={{
              padding: 10,
              margin: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <label htmlFor="sortCriteria" style={{ marginRight: "10px" }}>
              Sort by:
            </label>
            <select
              id="sortCriteria"
              className="form-control"
              onChange={this.handleSortCriteriaChange}
              style={{ marginRight: "20px", padding: "10px", width: 400 }}
            >
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            <label htmlFor="sortOrder" style={{ marginRight: "10px" }}>
              Order:
            </label>
            <select
              id="sortOrder"
              className="form-control"
              onChange={this.handleSortOrderChange}
              style={{ padding: "5px", width: 200 }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div style={{marginLeft: '30%'}}>
            <button
              className={`tab-button ${currentTab === "All" ? "active" : ""}`}
              onClick={() => this.switchTab("All")}
            >
              All
            </button>
            <button
              className={`tab-button ${
                currentTab === "Completed" ? "active" : ""
              }`}
              onClick={() => this.switchTab("Completed")}
            >
              Completed
            </button>
            <button
              className={`tab-button ${
                currentTab === "Active" ? "active" : ""
              }`}
              onClick={() => this.switchTab("Active")}
            >
              Active
            </button>
          </div>

          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6, marginBottom: "10px" }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    value={this.state.activeItem.title}
                    type="text"
                    name="title"
                    placeholder="Add task.."
                  />
                </div>

                <div style={{ flex: 4, marginBottom: "10px" }}>
                  <select
                    onChange={this.handlePriorityChange}
                    className="form-control"
                    name="priority"
                    value={this.state.activeItem.priority}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div style={{ flex: 3, marginBottom: "10px" }}>
                  <input
                    onChange={this.handleDateChange}
                    className="form-control"
                    id="date"
                    value={this.state.activeItem.date}
                    type="date"
                    name="date"
                  />
                </div>
              </div>

              <div style={{ marginLeft: "80%" }}>
                <input
                  id="submit"
                  className="btn btn-warning"
                  type="submit"
                  name="Add"
                />
              </div>
            </form>
          </div>

          <div id="list-wrapper">
            {filteredTasks.map(function (task, index) {
              console.log("__3", task.completed);
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() => self.strikeUnstrike(task)}
                    style={{ flex: 7 }}
                  >
                    {task.completed == false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                  </div>
                  <div>
                    <span style={{ marginRight: "10px" }}>
                      {task.due_date.split("T")[0]}
                    </span>
                    <span
                      style={{
                        marginRight: "10px",
                        padding: "5px 10px",
                        border: "1px solid #000",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.startEdit(task)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.deleteItem(task)}
                      className="btn btn-sm btn-outline-dark delete"
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default TodoList;
