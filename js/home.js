const issusContent = document.getElementById("issusContent");
const loadingSpinner = document.getElementById("loading-spinner");
const issueCountElement = document.getElementById("issue-count");
let allIssues = [];

function showDetails(id) {
  const modal = document.getElementById("my_modal_1");
  const modalBox = modal.querySelector(".modal-box");
  modal.showModal();
  modalBox.innerHTML = `
        <div class="flex justify-center items-center py-10">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
    `;
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const issue = data.data;
      modalBox.innerHTML = `
                <h3 class="text-xl font-bold text-[#1F2937] border-b pb-2">${issue.title}</h3>
                <div class="py-4">
                    <p class="text-[#64748B] mb-4">${issue.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="badge badge-outline">ID: #${issue.id}</span>
                        <span class="badge badge-primary uppercase">${issue.status}</span>
                        <span class="badge badge-secondary uppercase">${issue.priority}</span>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg text-sm text-[#64748B]">
                        <p><strong>Author:</strong> ${issue.author || "Anonymous"}</p>
                        <p><strong>Created:</strong> ${new Date(issue.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-primary">Close</button>
                    </form>
                </div>
            `;
    });
  return;
}

function displayCards(issues) {
  issusContent.innerHTML = "";
  issueCountElement.innerText = issues.length;

  issues.forEach((element) => {
    const isOpen = element.status === "open";
    const borderColor = isOpen ? "border-t-[#00A96E]" : "border-t-[#FF4444]";
    const labelsHTML = element.labels
      .map(
        (label) =>
          `<div class="badge badge-soft badge-secondary text-[10px] uppercase">${label}</div>`,
      )
      .join("");

    const div = document.createElement("div");
    div.className = "cursor-pointer";
    div.onclick = () => showDetails(element.id);

    div.innerHTML = `
          <div class="p-[16px] bg-white shadow-md border-t-4 ${borderColor} rounded-lg h-full flex flex-col hover:shadow-lg transition-shadow"> 
            <div class="flex items-center justify-between">
              <div class="w-6 h-6">
                <img src="${isOpen ? "./assets/Open-Status.png" : "./assets/Closed-Status.png"}" alt="status">
              </div>
              <div class="badge badge-soft badge-outline text-[10px] uppercase font-bold">${element.priority}</div>
            </div>
            <h2 class="font-semibold text-[14px] text-[#1F2937] pt-[12px] pb-[8px] line-clamp-2">${element.title}</h2>
            <p class="text-[12px] text-[#64748B] line-clamp-2 mb-4">${element.description}</p>
            <div class="flex flex-wrap items-center justify-start gap-[6px] pb-[16px] mt-auto">
              ${labelsHTML}
            </div>
            <hr class="border-gray-100">
            <p class="pb-[3px] pt-[5px] text-[#64748B] text-[11px]">#${element.id} by ${element.author || "Anonymous"}</p>
            <p class="text-[#64748B] text-[11px]">${new Date(element.createdAt).toLocaleDateString()}</p>
          </div> 
        `;
    issusContent.append(div);
  });
}

function loadData() {
  loadingSpinner.classList.remove("hidden");
  issusContent.innerHTML = "";
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((data) => {
      allIssues = data.data;
      displayCards(allIssues);
    })
    .catch((err) => console.error("Error:", err))
    .finally(() => {
      loadingSpinner.classList.add("hidden");
    });
}

document.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON" && e.target.closest("section")) {
    const filterButtons = document.querySelectorAll("section button");
    filterButtons.forEach((btn) => {
      btn.classList.add("btn-outline");
      btn.classList.remove("btn-active");
    });

    e.target.classList.remove("btn-outline");
    const filterType = e.target.innerText.trim().toLowerCase();

    if (filterType === "all") {
      displayCards(allIssues);
    } else if (filterType === "open") {
      displayCards(allIssues.filter((issue) => issue.status === "open"));
    } else if (filterType === "closed") {
      displayCards(allIssues.filter((issue) => issue.status === "closed"));
    }
  }
});
loadData();
