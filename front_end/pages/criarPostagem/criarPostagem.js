const input = document.getElementById("foto");
const preview = document.getElementById("preview-image");

input.addEventListener("change", function () {
    const arquivo = this.files[0];

    if (arquivo) {
        preview.src = URL.createObjectURL(arquivo);
    }
});