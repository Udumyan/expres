window.addEventListener("click", (e) => {
  if (e.target.dataset.action === "remove") {
    const id = e.target.id;
    fetch(`http://localhost:3000/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => window.location.href="/");
  }
});
