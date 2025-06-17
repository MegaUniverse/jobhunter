let page = 1;

document.getElementById("search-btn").addEventListener("click", () => {
  page = 1;
  fetchJobs(document.getElementById("search").value.trim(), page);
});

document.getElementById("search").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    document.getElementById("search-btn").click();
  }
});
function updatePaginationControls(query, total) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  const totalPages = Math.min(50, Math.ceil(total / 20));
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  // Botão anterior
  if (page > 1) {
    const prev = document.createElement("button");
    prev.textContent = "<";
    prev.onclick = () => {
      page -= 1;
      fetchJobs(query, page);
    };
    container.appendChild(prev);
  }

  // Páginas
  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === page) {
      btn.style.background = "#555";
    }
    btn.onclick = () => {
      page = i;
      fetchJobs(query, page);
    };
    container.appendChild(btn);
  }

  // Botão próximo
  if (page < totalPages) {
    const next = document.createElement("button");
    next.textContent = ">";
    next.onclick = () => {
      page += 1;
      fetchJobs(query, page);
    };
    container.appendChild(next);
  }
}
async function fetchJobs(query = "", page = 1) {
  const res = await fetch(`/api/jobs?query=${encodeURIComponent(query)}&page=${page}`);
  const { results, total } = await res.json();
  renderJobs(results);
  updatePaginationControls(query, total);
}

function renderJobs(jobs) {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";
  jobs.forEach(job => {
    const div = document.createElement("div");
    div.className = "job-card";
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Empresa:</strong> ${job.company}</p>
      <p><strong>Local:</strong> ${job.location}</p>
      <a href="${job.link}" target="_blank">Ver vaga</a>
    `;
    container.appendChild(div);
  });
}

fetchJobs();
