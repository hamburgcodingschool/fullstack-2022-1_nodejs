function insertIntoTable(short, long) {
  const tableBody = document.getElementById("tableBody");

  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const a1 = document.createElement("a");
  a1.href = "/" + short;
  a1.innerHTML = short;
  const a2 = document.createElement("a");
  a2.href = long;
  a2.target = "_new";
  a2.innerHTML = long;
  td1.appendChild(a1);
  td2.appendChild(a2);
  tr.appendChild(td1);
  tr.appendChild(td2);

  tableBody.appendChild(tr);
}

function loadAll() {
  fetch("/secret/url")
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        for (url of data.urls) {
          insertIntoTable(url.short, url.long);
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
    const short = document.getElementById("shortUrl").value;
    const long = document.getElementById("longUrl").value;
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
        if (data.ok) {
          insertIntoTable(short, long);
        } else {
          console.log(data.err);
          alert(err);
        }
      });
  });
};
