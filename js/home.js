const issusContent = document.getElementById("issusContent");
const loadingSpinner = document.getElementById("loading-spinner");
let allIssues = [];

function displayCards(issues) {
  issusContent.innerHTML = "";
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
    div.innerHTML = `
          <div class="p-[16px] bg-white shadow-md border-t-4 ${borderColor} rounded-lg h-full flex flex-col"> 
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
  if (e.target.tagName === "BUTTON") {
    const filterButtons = document.querySelectorAll("button");
    filterButtons.forEach((btn) => {
      btn.classList.add("btn-outline");
      btn.classList.remove("btn-active");
    });
    e.target.classList.remove("btn-outline");
    const filterType = e.target.innerText.trim().toLowerCase();
    if (filterType === "all") {
      displayCards(allIssues);
    }
     else if (filterType === "open") {
      displayCards(allIssues.filter((issue) => issue.status === "open"));
    } 
    else if (filterType === "closed") {
      displayCards(allIssues.filter((issue) => issue.status === "closed"));
    }
  }
});

loadData();
