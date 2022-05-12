function getClickableNode(link) {
  const node = document.createElement("a");
  node.href = link;
  node.target = "_new";
  node.innerHTML = link;
  return node;
}

function insertIntoTable(id, username) {
  const tableBody = document.getElementById("tableBody");

  const tr = document.createElement("tr");
  tr.id = `tr-${id}`;
  const td1 = document.createElement("td");
  td1.id = `td-username-${id}`;
  td1.setAttribute("data-value", username);
  td1.innerHTML = username;
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const button1 = document.createElement("button");
  button1.innerHTML = "Edit Username";
  button1.setAttribute("data-modal", "modal-edit");
  button1.setAttribute("data-id", id);
  button1.addEventListener("click", (ev) => {
    ev.preventDefault();
    const usernameElem = document.getElementById("usernameEdit");
    document.getElementById("btUpdateUser").setAttribute("data-id", id);
    usernameElem.value = document
      .getElementById(`td-username-${id}`)
      .getAttribute("data-value");

    const modal = document.getElementById("modal-rename");
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });

  const button2 = document.createElement("button");
  button2.innerHTML = "New Password";
  button2.setAttribute("data-modal", "modal-edit");
  button2.setAttribute("data-id", id);
  button2.addEventListener("click", (ev) => {
    ev.preventDefault();
    document.getElementById("btUpdatePassword").setAttribute("data-id", id);

    const modal = document.getElementById("modal-password");
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });

  const button3 = document.createElement("button");
  button3.innerHTML = "Delete";
  button3.setAttribute("data-id", id);
  button3.addEventListener("click", (ev) => {
    ev.preventDefault();
    document.getElementById("userText").innerHTML = document
      .getElementById(`td-username-${id}`)
      .getAttribute("data-value");
    document.getElementById("btDelete").setAttribute("data-id", id);

    const modal = document.getElementById("modal-delete");
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
  td2.appendChild(button1);
  td3.appendChild(button2);
  td4.appendChild(button3);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  tableBody.appendChild(tr);
}

function loadAll() {
  fetch("/secret/user")
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        const tableBody = document.getElementById("tableBody");
        if (data.users.length === 0) {
          tableBody.innerHTML =
            "<tr><td colspan='4'>No short URLs stored. Please create a new entry</td></tr>";
        } else {
          tableBody.innerHTML = "";

          for (user of data.users) {
            insertIntoTable(user._id, user.username);
          }
        }
      } else {
        console.log(data.err);
        alert(data.err);
      }
    });
}

ready = () => {
  loadAll();

  document.getElementById("btInsert").addEventListener("click", (ev) => {
    const username = document.getElementById("usernameNew").value;
    const password = document.getElementById("passwordNew").value;
    const dataToSend = {
      username: username,
      passwordHash: password,
    };
    fetch("/secret/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        ev.srcElement.parentNode.parentNode.parentNode.classList.remove("open");
        if (data.ok) {
          insertIntoTable(data.id, username);
          document.getElementById("usernameNew").value = "";
          document.getElementById("passwordNew").value = "";
        } else {
          console.log(data.err);
          alert(`Error ${data.err.code}`);
        }
      });
  });

  document.getElementById("btUpdateUser").addEventListener("click", (e) => {
    const dataId = e.srcElement.getAttribute("data-id");
    const usernameElem = document.getElementById("usernameEdit");
    dataToSend = {
      username: usernameElem.value,
    };
    fetch(`/secret/user/${dataId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        e.srcElement.parentNode.parentNode.parentNode.classList.remove("open");
        if (data.ok) {
          document
            .getElementById(`td-username-${dataId}`)
            .setAttribute("data-value", usernameElem.value);
          document.getElementById(`td-username-${dataId}`).innerHTML =
            usernameElem.value;
        } else {
          console.log(data.err);
          alert(err);
        }
      });
  });

  document.getElementById("btUpdatePassword").addEventListener("click", (e) => {
    const dataId = e.srcElement.getAttribute("data-id");
    const passwordElem = document.getElementById("passwordEdit");
    dataToSend = {
      passwordHash: passwordElem.value,
    };
    fetch(`/secret/user/${dataId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        e.srcElement.parentNode.parentNode.parentNode.classList.remove("open");
        if (data.ok) {
          document.getElementById("passwordEdit").value = "";
        } else {
          console.log(data.err);
          alert(err);
        }
      });
  });

  document.getElementById("btDelete").addEventListener("click", (e) => {
    e.preventDefault();
    const dataId = e.srcElement.getAttribute("data-id");
    fetch(`/secret/user/${dataId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        e.srcElement.parentNode.parentNode.parentNode.classList.remove("open");
        if (data.ok) {
          document.getElementById(`tr-${dataId}`).remove();
        } else {
          console.log(data.err);
          alert(err);
        }
      });
  });

  const modals = document.querySelectorAll("[data-modal]");
  console.log(modals);

  modals.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      const modal = document.getElementById(trigger.dataset.modal);
      modal.classList.add("open");
      const exits = modal.querySelectorAll(".modal-exit");
      exits.forEach(function (exit) {
        exit.addEventListener("click", function (event) {
          event.preventDefault();
          modal.classList.remove("open");
        });
      });
    });
  });
};
