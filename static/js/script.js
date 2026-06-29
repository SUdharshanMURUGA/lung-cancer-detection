const dropzoneBox = document.getElementsByClassName("dropzone-box")[0];

const inputFiles = document.querySelectorAll(
  ".dropzone-area input[type='file']"
);

const inputElement = inputFiles[0];

const dropZoneElement = inputElement.closest(".dropzone-area");

inputElement.addEventListener("change", (e) => {
  if (inputElement.files.length) {
    updateDropzoneFileList(dropZoneElement, inputElement.files[0]);
  }
});

dropZoneElement.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZoneElement.classList.add("dropzone--over");
});

["dragleave", "dragend"].forEach((type) => {
  dropZoneElement.addEventListener(type, (e) => {
    dropZoneElement.classList.remove("dropzone--over");
  });
});

dropZoneElement.addEventListener("drop", (e) => {
  e.preventDefault();

  if (e.dataTransfer.files.length) {
    inputElement.files = e.dataTransfer.files;
    updateDropzoneFileList(dropZoneElement, e.dataTransfer.files[0]);
    // Call the handleFileChange function when dragover event occurs
    handleFileChange();
  }

  dropZoneElement.classList.remove("dropzone--over");
});

const updateDropzoneFileList = (dropzoneElement, file) => {
  let dropzoneFileMessage = dropzoneElement.querySelector(".message");

  dropzoneFileMessage.innerHTML = `
        ${file.name}, ${file.size} bytes
    `;
};

dropzoneBox.addEventListener("reset", (e) => {
  let dropzoneFileMessage = dropZoneElement.querySelector(".message");

  document.getElementById('img_viewport').style.display = 'none';
  document.getElementById('view_area').setAttribute('src',"");
  document.getElementById("file").value = "";
  dropzoneFileMessage.innerHTML = `No Files Selected`;
});

// Define the function for the changer event listener
function handleFileChange() {
  var filePath = document.getElementById("file").value;
  if(filePath!=""){
    var allowedExtensions = /(\.jpg|\.JPG|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(filePath)) {
      alert('Invalid file type. Allowed extensions are jpg, jpeg, png');
      dropzoneBox.dispatchEvent(new Event("reset"));
      document.getElementById("file").value="none";
    } else {
      var file = document.getElementById("file").files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('view_area').setAttribute('src', e.target.result);
          document.getElementById('img_viewport').style.display = 'inline';
        }
        reader.readAsDataURL(file);
      }
    }
  }
}

document.getElementById("file").addEventListener('change', handleFileChange);