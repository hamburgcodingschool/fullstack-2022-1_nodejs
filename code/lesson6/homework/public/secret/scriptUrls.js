function getClickableNode(link) {
  const node = document.createElement("a");
  node.href = link;
  node.target = "_new";
  node.innerHTML = link;
  return node;
}

function insertIntoTable(id, short, long) {
  const tableBody = document.getElementById("tableBody");

  const tr = document.createElement("tr");
  tr.id = `tr-${id}`;
  const td1 = document.createElement("td");
  td1.id = `td-short-${id}`;
  td1.setAttribute("data-value", short);
  const td2 = document.createElement("td");
  td2.id = `td-long-${id}`;
  td2.setAttribute("data-value", long);
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const a1 = getClickableNode(`/${short}`);
  const a2 = getClickableNode(long);
  const button1 = document.createElement("button");
  button1.innerHTML = "Edit";
  button1.setAttribute("data-modal", "modal-edit");
  button1.setAttribute("data-id", id);
  button1.addEventListener("click", (ev) => {
    ev.preventDefault();
    const shortElem = document.getElementById("shortUrlEdit");
    const longElem = document.getElementById("longUrlEdit");
    document.getElementById("btUpdate").setAttribute("data-id", id);
    shortElem.value = document
      .getElementById(`td-short-${id}`)
      .getAttribute("data-value");
    longElem.value = document
      .getElementById(`td-long-${id}`)
      .getAttribute("data-value");

    const modal = document.getElementById("modal-edit");
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
  button2.innerHTML = "Delete";
  button2.setAttribute("data-id", id);
  button2.addEventListener("click", (ev) => {
    ev.preventDefault();
    document.getElementById("shortUrlText").innerHTML = document
      .getElementById(`td-short-${id}`)
      .getAttribute("data-value");
    document.getElementById("longUrlText").innerHTML = document
      .getElementById(`td-long-${id}`)
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
  td1.appendChild(a1);
  td2.appendChild(a2);
  td3.appendChild(button1);
  td4.appendChild(button2);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  tableBody.appendChild(tr);
}

function loadAll() {
  fetch("/secret/url")
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        const tableBody = document.getElementById("tableBody");
        if (data.urls.length === 0) {
          tableBody.innerHTML =
            "<tr><td colspan='4'>No short URLs stored. Please create a new entry</td></tr>";
        } else {
          tableBody.innerHTML = "";

          for (url of data.urls) {
            insertIntoTable(url._id, url.short, url.long);
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
    const short = document.getElementById("shortUrlNew").value;
    const long = document.getElementById("longUrlNew").value;
    const dataToSend = {
      short: short,
      long: long,
    };
    fetch("/secret/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        ev.srcElement.parentNode.parentNode.parentNode.classList.remove("open");
        if (data.ok) {
          insertIntoTable(data.id, short, long);
          document.getElementById("shortUrlNew").value = "";
          document.getElementById("longUrlNew").value = "";
        } else {
          console.log(data.err);
          alert(`Error ${data.err.code}`);
        }
      });
  });

  document.getElementById("btUpdate").addEventListener("click", (e) => {
    const dataId = e.srcElement.getAttribute("data-id");
    const shortElem = document.getElementById("shortUrlEdit");
    const longElem = document.getElementById("longUrlEdit");
    dataToSend = {
      short: shortElem.value,
      long: longElem.value,
    };
    fetch(`/secret/url/${dataId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        e.srcElement.parentNode.parentNode.parentNode.classList.remove("open");
        if (data.ok) {
          document
            .getElementById(`td-short-${dataId}`)
            .setAttribute("data-value", shortElem.value);
          document.getElementById(`td-short-${dataId}`).innerHTML = "";
          document
            .getElementById(`td-short-${dataId}`)
            .appendChild(getClickableNode(`/${shortElem.value}`));
          document
            .getElementById(`td-long-${dataId}`)
            .setAttribute("data-value", longElem.value);
          document.getElementById(`td-long-${dataId}`).innerHTML = "";
          document
            .getElementById(`td-long-${dataId}`)
            .appendChild(getClickableNode(longElem.value));
        } else {
          console.log(data.err);
          alert(err);
        }
      });
  });

  document.getElementById("btDelete").addEventListener("click", (e) => {
    e.preventDefault();
    const dataId = e.srcElement.getAttribute("data-id");
    fetch(`/secret/url/${dataId}`, {
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
