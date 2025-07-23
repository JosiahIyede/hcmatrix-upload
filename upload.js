
async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");
  const videoPreview = document.getElementById("videoPreview");

  if (!file) return (statusText.textContent = "Please select a file.");
  const allowedTypes = ["video/mp4", "video/avi", "video/quicktime"];
  if (!allowedTypes.includes(file.type)) {
    return (statusText.textContent = "Allowed formats: .mp4, .avi, .mov");
  }
  if (file.size > 200 * 1024 * 1024) {
    return (statusText.textContent = "Max file size is 200MB.");
  }

  const blobName = encodeURIComponent(file.name);
  const containerUrl = `https://hrvideos.blob.core.windows.net/hcmatrix/Videos/${blobName}`;
  const sasToken = `sp=racw&st=2025-06-21T11:39:35Z&se=2025-06-27T19:39:35Z&skoid=d8741ab8-9c4d-4c24-9fc1-94a472734efc&sktid=ba130eca-3030-48e1-9089-c979293aeb70&skt=2025-06-21T11:39:35Z&ske=2025-06-27T19:39:35Z&sks=b&skv=2024-11-04&spr=https&sv=2024-11-04&sr=c&sig=QZx4ttSBiWGVXXhzCZ2XE5CFY4oeT4DwydY1vZrCA%2BA%3D`;
  const sasUrl = `${containerUrl}?${sasToken}`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", sasUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent + "%";
    }
  };

  xhr.onload = () => {
    if (xhr.status === 201) {
      statusText.textContent = "Upload successful!";
      videoPreview.src = sasUrl.split("?")[0];
      videoPreview.style.display = "block";
    } else {
      statusText.textContent = "Upload failed.";
    }
  };

  xhr.onerror = () => {
    statusText.textContent = "Error during upload.";
  };

  xhr.send(file);
}
