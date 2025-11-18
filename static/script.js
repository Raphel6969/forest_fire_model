const form = document.getElementById("upload-form");
const input = document.getElementById("image-input");
const resultDiv = document.getElementById("result");
const previewDiv = document.getElementById("preview");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  resultDiv.textContent = "Uploading...";
  previewDiv.innerHTML = "";
  if (!input.files || input.files.length === 0) {
    resultDiv.textContent = "Please select an image.";
    return;
  }
  const file = input.files[0];
  const formData = new FormData();
  formData.append("file", file);
  try {
    const resp = await fetch("/predict", { method: "POST", body: formData });
    const data = await resp.json();
    if (data.success) {
      resultDiv.textContent = `${data.label} (score: ${data.score.toFixed(3)})`;
      const img = document.createElement("img");
      img.src = data.image.replace("\\\\", "/");
      previewDiv.appendChild(img);
    } else {
      resultDiv.textContent = "Error: " + (data.error || "unknown");
    }
  } catch (err) {
    resultDiv.textContent = "Request failed: " + err.message;
  }
});
